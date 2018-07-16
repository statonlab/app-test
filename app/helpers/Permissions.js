import React from 'react'
import {Alert, Platform} from 'react-native'
import PermissionsController from 'react-native-permissions'

class Permissions {
  constructor() {
    this.toCheck = [
      'location',
      'camera'
    ]

    if (Platform.OS === 'android') {
      this.toCheck.push('storage')
    }
  }

  async getAllRejected() {
    try {
      let response = await PermissionsController.checkMultiple(this.toCheck)
      let rejected = []

      for (let i = 0; i < this.toCheck.length; i++) {
        if (!response[this.toCheck[i]]) {
          continue
        }

        if (['denied', 'restricted'].indexOf(response[this.toCheck[i]]) > -1) {
          rejected.push(this.toCheck[i])
        }
      }

      return rejected
    } catch (e) {
      console.log('HERE permissions error, ', e)

      return []
    }
  }

  async notifyUserOfPermissionIssues() {
    let rejected = await this.getAllRejected()

    if (rejected.length > 0) {
      let message = 'Please enable the following services for TreeSnap to function properly:\n'
      message += rejected.join('\n')
      Alert.alert('Denied Permissions', message)
    }
  }
}

export default new Permissions()
