/**
 * When theres an AXIOS catch statement, we are goign to run it through this HTTP Code Handler.
 *
 * The utilizer will then run getMessage() to use the message as appropriate.
 *
 * Or get list for a list of failed fields so that it can update the form with warnings.
 *
 */

//
//EXAMPLE USAGE:

// .catch(error => {
//   const errors = new Errors(error)
//   if(errors.has('general')) {
//     alert(error.first('general'))
//     return
//   }
//   this.setState({formErrors: errors.all()})
// })

code_responses = {"500": 'Server error 500: Please try again later',
"404" : "some 404 error", "422" : "some 422 error", "401" : 'You are not logged in! Please log in to upload to the server.', "403": "Authorization error: You don't have permission to access that observation."}


export default class Errors {

  constructor(error) {

    this.errors = {}

    this.responses = code_responses


    if (typeof error === 'string') {
      this.errors = {general : [error]}
      return
    }

    if (typeof error === 'object') {
      this.errorCode = error.response ? error.response.status : -1
    }


    this._extractErrors(error)

  }

  getErrors() {
    return this.errors
  }

  first (field) {
    return this.errors[field][0]
  }


  /**
   * Returns the responses used for different error codes: handy for testing.
   *
   * @returns {{'500': string, '404': string, '422': string}|*}
   */
  fetchCodes() {
    return this.responses
  }

  getField(field) {
    if (this.errors[field]) {
      return this.errors[field]
      //return this.errors[field][0]

    }
  }


  set(errors) {
    this.errors = errors
    this._extractErrors()
  }

  /**
   * Sets the errors object based on the errorCode.
   *
   * @private
   */
  _extractErrors(errors) {
    errorCode = this.errorCode

    switch (errorCode) {
      case 404:
        this.errors = {'general':  [this.responses["404"]]}
        break//

      case 500:

        this.errors = {'general':  [this.responses["500"]]}
        break

      //TODO: ADD 01 AND 403

      case 422:

        //there are 422 with custom errors, and 422s that are form validation rejections
        let data = errors.response.data

        if (data.error){//its a single error message
          this.errors = {general: [data.error]}

        }
        else {//its a set of key: message pairs
          this.errors = data
        }

        break

      default:
        //No error code or error code was -1 (unset, see intializer).  We either have an array of errors, or,  something has gone very wrong.

       this.errors = {'general': ["Network error!  Please check your internet connection and try again."]}

        break


    }
  }


  has(field) {
    return this.errors.hasOwnProperty(field)
  }

  any() {
    return Object.keys(this.errors).length > 0
  }

}
