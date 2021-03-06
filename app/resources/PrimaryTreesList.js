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
const TreesList = [
  {
    title    : 'American Chestnut',
    latinName: 'Castanea dentata',
    image    : require('../img/am_chestnut3.jpg'),
    locations: {
      alwaysShow: true
    }
  },

  {
    title    : 'Oregon Ash',
    image    : require('../img/oregon_ash/leaves.jpg'),
    latinName: 'Fraxinus latifolia',
    locations: {
      only: [
        'Washington', 
        'Oregon', 
        'California'
      ]
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
    title    : 'Florida Torreya',
    image    : require('../img/torreya/top_leaves.jpg'),
    latinName: 'Torreya taxifolia',
    locations: {
      only: ['Florida']
    }
  },
  {
    title    : 'Eastern Larch',
    latinName: 'Larix laricina',
    image    : require('../img/eastern_larch/id.png'),
    locations: {
      only: [
        'Minnesota',
        'Michigan',
        'Wisconsin',
        'Iowa',
        'Indiana',
        'Illinois',
        'Ohio',
        'West Virginia',
        'Maryland',
        'Pennsylvania',
        'New Jersey',
        'New York',
        'Maine',
        'Vermont',
        'New Hampshire',
        'Massachusetts',
        'Rhode Island',
        'Connecticut',
        'Alaska'
      ]
    }
  },
  {
    title    : 'Pacific Madrone',
    image    : require('../img/madrone/madrone.jpg'),
    latinName: 'Arbutus menziesii',
    locations: {
      only: [
        'California',
        'Oregon',
        'Washington'
      ]
    }
  },
  {
    title    : 'Tanoak',
    image    : require('../img/tanoak/tanoak.jpg'),
    latinName: 'Notholithocarpus densiflorus',
    locations: {
      only: [
        'California',
        'Oregon',
        'Washington',
      ]
    }
  },
  {
    title    : 'Butternut',
    image    : require('../img/butternut/fig2.jpg'),
    latinName: 'Juglans cinerea',
    locations: {
      alwaysShow: true,
    }
  },
  {
    title    : 'Pinyon Pine',
    image    : require('../img/pinyon/male_cones.jpg'),
    latinName: 'Pinus edulis',
    locations: {
      only: [
        'California',
        'Arizona',
        'Nevada',
        'New Mexico',
        'Colorado',
        'Utah',
        'Texas',
        'Oklahoma',
        'Wyoming',
      ]
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

export default TreesList
