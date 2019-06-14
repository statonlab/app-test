import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { CircleSnail } from 'react-native-progress'

const isAndroid = Platform.OS === 'android'

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition    : 'unknown',
      reachedMaxAccuracy : false,
      timeConsumed       : 0,
      done               : false,
      showOptionsModal   : false,
      showManualEntryForm: false,
      manualLongitude    : '',
      manualLatitude     : '',
    }
  }

  /**
   * Start getting the location.  Use passed coordinates if editing.
   */
  componentDidMount() {
    if (this.props.edit) {
      let currentPosition = {
        coords: {
          latitude : this.props.coordinates.latitude,
          longitude: this.props.coordinates.longitude,
          accuracy : this.props.coordinates.accuracy,
        },
      }

      this.setState({
        currentPosition   : currentPosition,
        reachedMaxAccuracy: true,
        done              : true,
      })

      return
    }

    // We are not editing so let's get the current location
    this.getLocation()
    this.updateLocation()
  }

  /**
   * Stop any location updates
   */
  componentWillUnmount() {
    clearTimeout(this.timeoutHolder)
    this.timeoutHolder = null
  }

  /**
   * Set up a timer to update the location every 500 milliseconds
   */
  updateLocation() {
    this.timeoutHolder = setTimeout(() => {
      if (this.timeoutHolder === null) {
        return
      }

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
          this.timeoutHolder = null

          Alert.alert(
            'Permission to access your location.',
            'Please enable location services from Settings -> TreeSnap -> Location',
            [{
              text   : 'Ok',
              onPress: () => {
                DeviceEventEmitter.emit('LocationDenied')
              },
            }],
          )
        }
      },
      {
        enableHighAccuracy: true,
        timeout           : 20000,
        maximumAge        : 1000,
      },
    )
  }

  /**
   * Set the state and notify others of the location.
   *
   * @param position
   */
  setLocation(position) {
    if (this.timeoutHolder === null) {
      return
    }

    if (!this.state.done) {
      this.setState({
        currentPosition: position,
        timeConsumed   : this.state.timeConsumed + 500,
      })

      // Inform others of location changes
      this.props.onChange({
        longitude: position.coords.longitude,
        latitude : position.coords.latitude,
        accuracy : position.coords.accuracy,
      })
    }

    // If accuracy reaches 10 meters, we are done
    if (parseInt(position.coords.accuracy) <= 10) {
      this.setState({
        reachedMaxAccuracy: true,
        done              : true,
      })
    }

    // If 30 seconds passes, accept location no matter the accuracy
    if ((this.state.timeConsumed / 1000) >= 30) {
      this.setState({done: true})
    }
  }

  /**
   * Restart location acquiring.
   */
  retake() {
    this.setState({
      reachedMaxAccuracy: false,
      done              : false,
      timeConsumed      : 0,
    })
    this.getLocation()
    this.updateLocation()
  }

  /**
   * Open the modal.
   */
  openOptionsModal() {
    this.setState({showOptionsModal: true})
  }

  /**
   * Validate and save the manual entry.
   */
  saveManualEntry() {
    let {manualLatitude, manualLongitude} = this.state

    manualLatitude  = manualLatitude.trim()
    manualLongitude = manualLongitude.trim()

    if (manualLatitude.length === 0) {
      alert('The latitude field is required')
      return
    }

    if (manualLongitude.length === 0) {
      alert('The longitude field is required')
      return
    }

    manualLatitude  = parseFloat(manualLatitude)
    manualLongitude = parseFloat(manualLongitude)

    if (isNaN(manualLongitude)) {
      alert('Please enter a valid longitude')
      return
    }

    if (isNaN(manualLatitude)) {
      alert('Please enter a valid latitude')
      return
    }

    if (manualLatitude > 90 || manualLatitude < -90) {
      alert('Latitude must be between -90 and 90 (inclusive)')
      return
    }

    if (manualLongitude > 180 || manualLongitude < -190) {
      alert('Longitude must be between -180 and 180 (inclusive)')
      return
    }

    let position = {
      latitude : manualLatitude,
      longitude: manualLongitude,
      // We can't set it to -1 since that indicates error so let's use -2 instead
      accuracy : -2,
    }

    // Nested set state to make sure the done param is true before
    // Setting the position. This prevents the auto GPS coordinates
    // from getting overridden
    this.setState({done: true, currentPosition: {coords: position}}, () => {
      // Inform others of location changes
      this.props.onChange(position)

      this.setState({
        reachedMaxAccuracy : true,
        currentPosition    : {
          coords: position,
        },
        showManualEntryForm: false,
        showOptionsModal   : false,
      })
    })
  }

  renderOptionsModal() {
    return (
      <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>
            {!this.state.showManualEntryForm ?
              'More Options'
              : 'Enter Coordinates'
            }
          </Text>
        </View>
        {this.state.showManualEntryForm ?
          <KeyboardAvoidingView style={{flex: 1}}
                                {...(isAndroid ? null : {behavior: 'padding'})}>
            <View style={{flex: 1}}>
              <Text style={[styles.label, {
                width : undefined,
                margin: 10,
                color : '#555',
              }]}>
                Coordinates must contain numerical values only
              </Text>
              <View style={[styles.field, styles.fieldHorizontal, {borderTopWidth: 1}]}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Example: 34.123456"
                  placeholderTextColor="#aaa"
                  value={this.state.manualLatitude}
                  onChangeText={manualLatitude => this.setState({manualLatitude})}
                  underlineColorAndroid="transparent"
                  autoFocus={true}
                  onSubmitEditing={() => this.longitudeInput ? this.longitudeInput.focus() : null}
                  returnKeyType={'next'}
                />
              </View>
              <View style={[styles.field, styles.fieldHorizontal]}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Example: -83.123456"
                  placeholderTextColor="#aaa"
                  value={this.state.manualLongitude}
                  onChangeText={manualLongitude => this.setState({manualLongitude})}
                  underlineColorAndroid="transparent"
                  ref={ref => this.longitudeInput = ref}
                  onSubmitEditing={() => this.saveManualEntry()}
                  returnKeyType={'done'}
                />
              </View>
            </View>
            <View style={{
              height           : 50,
              flexDirection    : 'row',
              paddingHorizontal: 10,
              alignItems       : 'center',
            }}>
              <TouchableOpacity
                onPress={this.saveManualEntry.bind(this)}
                style={[styles.formButton, {
                  backgroundColor: Colors.primary,
                  marginRight    : 5,
                }]}>
                <Text style={{
                  color     : Colors.primaryText,
                  fontWeight: '500',
                }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({showManualEntryForm: false})}
                style={[styles.formButton, {
                  backgroundColor: '#fff',
                  marginLeft     : 5,
                }]}>
                <Text style={{
                  color     : '#222',
                  fontWeight: '500',
                }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          : null}
        {!this.state.showManualEntryForm ?
          <View style={{flex: 1}}>
            <View style={styles.field}>
              <TouchableOpacity style={styles.touchableField}
                                onPress={() => this.setState({showManualEntryForm: true})}>
                <Icon name={'keyboard'} style={styles.fieldIcon}/>
                <Text style={styles.fieldText}>Enter GPS coordinates manually</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.field}>
              <TouchableOpacity style={styles.touchableField} onPress={() => {
                this.retake()
                this.setState({showOptionsModal: false})
              }}>
                <Icon name={'refresh'} style={styles.fieldIcon}/>
                <Text style={styles.fieldText}>Recapture Current Position</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null}
        {!this.state.showManualEntryForm ?
          <View style={{
            backgroundColor: '#eee',
            borderTopWidth : 1,
            borderTopColor : '#ccc',
            height         : isIphoneX() ? 60 : 40,
            alignItems     : 'flex-end',
            justifyContent : 'center',
            ...(isIphoneX() ? {paddingHorizontal: 10} : {}),
          }}>
            <TouchableOpacity style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center'}}
                              onPress={() => this.setState({showOptionsModal: false})}>
              <Text style={{color: Colors.primary, fontSize: 14, fontWeight: 'bold'}}>DONE</Text>
            </TouchableOpacity>
          </View>
          : null}
      </View>
    )
  }

  render() {
    let position = this.state.currentPosition
    let accuracy = typeof position === 'object' && position.coords ? parseInt(position.coords.accuracy) : null
    return (
      <View style={styles.container}>
        <View style={styles.coordsContainer}>
          {!this.state.done ?
            <Text style={[styles.text, {color: '#aaa'}]}>Acquiring Location...</Text>
            : null}

          {this.state.done && typeof position === 'object' && position.coords ?
            <Text style={[styles.text]}>
              {position.coords.latitude.toFixed(5)}, {position.coords.longitude.toFixed(5)}
            </Text>
            : null}

          {typeof position === 'object' ?
            <Text style={[styles.text, {color: '#aaa'}]}>
              {accuracy !== -2 ? `Accuracy ${accuracy} meters` : 'Manual GPS Entry'}
            </Text>
            : null}

          <TouchableOpacity style={styles.button} onPress={this.openOptionsModal.bind(this)}>
            <Text style={styles.buttonText}>More Options</Text>
          </TouchableOpacity>
        </View>

        {this.state.done ?
          <Icon name="check" style={[styles.icon, {color: Colors.primary}]}/> :
          <CircleSnail size={30} color={[Colors.primary, Colors.danger, Colors.warning]}/>
        }

        <Modal
          visible={this.state.showOptionsModal}
          animationType={'slide'}
          transparent={false}
          onRequestClose={() => this.setState({showOptionsModal: false})}
        >
          {this.renderOptionsModal()}
        </Modal>
      </View>
    )
  }
}

