import t from 'tcomb-validation'
import Axios from 'axios'


export default class Users  {
   routes = {
    login   : 'http://treesource.app/user',
    register: 'http://treesource.app/user'
  }

  tryLogin = () => {
    console.log("running try Login");
    this.putRequest();
    //First validate
    // if (!this.validateState().isValid()) {
    //   this.notifyIncomplete(this.validateState())
    //   return
    // }
    //Submit valid form
  }

  registerRequest = () => {
     return
  }

}
