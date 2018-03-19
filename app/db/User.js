import React from 'react'
import {Alert, DeviceEventEmitter} from 'react-native'
import realm from './Schema'
import File from '../helpers/File'
import axios from '../helpers/Axios'
import Analytics from '../helpers/Analytics'

class User {
  /**
   * Create file handler.
   */
  constructor() {
    this.fs = new File()
  }

  /**
   * Check if user is signed in.
   *
   * @return {boolean}
   */
  loggedIn() {
    return realm.objects('User').length > 0
  }

  /**
   * Get user from realm.
   *
   * @return {*}
   */
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

  /**
   * Login a new user.
   *
   * @param email
   * @param password
   * @return {Promise}
   */
  login(email, password) {
    return new Promise((resolve, onFail) => {
      axios.post('user/login', {email, password}).then(response => {
        realm.write(() => {
          let user = realm.objects('User')
          if (user.length > 0) {
            // Delete existing users first
            realm.delete(user)
          }

          if (!response.data.data.zipcode) {
            response.data.data.zipcode = ''
          }

          let data = response.data.data

          realm.create('User', {
            name      : data.name,
            email     : data.email,
            anonymous : data.is_anonymous,
            zipcode   : data.zipcode,
            api_token : data.api_token,
            birth_year: data.birth_year,
            is_private: data.is_private
          })
        })

        const analytics = new Analytics()
        analytics.loggedIn(response.data.data.id)

        // Broadcast that the user has logged in
        DeviceEventEmitter.emit('userLoggedIn')

        if (typeof resolve === 'function') {
          resolve(response)
        }
      }).catch(error => {
        if (typeof onFail === 'function') {
          onFail(error)
        } else {
          throw error
        }
      })
    })
  }

  /**
   * Register user.
   *
   * @param requestParams
   * @return {Promise}
   */
  register(requestParams) {
    return new Promise((resolve, onFail) => {
      axios.post('users', requestParams).then(responseFull => {
        // write to realm
        realm.write(() => {
          // Delete existing users first
          let old_users = realm.objects('User')
          realm.delete(old_users)

          let response = responseFull.data.data

          if (!response.zipcode) {
            response.zipcode = ''
          }
          realm.create('User', {
            name      : response.name.toString(),
            email     : response.email.toString(),
            anonymous : response.is_anonymous,
            zipcode   : response.zipcode,
            api_token : response.api_token,
            birth_year: response.birth_year
          })
        })

        const analytics = new Analytics()
        analytics.registered(response.data.data.id)

        // Broadcast that the user has registered
        DeviceEventEmitter.emit('userRegistered')

        // Call user function
        if (typeof resolve === 'function') {
          resolve(responseFull)
        }
      }).catch((error) => {
        if (typeof onFail === 'function') {
          onFail(error)
        } else {
          throw error
        }
      })
    })
  }
}

export default new User()
