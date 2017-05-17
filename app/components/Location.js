import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native'
import {MKSpinner, MKButton} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition   : 'unknown',
      reachedMaxAccuracy: false,
      timeConsumed      : 0,
      done              : false
    }
  }

  /**
   * Start getting the location.  Use passed coordinates if editing.
   */
  componentDidMount() {
    if (this.props.edit) {
      console.log("Editing coords to: ", this.props.coordinates)
      let currentPosition = {"coords": {"latitude": this.props.coordinates.latitude, "longitude": this.props.coordinates.longitude, "accuracy": this.props.coordinates.accuracy}}
      this.setState({
        currentPosition   : currentPosition,
        reachedMaxAccuracy: true,
        done              : true
      })
      return
    }
    this.getLocation()
    this.updateLocation()
  }

  /**
   * Stop any location updates
   */
  componentWillUnmount() {
    clearTimeout(this.timeoutHolder)
  }

  /**
   * Set up a timer to update the location every 500 milliseconds
   */
  updateLocation() {
    this.timeoutHolder = setTimeout(() => {
      if (!this.state.done) {
        this.getLocation()
        this.updateLocation()
      }
    }, 500)
  }

  /**
   * Query the geolocation service for the current position
   */
  getLocation() {
    navigator.geolocation.getCurrentPosition(
      this.setLocation.bind(this),
      (error) => console.log(JSON.stringify(error)),
      {
        enableHighAccuracy: true,
        timeout           : 20000,
        maximumAge        : 1000
      }
    )
  }

  /**
   * Set the state and notify others of the location.
   *
   * @param position
   */
  setLocation(position) {
    this.latitude  = position.coords.latitude
    this.longitude = position.coords.longitude

    this.setState({
      currentPosition: position,
      timeConsumed   : this.state.timeConsumed + 500
    })

    // If accuracy reaches 10 meters, we are done
    if (parseInt(position.coords.accuracy) <= 10) {
      this.setState({
        reachedMaxAccuracy: true,
        done              : true
      })
    }

    // If 1 minute passes, accept location no matter the accuracy
    if ((this.state.timeConsumed / 1000) >= 60) {
      this.setState({done: true})
    }

    // Inform others of location changes
    this.props.onChange({
      longitude: position.coords.longitude,
      latitude : position.coords.latitude,
      accuracy : position.coords.accuracy
    })
  }

  retake =() => {
    this.setState({
      reachedMaxAccuracy: false,
      done              : false,
      timeConsumed      : 0,
    } )
    this.getLocation()
    this.updateLocation()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.coordsContainer}>
          <View style={styles.textContainer}>
          {!this.state.done &&
          <Text style={[styles.text, {color: '#aaa'}]}>Acquiring Location... {this.state.currentPosition.accuracy}</Text>
          }

          {this.state.done &&
          <Text style={[styles.text]}>{this.state.currentPosition.coords.latitude.toFixed(5)}, {this.state.currentPosition.coords.longitude.toFixed(5)}</Text>
          }

          {typeof this.state.currentPosition === 'object' &&
          <Text style={[styles.text, {color: '#aaa'}]}>Accuracy {this.state.currentPosition.coords.accuracy} meters</Text>
          }
        </View>
          {this.state.done &&
          <MKButton style={styles.button} onPress ={this.retake}>
          <Text style={styles.buttonText}>Retake location</Text></MKButton>
          }
        </View>

        {this.state.done ? <Icon name="check" style={[styles.icon, {color: Colors.primary}]}/> : <MKSpinner style={{width: 30, height: 30}}/>}

      </View>
    )
  }
}

Location.propTypes = {
  onChange   : PropTypes.func.isRequired,
  edit       : PropTypes.bool,
  coordinates: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex             : 1,
    paddingHorizontal: 1,
    flexDirection    : 'row',
    alignItems       : 'center'
  },

  coordsContainer: {
    flex: 1,
    flexDirection : 'column',
    paddingHorizontal : 0,
    alignItems : 'center'
  },
  textContainer: {
    flex: 0,
    flexDirection : 'row',
  },

  text: {
    flex     : 1,
    textAlign: 'left',
    fontSize : 12,
    color    : '#444'
  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : '#aaa'
  },
  button : {
    ...(new Elevation(1)),
    flex             : 0,
    borderRadius     : 2,
    paddingHorizontal: 5,
    paddingVertical  : 5
  },
  buttonText: {
    textAlign : 'center',
    color     : Colors.danger,
    fontWeight: 'bold'
  }
})
