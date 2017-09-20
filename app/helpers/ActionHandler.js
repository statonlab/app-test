import realm from '../db/Schema'
import camelCase from 'camelcase'
import axios from './Axios'

export default class ActionHandler {
  /**
   * Create an ActionHandler
   *
   * @param {Object} payload The data returned by the server
   */
  constructor(payload) {
    this.id     = payload.id
    this.action = camelCase(payload.name)
    this.data   = payload.data
    this.user   = realm.objects('User')[0]

    // Inform developers if action is not defined
    if (typeof this[this.action] !== 'function' && __DEV__) {
      throw new Error(`The action handler for "${this.action}" is not defined. Please create an action handler.`)
    }
  }

  /**
   * Run the action.
   *
   * @return {*}
   */
  async run() {
    if (typeof this[this.action] !== 'function') {
      // Gracefully fail if the function is not defined
      return false
    }

    let done = this[this.action]()
    if (done) {
      return await this.completed()
    }

    return false
  }

  /**
   * Mark an action as completed.
   *
   * @return {Promise.<void>}
   */
  completed() {
    return axios.post(`/action/completed/${this.id}`, {api_token: this.user.api_token})
  }

  // Handlers
  // ==================================

  /**
   * Handle observation deleted action
   *
   * @return {Boolean}
   */
  observationDeleted() {
    const serverID   = this.data.observation_id
    let observations = realm.objects('Submission').filtered(`serverID == ${serverID}`)

    // Observation has already been deleted from device
    if (observations.length === 0) {
      return true
    }

    try {

      realm.write(() => {
        observations.forEach((observation) => {
          observation.delete()
        })
      })
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }

    return true
  }

  /**
   * Handle observation updated action
   *
   * @return {Boolean}
   */
  observationUpdated() {
    return false
  }
}