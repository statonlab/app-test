const DCP = {
  ashSpecies         : {
    label        : 'Species',
    selectChoices: [
      'White ash', 'Green ash', 'Blue ash', 'Black ash', 'Uncertain'
    ],
    description  : 'Which species of ash tree is this?  If you aren\'t sure, select "Uncertain"',
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
    placeHolder  : 'Are flowers present?',
    camera       : ['Yes']

  },
  emeraldAshBorer    : {
    label        : 'Ash borer',
    selectChoices: [
      'D-shaped adult exit holes', 'Bark coming off with tunneling underneath',
      'Emerald ash borer beetles/larvae', 'Stump sprouting'
    ],
    description  : 'Do you see any of these signs of emerald ash borers?  Check all that apply.',
    placeHolder  : 'No signs of pest',
    multiCheck   : true,
    images       : [
      require('../img/DCP/EmAshBorer/EAB tunneling.jpg'),
      require('../img/DCP/EmAshBorer/Emerald ash borer adult.jpg'),
      require('../img/DCP/EmAshBorer/D-shaped_holes.jpg'),
      require('../img/DCP/EmAshBorer/epicormic_ash.jpg'),

    ],
    captions     : [
      "Tunneling under bark by EAB larvae. Photo credit: Eric R. Day, Virginia Polytechnic Institute and State University, Bugwood.org",
      "Adult EAB. Photo credit: David Cappaert, Bugwood.org",
      "D-shaped exit holes of adult EAB.  Photo credit: David R. McKay, USDA APHIS PPQ, Bugwood.org",
      "Stump sprouting or epicormic growth, where new sprouts emerge from the stump of a tree or the trunk, are a common sign of tree distress. Photo credit: Joseph OBrien, USDA Forest Service, Bugwood.org"
    ],
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
    ],
    camera       : ['1-24%', '25-49%', '50-74%', '75-100%']
  },
  chestnutBlightSigns: {
    label        : 'Chestnut blight',
    selectChoices: [
      'Cankers and cracked bark', 'Tan to orange-colored patches or pustules on bark', 'Evidence of old dead trunk', 'Stump sprouting'
    ],
    description  : 'Do you see any of these signs of chestnut blight?  Check all that apply.',
    placeHolder  : 'No blight symptoms',
    multiCheck   : true,
    images       : [
      require('../img/DCP/ChestnutBlight/Chestnut_blight.jpg'),
      require('../img/DCP/ChestnutBlight/cankers.jpg'),
      require('../img/DCP/ChestnutBlight/stumpsprouting.jpg'),

    ],
    captions     : ["The chestnut blight fungus can produce orange pustules on bark.  Photo credit: USDA Forest Service - Region 8 - Southern, USDA Forest Service, Bugwood.org",
      "An old dead trunk, previously killed by chestnut blight. Photo credit: Joseph OBrien, USDA Forest Service, Bugwood.org",
      "Stump sprouting, where new sprouts emerge from the stump of a tree, whether this tree is living or dead, are a common sign of tree distress.  Photo credit: Norbert Frank, University of West Hungary, Bugwood.org",
      "",
    ]
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
    placeHolder  : "Please select",
    camera       : ['yes']
  },

  heightFirstBranch      : {
    label      : 'Height of first branch',
    description: 'Approximately (no need to measure) how high up is the first branch of the tree?',
    slider     : true
  },
  oakHealthProblems      : {
    label        : 'Health problems',
    selectChoices: [
      'Dieback in canopy', 'Defoliation', 'Cankers', 'Bark damage', 'Signs of rot at base',
      'Other'
    ],
    description  : 'Do you see any of the following potential health problems?  Check all that apply.  If you check Other, please describe in comments.',
    placeHolder  : 'No health problems',
    multiCheck   : true,
  },
  diameterNumeric        : {
    label      : 'Tree diameter',
    description: 'Approximately how many feet is the diameter of the tree?',
    slider     : true,
    minValue   : 1,
    maxValue   : 40,
    units      : "Inches",
    images     : [require("../img/DCP/diameter_photo_1.jpg")]

    //  startValue : 25,
  },
  crownHealth            : {
    label      : 'Crown health',
    description: 'How would you rate the health of this tree\'s crown?',
    slider     : true,
    minValue   : 1,
    maxValue   : 100,
    units      : "%",

    //  startValue : 100,
  },
  crownClassification    : {
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
      'Forest', 'Wetland', 'Field', 'Roadside, urban, suburban, or park'
    ],
    placeHolder  : "Please select",
    multiCheck   : true,
  },

  nearbyTrees: {
    label        : 'Trees nearby',
    description  : 'If there are trees of the same species nearby, what state are they in?  Check all that apply.',
    selectChoices: [
      'Dead and/or dying', 'Healthy and large', 'Healthy and small', 'No trees of this species nearby', 'Not sure'],
    placeHolder  : "Please select",
    multiCheck   : true
  },
  // nearByHemlock          : {
  //   label        : "Nearby hemlocks",
  //   description  : "are there other hemlock trees nearby (within one mile?)",
  //   selectChoices: ["Yes, including healthy hemlocks",
  //     "Yes, but they are dead or dying",
  //     "No"],
  //   placeHolder  : "Please select"
  // },

  treated    : {
    label        : 'Treated',
    description  : "Has this tree been treated with Fungicides or pesticides?",
    selectChoices: ["Yes", "No", "Don't know"],
    placeHolder  : "Please select"
  },
  partOfStudy: {
    label        : 'Study',
    description  : "Is this tree already part of an existing study that you are aware of?  For example, there may a tag on the tree.",
    selectChoices: ["Yes", "No", "Don't know"],
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
    maxValue   : 150,
    units      : "Feet",
  },
  burrs          : {
    label        : 'Nuts/burrs',
    description  : 'Approximately how many nuts/burrs are present?',
    selectChoices: ["None", "Few", "Many", "Unknown"],
    placeHolder  : "Please select",
  },
  catkins        : {
    label        : 'Catkins',
    description  : 'Are catkins present?',
    selectChoices: ["Present", "Absent", "Unknown"],
    placeHolder  : "Please select",
  },

}


export default DCP
