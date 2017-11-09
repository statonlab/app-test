import Realm from 'realm'

/**
 * Define a guide schema.
 * -------------------------------------------------
 * Saves the state of the guide to determine whether
 * the user saw the message or not.
 *
 * @type object
 */
const GuideSchema = {
  name      : 'Guide',
  properties: {
    screen : {type: 'string'},
    version: {type: 'int'}
  }
}

/**
 * Define Coordinate Type.
 * -------------------------------------------------
 * @type object
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
 * Submissions Schema.
 * -------------------------------------------------
 * Saves user's submissions locally and permanently.
 *
 * @type object
 */
const SubmissionSchema = {
  name      : 'Submission',
  primaryKey: 'id',
  properties: {
    id          : {type: 'int', default: 1},
    name        : {type: 'string', default: 'Tree'},
    images      : {type: 'string', default: ''},
    // Example, {longitude: 'int', latitude: 'int'}
    location    : {type: 'Coordinate'},
    date        : {type: 'string', default: ''},
    synced      : {type: 'bool', default: false},
    // JSON String
    meta_data   : {type: 'string', default: ''},
    // The observation id returned by the server upon uploading
    serverID    : {type: 'int', default: -1},
    needs_update: {type: 'bool', default: false}
  }
}


/**
 * User Schema.
 * -------------------------------------------------
 * Saves user's info locally and permanently.
 * Keep track of their api token for contacting the website.
 *
 * @type object
 */

const UserSchema = {
  name      : 'User',
  properties: {
    name      : {type: 'string', default: 'default'},
    email     : {type: 'string', default: 'default'},
    anonymous : {type: 'bool', default: false},
    is_private: {type: 'bool', default: false},
    api_token : {type: 'string', default: ''},
    zipcode   : {type: 'string', default: ''},
    birth_year: {type: 'int', default: 1980},
    auto_sync : {type: 'bool', default: true}
  }
}

export default new Realm({
  schema       : [
    UserSchema,
    CoordinateSchema,
    SubmissionSchema,
    GuideSchema
  ],
  schemaVersion: 7,
  migration    : function (oldRealm, newRealm) {
    if (oldRealm.schemaVersion < 2) {
      let newUser = newRealm.objects('User')
      if (newUser.length > 0) {
        newUser.birthYear = 1984
      }
    }
    if (oldRealm.schemaVersion < 3) {
      let observations = newRealm.objects('Submission')
      observations.forEach(observation => {
        observation.needs_update = false
      })
    }
    if (oldRealm.schemaVersion < 4) {
      let observations = newRealm.objects('Submission')
      observations.forEach(observation => {
        let oldImages = JSON.parse(observation.images)
        if (Array.isArray(oldImages)) {
          observation.image = JSON.stringify({'images': oldImages})
        }
      })
    }
    if (oldRealm.schemaVersion < 5) {
      let user = newRealm.objects('User')
      if (user.length > 0) {
        user[0].is_private = false
      }
    }

    if (oldRealm.schemaVersion < 6) {
      let user = newRealm.objects('User')
      if (user.length > 0) {
        user[0].auto_sync = true
      }
    }
  }
})