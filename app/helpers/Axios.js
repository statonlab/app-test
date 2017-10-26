import {Platform} from 'react-native'
import Axios from 'axios'

// Set url based on environment
let url
if (__DEV__) {
  if(Platform.OS === 'android') {
    url = 'http://192.168.1.81:3000/api/v1/'
  } else {
    url = 'http://treesnap.app/api/v1/'
  }
} else {
  url = 'https://treesnap.org/api/v1/'
}

export default Axios.create({
  baseURL: url,
  timeout: 7000,
  headers: {Accept: 'application/json'}
})