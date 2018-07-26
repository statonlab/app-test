import {Platform} from 'react-native'
import axios from 'axios'

// Set url based on environment
let url = 'https://treesnap.org/api/v1/'
if (__DEV__) {
  if (Platform.OS === 'android') {
    url = 'http://10.0.2.2:3000/api/v1/'
  } else {
    url = 'http://treesnap.test/api/v1/'
  }
}

/**
 * Specify maximum number of seconds before a request should timeout
 * @type {number}
 */
const TIMEOUT = 20000
const Axios   = new axios.create({
  baseURL: url,
  timeout: TIMEOUT,
  headers: {
    Accept: 'application/json'
  }
})

export default Axios
