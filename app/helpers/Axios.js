
import Axios from 'axios'

// Set url based on environment
let url
// if (__DEV__) {
//   url = 'http://treesnap.app/api/v1/'
// } else {
  url = 'https://treesnap.org/api/v1/'
// }

export default Axios.create({
  baseURL: url,
  timeout: 7000,
  headers: {Accept: 'application/json'}
})