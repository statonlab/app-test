import Axios from './Axios'
import realm from '../db/Schema'

class Observation {
  // Public Methods

  /**
   * Upload record to API
   *
   * @param observation
   * @returns {Promise<AxiosPromise>}
   */
  async upload(observation) {
    this._setApiToken()

    if (this.api_token === '') {
      throw Error('User not signed in')
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

    if (this.api_token === '') {
      throw Error('User not signed in')
    }

    return await Axios.get('observations', {
      api_token: this.api_token
    })
  }

  // Private Methods

  /**
   * Queries realm for an api key
   *
   * @private
   */
  _setApiToken() {
    let user       = realm.objects('User')
    this.api_token = ''
    if (user.length > 0) {
      this.api_token = user[0].api_token
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

    // set up images
    JSON.parse(observation.images).map((image, i) => {
      let name = image.split('/')
      name     = name[name.length - 1]

      let extension = name.split('.')
      extension     = extension[extension.length - 1]

      form.append(`images[${i}]`, {uri: `file:///${image}`, name, type: `image/${extension}`})
    })

    return form
  }
}

/**
 * Export an initiated instance of the class.
 */
export default new Observation()