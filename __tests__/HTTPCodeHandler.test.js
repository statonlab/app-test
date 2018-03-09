import HTTPCodeHandler from '../app/helpers/HTTPCodeHandler'


describe("HTTPCodeHandler checking error codes", () => {

  it('should find an integer', () => {

    let error = {request: {status: 400, stuff: "some stuff" }, other_stuff: {more: "stuff"}}

    let handler = new HTTPCodeHandler(error)

    let message = handler.getMessage()

    expect(message).toBeDefined()
    expect(message).toBeString()

    //expect(message).toBeDefined("Success")


  })


})



