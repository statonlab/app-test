import Errors from '../app/helpers/Errors'


describe('Errors checking error codes', () => {

  let error500 = {
    response: {
      status: 500,
      data  : null
    }
  }

  let error404 = {
    response: {
      status: 404,
      data  : 'Error message as a string in a response'
    }
  }

  let errorString = 'Error message as a string without a response object'


  let error422 = {
    response: {
      status: 422,
      data  : {
        email   : [
          'Email must be a valid email address',
          'Email is required'
        ],
        name    : [
          'Name is required'
        ],
        password: [
          'Any possible list of validation errors related to this field'
        ]
      }
    }
  }

  let fourTwentytwoCustomMessage = 'custom 422 message'
  let error422_2                 = {
    response: {
      status: 422,
      data  : {
        error: fourTwentytwoCustomMessage,
        code : 100
      }
    }
  }

  let errorObject = {
    otherKeys: {
      thing: 'things'
    }
  }


  it('should return the legend of error codes', () => {
    let handler = new Errors()
    let codes   = handler.fetchCodes()
    expect(codes).toHaveProperty('404')
    expect(codes).toHaveProperty('422')
    expect(codes).toHaveProperty('500')
  })


  it('should handle a basic string', () => {
    let handler = new Errors(errorString)
    let errors  = handler.getErrors()
    let codes   = handler.fetchCodes()
    let message = errors['general']
    expect(message).toBeDefined()
    expect(message.length).toBe(1)
    expect(message[0]).toBe(errorString)
  })

  it('should handle error 500', () => {
    let handler = new Errors(error500)
    let errors  = handler.getErrors()
    let codes   = handler.fetchCodes()
    let message = errors['general']
    expect(message).toBeDefined()
    expect(message[0]).toBe(codes['500'])

  })

  it('should handle error 404', () => {
    let handler = new Errors(error404)
    let errors  = handler.getErrors()
    let codes   = handler.fetchCodes()
    let message = errors['general']
    expect(message).toBeDefined()
    expect(message[0]).toBe(codes['404'])

  })

  it('should handle error 422 with array', () => {
    let handler = new Errors(error422)
    let errors  = handler.getErrors()
    let codes   = handler.fetchCodes()

    let message = errors['general']//this is a different case, so no general key
    expect(message).not.toBeDefined()

    let keys = Object.keys(errors)

    expect(keys).not.toContain('beer')
    expect(keys).toContain('email')
    expect(keys).toContain('name')
    expect(keys).toContain('password')

  })


  it('should handle error 422 with custom message', () => {
    let handler = new Errors(error422_2)
    let errors  = handler.getErrors()
    let codes   = handler.fetchCodes()
    let message = errors['general']
    expect(message[0]).toBeDefined()
    expect(message[0]).toBe(fourTwentytwoCustomMessage)

  })

  it ('should handle an object of keys im not sure how this should behave', () => {

    let handler = new Errors(errorObject)

    //i dont know what to do in this case so im adding a fifailing test for now.
    expect(true).toBe(false)
  })


})



