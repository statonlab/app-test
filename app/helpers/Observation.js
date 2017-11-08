import Axios from './Axios'
import realm from '../db/Schema'
import File from './File'
import moment from 'moment'

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
   * @param observation
   * @returns {Promise<AxiosPromise>}
   */
  async upload(observation) {
    this._setApiToken()
    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    // Don't sync already synced record
    if (observation.synced) {
      return
    }

    let form = this._setUpForm(observation)

    // Run AXIOS POST request
    return await Axios.post('observations', form)
  }

  /**
   * Get observations from API
   *
   * @returns {Promise<AxiosPromise>}
   */
  async get() {
    this._setApiToken()

    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    return await Axios.get(`observations/?api_token=${this.api_token}`)
  }


  /**
   * Sync a given observation.
   *
   * @param observation
   * @returns {Promise.<*>}
   */
  async update(observation) {
    this._setApiToken()

    if (this.api_token === false) {
      throw Error('User not signed in')
    }

    if (!observation.needs_update) {
      return
    }

    if (!observation.serverID) {
      console.log('warning: Updating observation with no server ID.  Local only.')
      return
    }

    let form = this._setUpForm(observation)

    return await Axios.post(`observation/${observation.serverID}`, form)
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
   * @returns {FormData}
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

    let images = JSON.parse(observation.images)

    // set up images
    Object.keys(images).map((key) => {
      images[key].map((image, i) => {
        let name = image.split('/')
        name     = name[name.length - 1]

        let extension = name.split('.')
        extension     = extension[extension.length - 1]

        let file = this.fs.image(image)
        form.append(`images[${key}][${i}]`, {uri: file, name: name, type: `image/${extension}`})
      })
    })

    return form
  }

  /**
   * Download observations from the server and add them to realm
   * if they don't already exist
   */
  async download() {
    try {
      let response = await this.get()
      let records  = response.data.data

      console.log(records)

      records.map(record => {
        let primaryKey = parseInt(record.mobile_id)
        let count      = realm.objects('Submission')
          .filtered(`serverID == ${record.observation_id} OR id == ${primaryKey}`)
          .length

        if (count > 0) {
          return
        }

        realm.write(() => {
          console.log('Creating observation')
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
      console.log(error)
    }
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
      }
    }
  }
}

/**
 * Export an initiated instance of the class.
 */
export default new Observation()