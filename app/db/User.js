import React from 'react'
import {Alert, DeviceEventEmitter} from 'react-native'
import realm from './Schema'
import File from '../helpers/File'

class User {
  constructor() {
    this.fs = new File()
  }

  loggedIn() {
    return realm.objects('User').length > 0
  }

  user() {
    let users = realm.objects('User')
    if (users.length > 0) {
      return users[0]
    }

    return null
  }

  /**
   * Logs the user out after confirming the click.
   */
  logout = () => {
    //Set alert text
    let observations = realm.objects('Submission').filtered('synced == false')
    let alertText    = {
      label    : 'Log out',
      labelText: 'Are you sure you would like to log out?',
      cancel   : 'Cancel',
      confirm  : 'Log out'
    }
    if (observations.length > 0) {
      alertText = {
        label    : 'Warning',
        labelText: 'You have observations that are not uploaded.  If you log out, these observations will be deleted permanently.',
        cancel   : 'Cancel',
        confirm  : 'Log out'
      }
    }
    let that = this
    Alert.alert(
      alertText.label,
      alertText.labelText, [
        {
          text: alertText.confirm, style: 'destructive',
          onPress                       : () => {
            // Deletes all user records thus logging out
            realm.write(() => {
              let user = realm.objects('User')
              realm.delete(user)

              let submissions = realm.objects('Submission')
              submissions.map((submission) => {
                let images = JSON.parse(submission.images)
                that.fs.delete(images)
              })
              realm.delete(submissions)
            })
            DeviceEventEmitter.emit('userLoggedOut')
          }
        },
        {text: alertText.cancel, style: 'cancel'}
      ])
  }
}

export default new User()