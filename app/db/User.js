import React from 'react'
import {Alert, DeviceEventEmitter, Platform, Linking} from 'react-native'
import realm from './Schema'
import File from '../helpers/File'
import axios from '../helpers/Axios'
import Analytics from '../helpers/Analytics'
import DeviceInfo from 'react-native-device-info'

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
    // let observations = realm.objects('Submission').filtered('synced == false')
    let alertText    = {
      label    : 'Log out',
      labelText: 'Are you sure you would like to log out?',
      cancel   : 'Cancel',
      confirm  : 'Log out'
    }
    // if (observations.length > 0) {
    //   alertText = {
    //     label    : 'Warning',
    //     labelText: 'You have observations that are not uploaded. If you log out, these observations will be deleted permanently.',
    //     cancel   : 'Cancel',
    //     confirm  : 'Log out'
    //   }
    // }
    // let that = this
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

              // let submissions = realm.objects('Submission')
              // submissions.map((submission) => {
              //   let images = JSON.parse(submission.images)
              //   that.fs.delete(images)
              // })
              // realm.delete(submissions)
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
        this.createRealmUser(response.data.data)

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
      let locale = DeviceInfo.getDeviceCountry()
      let units  = 'metric'
      if (locale === 'US') {
        units = 'US'
      }
      requestParams.units = units

      axios.post('users', requestParams).then(response => {
        this.createRealmUser(response.data.data)

        // Broadcast that the user has registered
        DeviceEventEmitter.emit('userRegistered')

        // Call user function
        if (typeof resolve === 'function') {
          resolve(response)
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

  createRealmUser(response) {
    // write to realm
    realm.write(() => {
      // Delete existing users first
      let old_users = realm.objects('User')
      realm.delete(old_users)

      if (!response.zipcode) {
        response.zipcode = ''
      }

      realm.create('User', {
        name      : response.name.toString(),
        email     : response.email.toString(),
        anonymous : response.is_anonymous,
        zipcode   : response.zipcode,
        api_token : response.api_token,
        birth_year: response.birth_year,
        units     : response.units,
        provider  : response.provider || 'treesnap'
      })
    })
  }

  async socialLogin(api_token) {
    if (typeof api_token !== 'string' || api_token.length < 1) {
      return false
    }

    try {
      let response = await axios.get(`/user?api_token=${api_token}`)
      this.createRealmUser(response.data.data)
      DeviceEventEmitter.emit('userLoggedIn')
      return this.user()
    } catch (e) {
      console.log('HERE social login error', e)
      return false
    }
  }

  async loginWithGoogle() {
    let platform = Platform.select({ios: 'ios', android: 'android'})
    let url      = `https://treesnap.org/login/google?redirect_to=https://treesnap.org/mobile/login/${platform}`

    if (__DEV__) {
      // We have to use .app here instead of .test because it needs to be
      // SSL enabled for social networks to accept the connection
      url = `https://treesnap.app/login/google?redirect_to=https://treesnap.app/mobile/login/${platform}`
    }

    try {
      let supported = await Linking.canOpenURL(url)
      if (!supported) {
        Alert.alert('Error', 'Unable to link to Google. Please use Email login instead.')
        return
      }

      return Linking.openURL(url)
    } catch (e) {
      console.log(e)
    }
  }
}

export default new User()
