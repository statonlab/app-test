/**
 * Form Schema
 * -------------------------------------------
 * Saves form data to persist between scenes.
 *
 * @type object
 */
export const FormSchema = {
  name      : 'form',
  primaryKey: 'id',
  properties: {
    id   : 'int',
    state: 'string' // Json string
  }
}

/**
 * Submissions Schema
 * -------------------------------------------
 * Saves user's submissions locally and permanently.
 *
 * @type object
 */
export const SubmissionSchema = {
  name      : 'submissions',
  primaryKey: 'id',
  properties: {
    id           : 'int',
    species      : {type: 'string', default: ''},
    numberOfTrees: {type: 'string', default: '1-10'},
    treeHeight   : {type: 'string', default: '0-10 feet'},
    deadTrees    : {type: 'string', default: 'none'},
    // Base64 encoded string
    image        : {type: 'string', default: ''},
    // Example, {longitude: 'int', latitude: 'int'}
    location     : {type: 'coordinate', default: {latitude: 0, longitude: 0}}
  }
}