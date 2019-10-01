import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppState, Alert, Platform } from 'react-native'
import realm from '../db/Schema'
import Notifications from 'react-native-push-notification'
import DeviceInfo from 'react-native-device-info'

export default class NotificationsController extends Component {
  constructor(props) {
    super(props)

    // Stop notifications for android devices that
    // don't support our implementation. This means
    // we won't support Samsung version 6
    // API 23 (Nougat) and under
    this.shouldMount = Platform.select({
      ios    : true,
      android: !(Platform.Version <= 23 && DeviceInfo.getBrand().toLowerCase().indexOf('samsung') > -1),
    })
  }

  componentDidMount() {
    if (!this.shouldMount) {
      return
    }

    AppState.addEventListener('change', this._handleAppStateChange.bind(this))

    this._configure()

    setTimeout(() => {
      // Clear all notifications if any was set
      Notifications.cancelAllLocalNotifications()
    }, 1000)
  }

  componentWillUnmount() {
    if (!this.shouldMount) {
      return
    }

    AppState.removeEventListener('change', this._handleAppStateChange.bind(this))
    Notifications.unregister()
  }

  _configure() {
    Notifications.configure({
      onRegister: (token) => {

      },

      onNotification: (notification) => {
        if (notification.message === 'You have unsynced observations. Would you like to upload your observations?') {
          Alert.alert(
            'Sync Observations',
            'Would you like to upload your observations now?',
            [
              {
                text   : 'Cancel',
                onPress: () => {
                },
                style  : 'cancel',
              },
              {
                text   : 'OK',
                onPress: () => {
                  this.props.onUploadRequest()
                },
              },
            ],
            {cancelable: false},
          )
        }
      },

      requestPermissions: true,
    })
  }

  _handleAppStateChange(nextState) {
    if (nextState === 'background') {
      // In a dev environment display in 1 second
      const date_dev = new Date(Date.now() + (2000))

      const hasUnsynced = realm.objects('Submission').filtered('needs_update = true OR synced = false').length > 0
      if (hasUnsynced) {
        Notifications.cancelAllLocalNotifications()
        Notifications.localNotificationSchedule({
          message: 'You have unsynced observations. Would you like to upload your observations?',
          // 24 hours (1 second in dev)
          date   : __DEV__ ? date_dev : new Date(Date.now() + (24 * 60 * 60 * 1000)),
        })
      }

      Notifications.localNotificationSchedule({
        message: 'It’s been a while since you last used TreeSnap. Take us on your next hike!',
        // 30 days (1 second in dev)
        date   : __DEV__ ? date_dev : new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
      })
    }
  }

  render() {
    return null
  }
}

NotificationsController.propTypes = {
  onUploadRequest: PropTypes.func.isRequired,
}
