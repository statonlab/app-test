export default class HTTPCodeHandler {

  constructor(error){
    this.errorCode = error.request.status

    this.message = "An unexpected error has occurred"

    this._setMessage()
  }

  _setMessage(){


  }


  getMessage() {
    return this.message
  }

}