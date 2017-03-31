import Axios from 'axios'

export default Axios.create({
  baseURL: 'https://treesource.almsaeedstudio.com/api/v1/',
  timeout: 7000
})