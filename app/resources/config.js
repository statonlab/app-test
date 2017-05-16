
const DCP = {
  treeHeight: {
    label        : 'Tree Height',
    selectChoices: [
      '0-10 feet', '11-50 feet', '51-100 feet', '>100 feet'
    ],
    description  : 'Please estimate the height of the tree for this observation. Some trees are very tall.',
    placeHolder  : 'tree height'
  },

  treeStand: {
    label        : 'Stand Density',
    selectChoices: [
      '1-10', '11-50', '51+'
    ],

    description: 'Full description of number of trees question.  No longer used.',
    placeHolder: 'Number of Trees'
  },

  deadTrees          : {
    label        : 'Dead Trees',
    selectChoices: ['none', '1-50', '51+'],
    description  : 'Of the trees of this species in this stand, how many are dead?  No longer used.',
    placeHolder  : 'Number of trees'
  },
  ashSpecies         : {
    label        : 'Species',
    selectChoices: [
      'White ash', 'Green ash', 'Blue ash', 'Black ash', 'Uncertain'
    ],
    description  : 'Which species of Ash tree is this?  If you aren\'t sure, select Uncertain',
    placeHolder  : 'Uncertain'
  },
  seedsBinary        : {
    label        : 'Seeds',
    selectChoices: [
      'Yes', 'No'
    ],
    description  : 'Are seeds present?',
    placeHolder  : 'Are seeds present?'
  },
  flowersBinary      : {
    label        : 'Flowers',
    selectChoices: [
      'Yes', 'No'
    ],
    description  : 'Is this tree flowering?',
    placeHolder  : 'Are flowers present?'
  },
  emeraldAshBorer    : {
    label        : 'Ash Borer',
    selectChoices: [
      'D-shaped adult exit holes', 'Bark coming off with tunneling underneath', 'Emerald ash borer beetless/larvae', 'stump sprouting'
    ],
    description  : 'Do you see any of these signs of emerald ash borers?  Check all that apply.',
    placeHolder  : 'No signs of pest',
    multiCheck   : true,
    images : [
      require('../img/DCP/EmAshBorer/EAB tunneling.jpg'),
      require('../img/DCP/EmAshBorer/Emerald ash borer adult.jpg')
    ]
  },
  woollyAdesPres      : {
    label: 'presence of Woolly adelgids'
  },
  woollyAdesCoverage  : {
    label        : 'Woolly adelgids',
    selectChoices: [
      '0-24%', '25-49%', '50-74%', '75-100%'
    ],
    description  : 'What percentage of the branches you see have hemlock Woolly adelgids?',
    placeHolder  : '% Adelgid coverage',
    images : [
      require('../img/DCP/HemWoolly/HWA photo 1.jpg'),
      require('../img/DCP/HemWoolly/HWA photo 2.jpg')
    ]
  },
  chestnutBlightSigns: {
    label        : 'Chestnut Blight',
    selectChoices: [
      'Cankers and cracked bark', 'Tan to orange-colored patches or pustules on bark', 'Evidence of old dead trunk', 'Stump sprouting'
    ],
    description  : 'Do you see any of these signs of chestnut blight?  Check all that apply.',
    placeHolder  : 'No blight symptoms',
    multiCheck   : true,
    images       : [
      require('../img/DCP/ChestnutBlight/Chestnut_blight.jpg')
    ],
  },
  acorns             : {
    label        : 'Acorns',
    selectChoices: [
      'None', 'Some', 'Lots'
    ],
    description  : 'Are there acorns on the tree?  Don\'t include fallen acorns on the ground in your estimate.',
    placeHolder  : 'Number of acorns'
  },
  heightFirstBranch  : {
    label        : 'Height of first branch',
    selectChoices: [
      '1-7 feet', '8-13 feet',
      '14-19 feet',
      '>20 feet'
    ],
    description  : 'Approximately (no need to measure) how high up is the first branch of the tree?',
    placeHolder  : 'Distance to branch'
  },
  oakHealthProblems  : {
    label        : 'Health problems',
    selectChoices: [
      'Dieback in canopy', 'Defoliation', 'Cankers', 'Bark damage', 'Signs of rot at base',
      'Other'
    ],
    description  : 'Do you see any of the following potential health problems?  Check all that apply.  If there is a health problem not listed below, please select other and describe in the comments section of the entry.',
    placeHolder  : 'No health problems',
    multiCheck   : true

  },
  diameterNumeric    : {
    label      : 'Tree diameter',
    description: 'Approximately how many feet is the diameter of the tree?',
    slider     : true,
    minValue : 1,
    maxValue : 50,
    units : "Inches",
    images : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg')
      ],
  //  startValue : 25,
  },
  crownHealth    : {
    label      : 'Crown health',
    description: 'How would you rate the health of this tree\'s crown?',
    slider     : true,
    minValue : 1,
    maxValue : 100,
    units : "%",
    images : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg')
     ],
  //  startValue : 100,
  },

  otherLabel : {
    label : 'Tree type',
    description: 'Please create a name to associate this entry with.  (ie Birch)',
    modalFreeText : true,
    placeHolder : "name (required)"
  },


}


export default DCP
