import axios from './Axios'
import realm from '../db/Schema'
import File from './File'
import moment from 'moment'
import Errors from './Errors'

class Observation {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor() {
    this.api_token = false
    this.fs        = new File()
  }

  /**
   * Upload record to API
   *
   * @param {Object} observation
   * @param {Function} callback
   * @returns {Promise<Promise>}
   */
  async upload(observation, callback) {
    this._setApiToken()
    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    // Don't sync already synced record
    if (observation.synced) {
      return
    }

    let form = this._setUpForm(observation)

    let response = await axios.post('observations', form)
    try {
      let id             = response.data.data.observation_id
      let imageResponses = await this.uploadImages(observation, id, callback)
    } catch (error) {
      this.delete(observation).then(() => {
        realm.write(() => {
          realmObservation.synced   = false
          realmObservation.serverID = -1
        })
      }).catch(error => {
        new Errors(error)

        let errors   = Errors.getErrors()
        let message = errors.general

        throw message
      })

      throw error
    }

    let realmObservation = realm.objects('Submission').filtered(`id == ${observation.id}`)[0]
    realm.write(() => {
      realmObservation.synced   = true
      realmObservation.serverID = response.data.data.observation_id
    })

    return response
  }

  /**
   * Get observations from API
   *
   * @returns {Promise<Promise>}
   */
  async get() {
    this._setApiToken()

    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    return await axios.get(`observations/?api_token=${this.api_token}`)
  }

  /**
   * Delete an observation from the server.
   *
   * @param observation
   * @return {Promise<*>}
   */
  async delete(observation) {
    this._setApiToken()

    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    return await axios.delete(`observation/${observation.serverID}`, {
      params: {
        api_token: this.api_token
      }
    })
  }


  /**
   * Sync a given observation.
   *
   * @param {Object} observation
   * @param {Function} callback
   * @returns {Promise.<*>}
   */
  async update(observation, callback) {
    this._setApiToken()

    if (this.api_token === false) {
      throw new Error('User not signed in')
    }


    if (!observation.needs_update) {
      return
    }

    if (!observation.serverID) {
      console.log('warning: Updating observation with no server ID. Local only.')
      return
    }

    let form     = this._setUpForm(observation)
    let response = await axios.post(`observation/${observation.serverID}`, form)

    try {
      await this.uploadImages(observation, observation.serverID, callback)
    } catch (error) {

      new Error(error)

      let errors = Error.getErrors()
      let message = errors.general
      throw message
    }

    return response
  }

  /**
   * Incrementally upload images of a given observation.
   * @param {Object} observation
   * @param {Number} id Observation Server ID
   * @param {Function} onSuccess
   * @return {Promise<Array>} An array of all successful responses
   */
  async uploadImages(observation, id, onSuccess) {
    const forms  = this._setUpImagesForm(observation)
    const length = forms.length

    let responses = []

    for (let i = 0; i < forms.length; i++) {
      try {
        let response = await axios.post(`observation/image/${id}`, forms[i])
        responses.push(response)

        if (typeof onSuccess === 'function') {
          onSuccess({
            completed: i + 1,
            total    : length,
            response : response
          })
        }
      } catch (error) {

        new Error(error)
        let errors =  Error.getErrors()

        let message = errors.general

        throw message      }
    }

    return responses
  }

  // Private Methods

  /**
   * Queries realm for an api key
   *
   * @private
   */
  _setApiToken() {
    let user = realm.objects('User')
    if (user.length > 0) {
      this.api_token = user[0].api_token
    } else {
      this.api_token = false
    }
  }

  /**
   * Formats the request for submission.
   *
   * @param observation
   * @return {FormData}
   * @private
   */
  _setUpForm(observation) {
    // Create form data
    let form = new FormData()
    form.append('observation_category', observation.name)
    form.append('meta_data', observation.meta_data)
    form.append('longitude', observation.location.longitude)
    form.append('latitude', observation.location.latitude)
    form.append('location_accuracy', observation.location.accuracy)
    form.append('date', observation.date)
    form.append('is_private', observation.is_private ? '1' : '0')
    form.append('api_token', this.api_token)
    form.append('mobile_id', observation.id)

    return form
  }

  /**
   *
   * @param observation
   * @private
   * @return {Array}
   */
  _setUpImagesForm(observation) {
    let images = JSON.parse(observation.images)
    let forms  = []

    // set up images
    Object.keys(images).map(key => {
      images[key].map(image => {
        let form = new FormData()
        let name = image.split('/')
        name     = name[name.length - 1]

        let extension = name.split('.')
        extension     = extension[extension.length - 1]

        let file = this.fs.image(image)
        form.append('api_token', this.api_token)
        form.append('image', {uri: file, name: name, type: `image/${extension}`})
        form.append('key', key)

        forms.push(form)
      })
    })

    return forms
  }

  /**
   * Download observations from the server and add them to realm
   * if they don't already exist
   */
  async download() {
    try {
      let response = await this.get()
      let records  = response.data.data

      records.map(record => {
        let primaryKey = parseInt(record.mobile_id)
        let count      = realm.objects('Submission')
          .filtered(`serverID == ${record.observation_id} OR id == ${primaryKey}`)
          .length

        if (count > 0) {
          return
        }

        realm.write(() => {
          realm.create('Submission', {
            id       : primaryKey,
            name     : record.observation_category,
            images   : JSON.stringify(record.images),
            location : record.location,
            date     : moment(record.date.date).format('MM-DD-YYYY HH:mm:ss').toString(),
            synced   : true,
            meta_data: JSON.stringify(record.meta_data),
            serverID : parseInt(record.observation_id)
          })
        })
      })

      await this.downloadImages()
    } catch (error) {

      new HTTPCodeHandler(error)
      let message =  HTTPCodeHandler.getStatusMessage()
      throw message    }
  }

  /**
   * Download images
   *
   * @return {Promise.<void>}
   */
  async downloadImages() {
    let observations = realm.objects('Submission')

    for (let key in observations) {
      try {
        await this.fs.download(observations[key])
      } catch (error) {

        console.log(`Failed to download ${observation.name}`)

        new HTTPCodeHandler(error)
        let message =  HTTPCodeHandler.getStatusMessage()
        throw message

      }
    }
  }
}

/**
 * Export an initiated instance of the class.
 */
export default new Observation()
