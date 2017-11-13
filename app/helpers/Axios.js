import {Platform} from 'react-native'
import axios from 'axios'

// Set url based on environment
let url
if (__DEV__) {
  if (Platform.OS === 'android') {
    url = 'http://10.0.2.2:3000/api/v1/'
  } else {
    url = 'http://treesnap.app/api/v1/'
  }
} else {
  url = 'https://treesnap.org/api/v1/'
}

class Http {
  constructor() {
    axios.defaults.baseURL = url
    axios.defaults.timeout = 7000
    axios.defaults.headers = {
      Accept: 'application/json'
    }
  }

  get(url, params) {
    return this.send('get', url, params)
  }

  post(url, params) {
    return this.send('post', url, params)
  }

  put(url, params) {
    return this.send('put', url, params)
  }

  patch(url, params) {
    return this.send('patch', url, params)
  }

  delete(url, params) {
    return this.send('delete', url, params)
  }

  send(method, url, params) {
    if (typeof axios[method] !== 'function') {
      throw new Error('Axios ' + method + ' is not a function')
    }

    return new Promise((resolve, onFail) => {
      let loaded = false
      setTimeout(() => {
        if (!loaded) {
          onFail({
            timeout: true
          })
          loaded = true
        }
      }, 7000)

      axios[method](url, params).then(response => {
        if (!loaded) {
          loaded = true
          resolve(response)
        }
      }).catch(error => {
        if (!loaded) {
          loaded = true
          onFail(error)
        }
      })
    })
  }
}

export default new Http()