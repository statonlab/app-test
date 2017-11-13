import axios from './Axios'
import ActionHandler from './ActionHandler'
import realm from '../db/Schema'

export default class Actions {
  constructor() {
    this._actions = []
    this._loaded  = false
    this.user     = realm.objects('User')[0]
  }

  /**
   * Load actions from the server.
   *
   * @return {Promise.<Actions>}
   */
  async load() {
    try {
      let response = await axios.get('/actions', {
        params: {
          api_token: this.user.api_token
        }
      })
      response.data.data.forEach(action => {
        this._actions.push(new ActionHandler(action))
      })

      this._loaded = true
    } catch (error) {
      console.log('loading error', error)
      this._loaded = true
      throw new Error(error)
    }
  }

  /**
   * Run action handlers.
   *
   * @return {Promise.<void>}
   */
  async run() {
    if (!this.user) {
      return
    }

    if (!this._loaded) {
      try {
        await this.load()
      } catch (error) {
        console.log('found actions error', error)
        throw new Error(error)
      }
    }

    for (let i in this._actions) {
      try {
        await this._actions[i].run()
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  /**
   * Get all loaded actions.
   *
   * @return {Array}
   */
  get() {
    return this._actions
  }
}