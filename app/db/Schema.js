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
    id       : {type: 'int', default: 1},
    name     : {type: 'string', default: 'Tree'},
    images   : {type: 'string', default: ''},
    // Example, {longitude: 'int', latitude: 'int'}
    location : {type: 'Coordinate'},
    date     : {type: 'string', default: ''},
    synced   : {type: 'bool', default: false},
    // JSON String
    meta_data: {type: 'string', default: ''},
    // The observation id returned by the server upon uploading
    serverID : {type: 'int', default: -1}
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
    birth_year      : {type: 'int', default: 1980}
  }
}

export default new Realm({
  schema       : [
    UserSchema,
    CoordinateSchema,
    SubmissionSchema
  ],
  schemaVersion: 2,
  migration    : function (oldRealm, newRealm) {
    if (oldRealm.schemaVersion < 2) {
      let newUser = newRealm.objects('User')
      if (newUser.length > 0) {
        newUser.birthYear = 1984
      }
    }
  }
})
