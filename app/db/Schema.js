/**
 * Define Coordinate Type
 * -------------------------------------------------
 * @type class
 */
export const CoordinateSchema = {
  name      : 'Coordinate',
  properties: {
    latitude : {type: 'double', default: 0},
    longitude: {type: 'double', default: 0},
  }
}

/**
 * Form Schema
 * -------------------------------------------------
 * Saves form data to persist between scenes.
 *
 * @type object
 */
export const FormSchema = {
  name      : 'Form',
  properties: {
    id   : 'int',
    state: 'string' // Json string
  }
}

/**
 * Submissions Schema
 * -------------------------------------------------
 * Saves user's submissions locally and permanently.
 *
 * @type object
 */
export const SubmissionSchema = {
  name      : 'Submission',
  primaryKey: 'id',
  properties: {
    id           : {type: 'int'},
    name         : {type: 'string', default: 'Tree'},
    species      : {type: 'string', default: ''},
    numberOfTrees: {type: 'string', default: '1-10'},
    treeHeight   : {type: 'string', default: '0-10 feet'},
    deadTrees    : {type: 'string', default: 'none'},
    // Base64 encoded string
    image        : {type: 'string', default: ''},
    // Example, {longitude: 'int', latitude: 'int'}
    location     : {type: 'Coordinate'},
    comment      : {type: 'string', default: ''}
  }
}