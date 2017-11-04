import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, Alert, DeviceEventEmitter, TouchableOpacity} from 'react-native'
import {MKSpinner} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'

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
      let currentPosition = {'coords': {'latitude': this.props.coordinates.latitude, 'longitude': this.props.coordinates.longitude, 'accuracy': this.props.coordinates.accuracy}}
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
      (error) => {
        if (error.code === 1 && error.PERMISSION_DENIED) {
          // Permission Denied
          clearTimeout(this.timeoutHolder)

          Alert.alert(
            'Permission to access your location.',
            'Please enable location services from Settings -> TreeSnap -> Location',
            [{
              text: 'Ok', onPress: () => {
                DeviceEventEmitter.emit('LocationDenied')
              }
            }]
          )
        }
      },
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

  /**
   * Restart location acquiring.
   */
  retake = () => {
    this.setState({
      reachedMaxAccuracy: false,
      done              : false,
      timeConsumed      : 0
    })
    this.getLocation()
    this.updateLocation()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.coordsContainer}>
          {!this.state.done &&
          <Text style={[styles.text, {color: '#aaa'}]}>Acquiring Location...</Text>
          }

          {this.state.done &&
          <Text style={[styles.text]}>{this.state.currentPosition.coords.latitude.toFixed(5)}, {this.state.currentPosition.coords.longitude.toFixed(5)}</Text>
          }

          {typeof this.state.currentPosition === 'object' &&
          <Text style={[styles.text, {color: '#aaa'}]}>Accuracy {parseInt(this.state.currentPosition.coords.accuracy)} meters</Text>
          }

          {this.state.done &&
          <TouchableOpacity style={styles.button} onPress={this.retake}>
            <Text style={styles.buttonText}>Tap to retake location</Text></TouchableOpacity>
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
    flex             : 1,
    flexDirection    : 'column',
    paddingHorizontal: 0,
    alignItems       : 'center'
  },

  textContainer: {
    flex         : 0,
    flexDirection: 'row'
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

  button: {
    flex             : 0,
    borderRadius     : 2,
    paddingHorizontal: 5,
    paddingVertical  : 5
  },

  buttonText: {
    textAlign: 'center',
    color    : Colors.primary,
    fontSize : 12
  }
})
