import React, {Component, PropTypes} from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  AsyncStorage
} from 'react-native'
import MapView from 'react-native-maps'
import {MKSpinner, MKButton, getTheme} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

const theme = getTheme()

export default class GetLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition   : 'unknown',
      reachedMaxAccuracy: false,
      timeConsumed      : 0,
      done              : false
    }
  }

  componentDidMount() {
    this.updateLocation()
  }

  updateLocation() {
    this.timeoutHolder = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        this.setLocation.bind(this),
        (error) => console.log(JSON.stringify(error)),
        {
          enableHighAccuracy: true,
          timeout           : 20000,
          maximumAge        : 1000
        }
      )

      if (!this.state.done) this.updateLocation()
    }, 500)
  }

  setLocation(position) {
    this.latitude  = position.coords.latitude
    this.longitude = position.coords.longitude

    this.setState({
      currentPosition: position,
      timeConsumed   : this.state.timeConsumed + 500
    })

    this.saveLocation(position).then(() => {
      console.log('Saved location', position)
    })

    // If accuracy reaches 10 meters, we are done
    if (position.coords.accuracy <= 10) {
      this.setState({
        reachedMaxAccuracy: true,
        done              : true
      })
    }

    // If 1 minute passes, accept location no matter the accuracy
    if ((this.state.timeConsumed / 1000) >= 60) {
      this.setState({done: true})
    }
  }


  async saveLocation(position) {
    await AsyncStorage.mergeItem('@WildType:formData', JSON.stringify({location: position.coords}))
  }

  accept = () => {
    clearTimeout(this.timeoutHolder)
    this.props.accept()
  }

  cancel = () => {
    clearTimeout(this.timeoutHolder)
    this.props.cancel()
  }

  render() {
    return (
      <View {...this.props} style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            {!this.state.done &&
            <View style={[styles.cardMap, {justifyContent: 'center', alignItems: 'center'}]}>
              <MKSpinner prgress={.5} buffer={.5}></MKSpinner>
            </View>
            }

            {this.state.done &&
            <MapView
              style={styles.cardMap}
              region={{
               latitude: this.latitude,
               longitude: this.longitude,
               latitudeDelta : 0.0222,
               longitudeDelta: 0.0221
            }}>
              <MapView.Marker
                flat={true}
                coordinate={{
                 latitude: this.latitude,
                 longitude: this.longitude
              }}/>
            </MapView>
            }
          </View>
        </View>


        <View style={styles.card}>
          <View style={[styles.cardBody, {paddingVertical: 10}]}>
            {!this.state.done &&
            <View>
              <Text style={styles.text}>Attempting to Enhance Accuracy</Text>
              <Text style={[styles.text, {fontSize: 14}]}>This may take up to 1 minute</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {typeof this.state.currentPosition == 'object' ? this.state.currentPosition.coords.accuracy : '-1'} meters
              </Text>
            </View>
            }

            {this.state.done &&
            <View>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>Location Acquired</Text>
              <Text style={[styles.text, {fontSize: 14}]}>
                {this.state.currentPosition.coords.latitude},{this.state.currentPosition.coords.longitude}
              </Text>
              <Text style={[styles.text, {fontSize: 14, fontWeight: 'bold'}]}>
                Accuracy of {this.state.currentPosition.coords.accuracy} meters
              </Text>
            </View>
            }

            <View style={styles.row}>
              <MKButton
                style={styles.button}
                onPress={this.accept}>
                <Text style={styles.buttonText}>Accept Location</Text>
              </MKButton>
              <MKButton
                style={[styles.button, {backgroundColor: "#eee"}]}
                onPress={this.cancel}>
                <Text style={[styles.buttonText, {color: "#666"}]}>Cancel</Text>
              </MKButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

GetLocation.propTypes = {
  ...View.propTypes,
  accept: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container : {
    flex             : 1,
    paddingVertical  : 10,
    paddingHorizontal: 5
  },
  row       : {
    flexDirection : 'row',
    justifyContent: 'space-between'
  },
  button    : {
    padding        : 10,
    backgroundColor: Colors.primary,
    borderRadius   : 2,
    marginTop      : 10,
    ...(new Elevation(2))
  },
  buttonText: {
    color    : Colors.primaryText,
    textAlign: 'center'
  },
  card      : {
    ...theme.cardStyle,
    marginBottom: 15
  },
  cardImage : {
    ...theme.cardImageStyle,
    height         : 150,
    resizeMode     : 'cover',
    width          : undefined,
    borderRadius   : 3,
    backgroundColor: '#fff',
  },
  cardMap   : {
    height         : 200,
    borderRadius   : 3,
    backgroundColor: '#fff',
  },
  cardTitle : {
    ...theme.cardTitleStyle,
    fontSize: 14,
    flex    : 50,
    padding : 0,
    position: undefined,
    top     : 0,
    left    : 0
  },
  cardBody  : {
    padding: 5
  },
  text      : {
    textAlign   : 'center',
    fontSize    : 16,
    marginBottom: 10
  }
})
