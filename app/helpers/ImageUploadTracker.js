import React from 'react'
import {Alert} from 'react-native'
import Errors from './Errors'

class ImageUploadTracker {
  constructor() {
    this.clear()
  }

  unableToUploadImage(response, total) {
    if (response.request && response.request._response) {
      if (response.request._response.indexOf('Could not retrieve file') > -1) {
        this._numberOfMissingFiles += 1

        let word1   = total === 1 ? 'image' : `out of ${total} images`
        let word2   = this._numberOfMissingFiles === 1 ? 'image' : 'images'
        let message = `Notice! ${this._numberOfMissingFiles} ${word1} could not be uploaded. The ${word2} will need to be retaken at the observation site.`

        if (this._missingFileIndex === -1) {
          this._messages.push(message)
          this._missingFileIndex = this._messages.length - 1
        } else {
          this._messages[this._missingFileIndex] = message
        }
      }
    } else {
      let errors = new Errors(response)
      if (errors.has('general')) {
        this._messages.push(errors.first('general'))
      }
    }
  }

  messages() {
    return this._messages
  }

  clear() {
    this._messages             = []
    this._numberOfMissingFiles = 0
    this._missingFileIndex     = -1
  }
}

const globalErrorHandler = new ImageUploadTracker()

export default function handler(error) {
  if (!error.success) {
    globalErrorHandler.unableToUploadImage(error.response, error.total)
  }

  if (error.completed === error.total) {
    let messages = globalErrorHandler.messages()

    if (messages.length > 0) {
      Alert.alert('Upload Completed', messages.join('\n'))
    }

    globalErrorHandler.clear()
  }
}
