export default class HTTPCodeHandler {

  constructor(error){
    this.errorCode = error.response ? error.response.status : -1

    //code

    this.message = "An unexpected error has occurred"

    this._setMessage()
  }

  _setMessage(){

  }

  getMessage() {
    return this.message
  }

}