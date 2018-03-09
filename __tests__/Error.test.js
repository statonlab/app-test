import Error from '../app/helpers/Error'


describe("HTTPCodeHandler checking error codes", () => {

  let error500 = {
    response: {
      status: 500,
      data: null
    }
  }

  let error422 = {
    response: {
      status: 422,
      data: {
        email: [
          "Email must be a valid email address",
          "Email is required"
        ],
        name: [
          "Name is required"
        ],
        password: [
          "Any possible list of validation errors related to this field"
        ]
      }
    }
  }

  let error404 = {
    response: {
      status: 404,
      data: "Error message as a string in a response"
    }
  }

  let errorString = "Error message as a string without a response object"

  let fourTwentytwoCustomMessage = "custom 422 message"
  let error422_2 = {
    response: {
      status: 422,
      data: {
        error: fourTwentytwoCustomMessage,
        code: 100
      }
    }
  }

  let errorObject = {
    otherKeys : {
      thing: "things"
    }
  }


  it("should return the legend of error codes", () => {
    let handler = new Error()
    let codes = handler.fetchCodes()
    expect(codes).toHaveProperty("404")
    expect(codes).toHaveProperty("422")
    expect(codes).toHaveProperty("500")
  })

  it("should handle a basic string", () => {
    let handler = new Error(errorString)
    let message = handler.getMessage()
    expect(message).toBeDefined()
    expect(message).toBe(errorString)

  })

  it ('should handle error 500', () => {

    let handler = new Error(error500)

    let message = handler.getMessage()
    let codes = handler.fetchCodes()

    expect(message).toBeDefined()
    expect(message).toBe(codes["500"])

  })

  it ('should handle error 404', () => {

    let handler = new Error(error404)

    let message = handler.getMessage()
    let codes = handler.fetchCodes()

    expect(message).toBeDefined()
    expect(message).toBe(codes["404"])


  })

  it ('should handle error 422 with array', () => {

    let handler = new Error(error422)

    let message = handler.getMessage()
    let codes = handler.fetchCodes()


    expect(message).not.toBeDefined()
   // expect(message).toBe(codes["422"])

  })


  it ('should handle error 422 with custom message', () => {

    let handler = new Error(error422_2)

    let message = handler.getMessage()
    let codes = handler.fetchCodes()


    expect(message).toBeDefined()
    expect(message).toBe(fourTwentytwoCustomMessage)

  })


})



