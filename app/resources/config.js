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
      'Yes', 'No', 'I\'m not sure'
    ],
    description  : 'Are seeds present?',
    placeHolder  : 'Are seeds present?',
    camera       : ['Yes']
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
      'D-shaped adult exit holes', 'Bark coming off with tunneling underneath', "Bark splitting",
      'Emerald ash borer beetles/larvae', 'Stump sprouting or epicormic growth', "Woodpecker feeding holes"
    ],
    description  : 'Do you see any of these signs of emerald ash borers?  Check all that apply.',
    placeHolder  : 'No signs of pest',
    multiCheck   : true,
    images       : [
      require('../img/DCP/EmAshBorer/EAB_tunneling.jpg'),
      require('../img/DCP/EmAshBorer/Emerald_ash_borer_adult.jpg'),
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
      '0%', '1-24%', '25-49%', '50-74%', '75-100%', 'I\'m not sure'
    ],
    description  : 'What percentage of the branches you see have hemlock Woolly adelgids?',
    placeHolder  : '% Adelgid coverage',
    images       : [
      require('../img/DCP/HemWoolly/HWA_photo_1.jpg'),
      require('../img/DCP/HemWoolly/HWA_photo_2.jpg')
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
      'None', 'Some', 'Lots', 'I\'m not sure'
    ],
    description  : 'Are there acorns on the tree?  Don\'t include fallen acorns on the ground in your estimate.',
    placeHolder  : 'Number of acorns'
  },
  cones              : {
    label        : 'Cones',
    description  : "Are cones present?  Please take a close-up photo if possible.",
    selectChoices: [
      'Yes', 'No', 'I\'m not sure'
    ],
    placeHolder  : "Please select",
    camera       : ['Yes']
  },

  heightFirstBranch      : {
    label      : 'Height of first branch',
    description: 'Approximately (no need to measure) how high up is the first main branch of the tree?',
   // slider     : true,
    units      : "Feet",
    numeric : true,
    placeHolder: "Height",
    default : 'Estimated',
    numberPlaceHolder: "Tap to enter height"
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
    label   : 'Tree diameter',
   // slider  : true,
    numeric : true,
    description  : "Please enter the diameter, in inches, of this tree below.  Is this a rough estimate or a precise measurement?",
    // minValue: 0,
    // maxValue: 40,
    units   : "Inches",
    images  : [require("../img/DCP/diameter.jpg")],
    selectChoices : ['Measured', 'Estimated'],
    default : 'Estimated',
    placeHolder: "Diameter"

    //  startValue : 25,
  },
  crownHealth            : {
    label        : 'Canopy health',
    description  : "What is the health of this tree's canopy?",
    selectChoices: ['1 - Healthy',
      '2 - Thinning',
      '3 - Some dead branches (less than 50%)',
      '4 - Many dead branches (more than 50%)',
      '5 - Completely dead',
      'I\'m not sure'],
    placeHolder  : "Please select",
    images       : [require('../img/DCP/canopy/canopy1.jpg'),
      require('../img/DCP/canopy/canopy2.jpg'),
      require('../img/DCP/canopy/canopy3.jpg'),
      require('../img/DCP/canopy/canopy4.jpg'),
      require('../img/DCP/canopy/canopy5.jpg'),
    ]
  },
  crownClassification    : {
    label        : 'Crown classification',
    description  : "What is the height of the crown of this tree relative to others in the stand?",
    selectChoices: ['Dominant. This tree\'s crown extends above others in the area.',
      'Codominant. This tree\'s crown is level with or slightly below other nearby trees.',
      'Overtopped. This tree\'s crown is entirely below other trees nearby.',
      'Not applicable (Tree is isolated)',
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
      'Dead and/or dying', 'Healthy and large', 'Healthy and small', 'No trees of this species nearby', 'I\'m not sure'],
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
  //  slider     : true,
    numeric : true,
    units      : "Feet",
    default : 'Estimated',
    placeHolder: "Height"
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

  //Torreya questions
  numberRootSprouts: {
    label : 'Root Sprouts',
    description: 'How many root sprouts are present?',
    numeric: true,
    units: 'sprouts',
  },
  deerRub: {
    label: "Deer Rub",
    description : 'Is there evidence of deer rub on the trunk?',
    selectChoices: ['Present', 'Absent', 'Not sure'],
    placeHolder : 'Please select'
  },
  torreyaFungalBlight: {
    label : "Fungal Blight",
    description: 'Do you see disease symptoms? Needles could be lighter in color, yellow, or absent. Cankers can be on trunk or branches.',
    selectChoices: ['Present', 'Absent', 'Not sure']

  },
  conesMaleFemale : {
    label : 'Cones',
    description: 'Are cones present?',
    selectChoices: ['Absent', 'Male present', 'Female present', 'Not sure']
  }

}


export default DCP
