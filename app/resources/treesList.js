/**
 * Trees list.
 *
 * locations options
 * - alwaysShow: {Boolean} If true, the tree get always displayed despite the user's location
 * - except: {Array} List of states to hide the tree when the user is in one of states
 *    * Example: ['California', 'Florida']
 * - only: {Array} List of states to show the tree when the user is in any of the states
 *    * Example: ['Florida', 'Georgia', 'Tennessee']
 * @type {*[]}
 */
const treesList = [
  {
    title    : 'American Chestnut',
    latinName: 'Castanea dentata',
    image    : require('../img/am_chestnut3.jpg'),
    locations: {
      alwaysShow: true
    }
  },
  {
    title    : 'Ash',
    latinName: 'Fraxinus sp.',
    image    : require('../img/ash.jpg'),
    locations: {
      alwaysShow: true
    }
  },
  {
    title    : 'Hemlock',
    latinName: 'Tsuga sp.',
    image    : require('../img/hemlock.jpg'),
    locations: {
      alwaysShow: true
    }
  },
  {
    title    : 'White Oak',
    latinName: 'Quercus alba',
    image    : require('../img/white_oak.jpg'),
    locations: {
      alwaysShow: true
    }
  },
  {
    title    : 'American Elm',
    latinName: 'Ulmus americana',
    image    : require('../img/elmleaf.jpg'),
    locations: {
      alwaysShow: true
    }
  },
  {
    title : 'Florida Torreya',
    image           : require('../img/torreya/top_leaves.jpg'),
    latinName       : 'Torreya taxifolia',
    locations: {
      alwaysShow: true
    }
  },
  {
    title    : 'Other',
    latinName: 'Other trees that aren\'t listed above',
    image    : require('../img/forest.jpg'),
    locations: {
      alwaysShow: true
    }
  }
]

export default treesList
