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
"404" : "some 404 error", "422" : "some 422 error"}


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


  getField(field) {
    if (this.errors[field]) {
      return this.errors[field][0]
    }
  }


  set(errors) {
    this.errors = errors
    this._extractErrors()
  }

  /**
   * Sets an error message.
   *
   * @private
   */
  _extractErrors(errors) {
    errorCode = this.errorCode

    switch (errorCode) {
      case 404:
        this.message = this.responses["404"]
        break//

      case 422:// this is the complciated case
        this.message = this.responses["422"]
        break


      case 500:

        this.message = this.responses["500"]
        break

      case -1:
        //No error code.  We either have an array of errors, or,  something has gone very wrong.
        break


    }
  }

  fetchCodes() {
    return this.responses
  }

  hasField(field) {
    return this.errors.hasOwnProperty(field)
  }

  any() {
    return Object.keys(this.errors).length > 0
  }

}
