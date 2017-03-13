import React, {Component, PropTypes} from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  AsyncStorage
} from 'react-native'
import {MKSpinner, MKButton, getTheme} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

const theme = getTheme()

export default class GetLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition: 'unknown'
    }
  }

  componentDidMount() {
    this.updateLocation()
  }

  updateLocation() {
    this.time = setTimeout(() => {
      let done = false;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({currentPosition: position});
          this.saveLocation(position).then(() => {
            console.log('Saved location', position)
          })
          if (position.coords.accuracy <= 50) {
            done = true;
            clearTimeout(this.time)
          }
        },
        (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      )

      if(done) {
        return
      }

      this.updateLocation()
    }, 500)
  }

  async saveLocation(position) {
    await AsyncStorage.mergeItem('@WildType:formData', JSON.stringify({location: position.coords}))
  }

  render() {
    return (
      <View {...this.props} style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={{alignItems: 'center', marginTop: 10, marginBottom: 20}}>
              <MKSpinner prgress={.5} buffer={.5}></MKSpinner>
            </View>
            <Text style={styles.text}>Attempting to enhance accuracy</Text>
            <Text style={[styles.text, {fontSize: 14}]}>This may take up to 2 minutes</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>{typeof this.state.currentPosition == 'object' && this.state.currentPosition.coords.accuracy} meters</Text>
            <View style={styles.row}>
              <MKButton
                style={styles.button}
                onPress={() => {
                  clearTimeout(this.time)
                  this.props.accept()
                }}>
                <Text style={styles.buttonText}>Accept Location</Text>
              </MKButton>
              <MKButton
                style={[styles.button, {backgroundColor: "#eee"}]}
                onPress={() => {
                  clearTimeout(this.time)
                  this.props.cancel()
                }}>
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
    padding: 10
  },
  text      : {
    textAlign   : 'center',
    fontSize    : 16,
    marginBottom: 10
  }
})
