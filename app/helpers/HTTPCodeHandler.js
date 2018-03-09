export default class HTTPCodeHandler {

  constructor(error){
    this.errorCode = error.request.status

    this.message = "An unexpected error has occurred"
  }

  getMessage() {
    return "message goes here"
  }

}