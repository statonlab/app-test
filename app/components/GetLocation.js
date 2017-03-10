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
      initialPosition: 'unknown',
      lastPosition   : 'unknown',
    }
  }

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 500, maximumAge: 500}
    )
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = position //JSON.stringify(position)
      this.setState({lastPosition})
      this.saveLocation(position)
    })
  }

  saveLocation(position) {
    AsyncStorage.mergeItem('@WildType:formData', JSON.stringify({
      location: position.coords
    }))
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render() {
    return (
      <View {...this.props} style={styles.container}>
        <View style={styles.card}>
          <Image source={{uri: this.props.image.path}} style={styles.cardImage}/>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={{alignItems: 'center', marginTop: 10, marginBottom: 20}}>
              <MKSpinner prgress={.5} buffer={.5}></MKSpinner>
            </View>
            <Text style={styles.text}>Attempting to enhance accuracy</Text>
            <Text style={[styles.text, {fontSize: 14}]}>This may take up to 2 minutes</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>{typeof this.state.lastPosition == 'object' && this.state.lastPosition.coords.accuracy} meters</Text>
            <View style={styles.row}>
              <MKButton
                style={styles.button}
                onPress={this.props.accept}>
                <Text style={styles.buttonText}>Accept Location</Text>
              </MKButton>
              <MKButton
                style={[styles.button, {backgroundColor: "#eee"}]}
                onPress={this.props.cancel}>
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
  image : PropTypes.object.isRequired,
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
