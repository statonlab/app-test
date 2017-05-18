const DCP = {
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
    label        : 'Ash borer',
    selectChoices: [
      'D-shaped adult exit holes', 'Bark coming off with tunneling underneath', 'Emerald ash borer beetless/larvae', 'stump sprouting'
    ],
    description  : 'Do you see any of these signs of emerald ash borers?  Check all that apply.',
    placeHolder  : 'No signs of pest',
    multiCheck   : true,
    images       : [
      require('../img/DCP/EmAshBorer/EAB tunneling.jpg'),
      require('../img/DCP/EmAshBorer/Emerald ash borer adult.jpg')
    ]
  },
  woollyAdesPres     : {
    label: 'presence of Woolly adelgids'
  },
  woollyAdesCoverage : {
    label        : 'Woolly adelgids',
    selectChoices: [
      '0%', '1-24%', '25-49%', '50-74%', '75-100%'
    ],
    description  : 'What percentage of the branches you see have hemlock Woolly adelgids?',
    placeHolder  : '% Adelgid coverage',
    images       : [
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
  cones              : {
    label        : 'Cones',
    description  : "Are cones present?  Please take a close-up photo if possible.",
    selectChoices: [
      'Yes', 'No'
    ],
    placeHolder  : "Please select"
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
      'Other (please describe in comments)'
    ],
    description  : 'Do you see any of the following potential health problems?  Check all that apply.',
    placeHolder  : 'No health problems',
    multiCheck   : true

  },
  diameterNumeric    : {
    label      : 'Tree diameter',
    description: 'Approximately how many feet is the diameter of the tree?',
    slider     : true,
    minValue   : 1,
    maxValue   : 50,
    units      : "Inches",
    images     : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg')
    ],
    //  startValue : 25,
  },
  crownHealth        : {
    label      : 'Crown health',
    description: 'How would you rate the health of this tree\'s crown?',
    slider     : true,
    minValue   : 1,
    maxValue   : 100,
    units      : "%",
    images     : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg')
    ],
    //  startValue : 100,
  },
  crownClassification: {
    label        : 'Crown classification',
    description  : "What is the height of the crown of this tree relative to others in the stand?",
    selectChoices: ['Dominant. This tree\'s crown extends above others in the area.',
      'Codominant. This tree\'s crown is level with or slightly below other nearby trees.',
      'Overtopped. This tree\'s crown is entirely below other trees nearby.',
      'I\'m not sure.'],
    placeHolder  : "Please select"
  },


  otherLabel             : {
    label        : 'Tree type',
    description  : 'Please create a name to associate this entry with.  (ie Birch)',
    modalFreeText: true,
    placeHolder  : "name (required)"
  },
  locationCharacteristics: {
    label        : 'Habitat',
    description  : 'How would you characterize the habitat where the tree is located?',
    selectChoices: [
      'Floodplain', 'Upland forest', 'Swamp', 'Residence yard', 'Field', 'Roadside', 'Urban'
    ],
    placeHolder  : "Please select"
  },
  nearbyDead             : {
    label        : 'Dead trees nearby',
    description  : 'Are there dead or dying trees of this species within one mile of this tree?',
    selectChoices: ["Yes", "No", "Don't know"],
    placeHolder  : "Please select"
  },
  nearbySmall            : {
    label        : 'Healthy nearby',
    description  : 'Are there smaller, healthy trees of this species within one mile of this tree?',
    selectChoices: ["Yes", "No", "Don't know"],
    placeHolder  : "Please select"
  },
  nearByHemlock          : {
    label        : "Nearby hemlocks",
    description  : "are there other hemlock trees nearby (within one mile?)",
    selectChoices: ["Yes, including healthy hemlocks",
      "Yes, but they are dead or dying",
      "No"],
    placeHolder  : "Please select"
  },

  treated        : {
    label        : 'Treated',
    description  : "Has this tree been treated with Fungicides or pesticides?",
    selectChoices: ["Yes", "No", "Don't know"],
    placeHolder  : "Please select"
  },
  partOfStudy    : {
    label        : 'Study',
    description  : "Is this tree already part of an existing study that you are aware of?  For example, there may a tag on the tree.",
    selectChoices: ["Yes", "No", "Don't know"],
    placeHolder  : "Please select"
  },
  accessibility  : {
    label        : 'Accessibility',
    description  : "Could we access this tree with a large truck?",
    selectChoices: ["Yes", "No"],
    placeHolder  : "Please select"
  },
  locationComment: {
    comment: true
  },
  heightNumeric  : {
    label      : 'Tree height',
    description: 'Approximately how many feet tall is the tree?',
    slider     : true,
    minValue   : 1,
    maxValue   : 100,
    units      : "Feet",
    images     : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg')
    ],
    //  startValue : 25,
  },
  burrs          : {
    label        : 'Nuts/burrs',
    description  : 'Approximately how many nuts/burrs are present?',
    selectChoices: ["None", "Few", "Many", "Unknown"],
    placeHolder  : "Please select"
  },
  catkins        : {
    label        : 'Catkins',
    description  : 'Are catkins present?',
    selectChoices: ["Present", "Absent", "Unknown"],
    placeHolder  : "Please select"
  },
  surroundings   : {
    label        : "Surroundings",
    description  : "What is the shade coverage in this area?",
    selectChoices: ["Full sun", "Partial shade", "Full shade"],
    placeHolder  : "Please select"
  }


}


export default DCP