function getVerticalPadding() {
  if (Platform.OS === 'android') {
    return 10
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 20
  }
}

Location.propTypes = {
  onChange   : PropTypes.func.isRequired,
  edit       : PropTypes.bool,
  coordinates: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    flex             : 1,
    paddingHorizontal: 1,
    flexDirection    : 'row',
    alignItems       : 'center',
  },

  coordsContainer: {
    flex             : 1,
    flexDirection    : 'column',
    paddingHorizontal: 0,
    alignItems       : 'center',
  },

  textContainer: {
    flex         : 0,
    flexDirection: 'row',
  },

  text: {
    flex     : 1,
    textAlign: 'left',
    fontSize : 12,
    color    : '#444',
  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : '#aaa',
  },

  button: {
    flex             : 0,
    borderRadius     : 2,
    paddingHorizontal: 5,
    paddingVertical  : 5,
  },

  buttonText: {
    textAlign: 'center',
    color    : Colors.primary,
    fontSize : 12,
  },

  modalHeader: {
    flex           : 0,
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    paddingBottom  : 10,
    ...(new Elevation(2)),
  },

  modalHeaderText: {
    color          : Colors.primaryText,
    textAlign      : 'center',
    fontWeight     : 'normal',
    fontSize       : 16,
    paddingVertical: 5,
  },

  field: {
    borderBottomWidth: 1,
    borderColor      : '#ccc',
    backgroundColor  : '#fff',
  },

  touchableField: {
    paddingHorizontal: 10,
    height           : 50,
    flexDirection    : 'row',
    alignItems       : 'center',
  },

  fieldText: {
    fontSize: 14,
    color   : '#222',
  },

  fieldIcon: {
    fontSize   : 20,
    marginRight: 10,
    color      : '#999',
  },

  fieldHorizontal: {
    flexDirection    : 'row',
    paddingHorizontal: 10,
    alignItems       : 'center',
  },

  label: {
    width   : 90,
    color   : '#222',
    fontSize: 14,
  },

  input: {
    flex           : 1,
    height         : 40,
    backgroundColor: '#fff',
  },

  formButton: {
    flex          : 1,
    height        : 40,
    justifyContent: 'center',
    alignItems    : 'center',
    borderRadius  : 2,
    ...(new Elevation(2)),
  },
})
