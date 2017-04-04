import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native'
import {MKSpinner} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Color from '../helpers/Colors'

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

  componentDidMount() {
    this.getLocation()
    this.updateLocation()
  }

  updateLocation() {
    this.timeoutHolder = setTimeout(() => {
      if (!this.state.done) {
        this.getLocation()

        this.updateLocation()
      }
    }, 500)
  }

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
    DeviceEventEmitter.emit('locationCaptured', {
      longitude: position.coords.longitude,
      latitude : position.coords.latitude,
      accuracy : position.coords.accuracy
    })
  }

  cancel = () => {
    clearTimeout(this.timeoutHolder)
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.done &&
        <Text style={[styles.text, {color: '#aaa'}]}>Acquiring location...</Text>
        }

        {this.state.done &&
        <Text style={[styles.text]}>{this.state.currentPosition.coords.latitude.toFixed(5)}, {this.state.currentPosition.coords.longitude.toFixed(5)}</Text>
        }

        {this.state.done ? <Icon name="check" style={[styles.icon, {color: Color.primary}]}/> : <MKSpinner style={{width: 30, height: 30}}/>}
      </View>
    )
  }
}

Location.propTypes = {}

const styles = StyleSheet.create({
  container: {
    flex             : 1,
    paddingHorizontal: 5,
    flexDirection    : 'row',
    height           : 40,
    alignItems       : 'center'
  },

  text: {
    flex     : 1,
    textAlign: 'left',
    fontSize : 14,
    color    : '#444'
  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : '#aaa'
  }
})
