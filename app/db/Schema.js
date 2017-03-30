import Realm from 'realm'

/**
 * Define Coordinate Type
 * -------------------------------------------------
 * @type class
 */
const CoordinateSchema = {
  name      : 'Coordinate',
  properties: {
    latitude : {type: 'double', default: 0},
    longitude: {type: 'double', default: 0},
    accuracy : {type: 'int', default: 0}
  }
}

/**
 * Submissions Schema
 * -------------------------------------------------
 * Saves user's submissions locally and permanently.
 *
 * @type object
 */
const SubmissionSchema = {
  name      : 'Submission',
  primaryKey: 'id',
  properties: {
    id           : {type: 'int', default: 1},
    name         : {type: 'string', default: 'Tree'},
    species      : {type: 'string', default: ''},
    image        : {type: 'string', default: ''},
    // Example, {longitude: 'int', latitude: 'int'}
    location     : {type: 'Coordinate'},
    date         : {type: 'string', default: ''},
    synced       : {type: 'bool', default: false},
        // JSON String
        metaData : {type: 'string', default: ''}
  }
}


/**
 * User Schema
 * -------------------------------------------------
 * Saves user's info locally and permanently.
 * Keep track of their api token for contacting the website.
 *
 * @type object
 */

const UserSchema = {
  name      : 'User',
  properties: {
    name            : {type: 'string', default: 'default'},
    email           : {type: 'string', default: 'default'},
    anonymous       : {type: 'bool', default: false},
    api_token       : {type: 'string', default: ''},
    zipcode         : {type: 'string', default: ''},
    is_over_thirteen: {type: 'bool', default: false}
    //ignored fields present in DB
    //userid
    //password
    //remember_token
    //created_at
    //updated_at
  }
}

export default new Realm({
  schema: [
    UserSchema,
    CoordinateSchema,
    SubmissionSchema
  ]
})
