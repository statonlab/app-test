import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {AppState, Alert} from 'react-native'
import realm from '../db/Schema'
import Notifications from 'react-native-push-notification'

export default class NotificationsController extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))
    Notifications.configure({
      onRegister: (token) => {

      },

      onNotification: (notification) => {
        Alert.alert(
          'Sync Observations',
          'Would you like to upload your observations now?',
          [
            {
              text   : 'Cancel',
              onPress: () => {
              },
              style  : 'cancel'
            },
            {
              text   : 'OK',
              onPress: () => {
                this.props.onUploadRequest()
              }
            }
          ],
          {cancelable: false}
        )
      }
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this))
  }

  _handleAppStateChange(nextState) {
    console.log('HERE', nextState)
    if (nextState === 'background') {
      const hasUnsynced = realm.objects('Submission').filtered('needs_update = true OR synced = false').length > 0
      if (hasUnsynced) {
        // 4 hours after the app goes into the background
        const date     = new Date(Date.now() + (4 * 60 * 60 * 1000))
        // In a dev environment display in 1 second
        const date_dev = new Date(Date.now() + (1000))
        Notifications.cancelAllLocalNotifications()
        Notifications.localNotificationSchedule({
          title  : 'TreeSnap',
          message: 'You have unsynced observations. Would you like to upload your observations?',
          date   : __DEV__ ? date_dev : date
        })
      }
    }
  }

  render() {
    return null
  }
}

NotificationsController.propTypes = {
  onUploadRequest: PropTypes.func.isRequired
}
