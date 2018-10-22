const DCP = {
  ashSpecies: {
    label        : 'Species',
    selectChoices: [
      'White ash', 'Green ash', 'Blue ash', 'Black ash', 'Uncertain'
    ],
    description  : 'Which species of ash tree is this?  If you aren\'t sure, select "Uncertain"',
    placeHolder  : 'Uncertain',
    images       : [
      require('../img/ash_id/ash_bark.jpg'),
      require('../img/ash_id/ash_buds.jpg'),
      require('../img/ash_id/ash_leaves.jpg'),
      require('../img/ash_id/ash_seeds.jpg')
    ]
  },

  seedsBinary: {
    label        : 'Seeds',
    selectChoices: [
      'Yes', 'No', 'I\'m not sure'
    ],
    description  : 'Are seeds present?',
    placeHolder  : 'Are seeds present?',
    camera       : ['Yes'],
    conditional  : {
      'Florida Torreya': {
        images  : [
          require('../img/torreya/Torreya_taxifolia4.jpg'),
          require('../img/torreya/Torreya_taxifolia5.jpg')
        ],
        captions: [
          'Seed of female Florida Torreya.  Photo credit: Guy Anglin, Atlas of Florida Plants, Institute for Systematic Botany, University of South Florida, Tampa.',
          'Female Florida Torreya branches with seeds.  Photo credit: Guy Anglin, Atlas of Florida Plants, Institute for Systematic Botany, University of South Florida, Tampa.'
        ]

      }
    }
  },

  flowersBinary: {
    label        : 'Flowers',
    selectChoices: [
      'Yes', 'No'
    ],
    description  : 'Is this tree flowering?',
    placeHolder  : 'Are flowers present?',
    camera       : ['Yes']

  },

  emeraldAshBorer: {
    label        : 'Ash borer',
    selectChoices: [
      'D-shaped adult exit holes', 'Bark coming off with tunneling underneath', 'Bark splitting',
      'Emerald ash borer beetles/larvae', 'Stump sprouting or epicormic growth', 'Woodpecker feeding holes'
    ],
    description  : 'Do you see any of these signs of emerald ash borers?  Check all that apply.',
    placeHolder  : 'No signs of pest',
    multiCheck   : true,
    images       : [
      require('../img/DCP/EmAshBorer/EAB_tunneling.jpg'),
      require('../img/DCP/EmAshBorer/Emerald_ash_borer_adult.jpg'),
      require('../img/DCP/EmAshBorer/D-shaped_holes.jpg'),
      require('../img/DCP/EmAshBorer/epicormic_ash.jpg')
    ],
    captions     : [
      'Tunneling under bark by EAB larvae. Photo credit: Eric R. Day, Virginia Polytechnic Institute and State University, Bugwood.org',
      'Adult EAB. Photo credit: David Cappaert, Bugwood.org',
      'D-shaped exit holes of adult EAB.  Photo credit: David R. McKay, USDA APHIS PPQ, Bugwood.org',
      'Stump sprouting or epicormic growth, where new sprouts emerge from the stump of a tree or the trunk, are a common sign of tree distress. Photo credit: Joseph OBrien, USDA Forest Service, Bugwood.org'
    ]
  },

  woollyAdesCoverage: {
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

  hemlockSpecies: {
    label        : 'Species',
    description  : 'Which species of Hemlock is this tree? If you are\'t sure, select I\'m not sure.',
    placeHolder  : 'Select one',
    selectChoices: [
      'Eastern hemlock (Tsuga canadensis)',
      'Carolina hemlock (Tsuga caroliniana)',
      'Other hemlock species',
      'I\'m not sure'
    ],
    images       : [
      require('../img/hemlock_id/hemlock_species.jpg')
    ],
    multiCheck   : false
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
      require('../img/DCP/ChestnutBlight/stumpsprouting.jpg')
    ],
    captions     : ['The chestnut blight fungus can produce orange pustules on bark.  Photo credit: USDA Forest Service - Region 8 - Southern, USDA Forest Service, Bugwood.org',
      'An old dead trunk, previously killed by chestnut blight. Photo credit: Joseph OBrien, USDA Forest Service, Bugwood.org',
      'Stump sprouting, where new sprouts emerge from the stump of a tree, whether this tree is living or dead, are a common sign of tree distress.  Photo credit: Norbert Frank, University of West Hungary, Bugwood.org',
      ''
    ]
  },

  acorns: {
    label        : 'Acorns',
    selectChoices: [
      'None', 'Some', 'Lots', 'I\'m not sure'
    ],
    description  : 'Are there acorns on the tree?  Don\'t include fallen acorns on the ground in your estimate.',
    placeHolder  : 'Number of acorns'
  },

  cones: {
    label        : 'Cones',
    description  : 'Are cones present?  Please take a close-up photo if possible.',
    selectChoices: [
      'Yes', 'No', 'I\'m not sure'
    ],
    placeHolder  : 'Please select',
    camera       : ['Yes']
  },

  heightFirstBranch: {
    label            : 'Height of first branch',
    description      : 'Approximately how high up is the first main branch of the tree?',
    units            : {US: 'Feet', metric: 'Meters'},
    numeric          : true,
    placeHolder      : 'Height',
    default          : 'Estimated',
    numberPlaceHolder: 'Tap to enter height'
  },

  oakHealthProblems: {
    label        : 'Health problems',
    selectChoices: [
      'Dieback in canopy', 'Defoliation', 'Cankers', 'Bark damage', 'Signs of rot at base',
      'Other'
    ],
    description  : 'Do you see any of the following potential health problems?  Check all that apply.  If you check Other, please describe in comments.',
    placeHolder  : 'No health problems',
    multiCheck   : true
  },

  diameterNumeric: {
    label            : 'Tree diameter',
    // slider  : true,
    numeric          : true,
    description      : 'Please enter the diameter, in inches, of this tree below. Choose the largest stem if there are multiple. Is this a rough estimate or a precise measurement?',
    // minValue: 0,
    // maxValue: 40,
    units            : {US: 'Inches', metric: 'cm'},
    images           : [require('../img/DCP/diameter.jpg')],
    captions         : ['Note: if the tree is less than 4 feet tall, please take the stem diameter at the height of the first branch.'],
    selectChoices    : ['Measured', 'Estimated'],
    default          : 'Estimated',
    placeHolder      : 'Diameter',
    numberPlaceHolder: 'Tap to enter diameter'
    //  startValue : 25,
  },

  crownHealth: {
    label        : 'Canopy health',
    description  : 'What is the health of this tree\'s canopy?',
    selectChoices: ['1 - Healthy',
      '2 - Thinning',
      '3 - Some dead branches (less than 50%)',
      '4 - Many dead branches (more than 50%)',
      '5 - Completely dead',
      'I\'m not sure'],
    placeHolder  : 'Please select',
    images       : [require('../img/DCP/canopy/canopy1.jpg'),
      require('../img/DCP/canopy/canopy2.jpg'),
      require('../img/DCP/canopy/canopy3.jpg'),
      require('../img/DCP/canopy/canopy4.jpg'),
      require('../img/DCP/canopy/canopy5.jpg')
    ]
  },

  crownClassification: {
    label        : 'Crown classification',
    description  : 'What is the height of the crown of this tree relative to others in the stand?',
    selectChoices: ['Dominant. This tree\'s crown extends above others in the area.',
      'Codominant. This tree\'s crown is level with or slightly below other nearby trees.',
      'Overtopped. This tree\'s crown is entirely below other trees nearby.',
      'Not applicable (Tree is isolated)',
      'I\'m not sure.'],
    placeHolder  : 'Please select'
  },

  otherLabel: {
    label        : 'Tree type',
    description  : 'Please create a name to associate this entry with.  (ie Birch)',
    modalFreeText: true,
    placeHolder  : 'name (required)'
  },

  locationCharacteristics: {
    label        : 'Habitat',
    description  : 'How would you characterize the habitat where the tree is located?',
    selectChoices: [
      'Forest', 'Wetland', 'Field', 'Roadside, urban, suburban, or park'
    ],
    placeHolder  : 'Please select',
    multiCheck   : true
  },

  nearbyTrees: {
    label        : 'Trees nearby',
    description  : 'If there are trees of the same species nearby, what state are they in?  Check all that apply.',
    selectChoices: [
      'Dead and/or dying', 'Healthy and large', 'Healthy and small', 'No trees of this species nearby', 'I\'m not sure'],
    placeHolder  : 'Please select',
    multiCheck   : true
  },

  treated: {
    label        : 'Treated',
    description  : 'Has this tree been treated with fungicides or pesticides?',
    selectChoices: ['Yes', 'No', 'Don\'t know'],
    placeHolder  : 'Please select'
  },

  partOfStudy: {
    label        : 'Study',
    description  : 'Is this tree already part of an existing study that you are aware of?  For example, there may a tag on the tree.',
    selectChoices: ['Yes', 'No', 'Don\'t know'],
    placeHolder  : 'Please select'
  },

  locationComment: {
    comment: true
  },

  heightNumeric: {
    label            : 'Tree height',
    description      : 'Approximately how tall is the tree?',
    numeric          : true,
    units            : {US: 'Feet', metric: 'Meters'},
    default          : 'Estimated',
    placeHolder      : 'Height',
    numberPlaceHolder: 'Tap to enter height'
  },

  burrs: {
    label        : 'Nuts/burrs',
    description  : 'Approximately how many nuts/burrs are present?',
    selectChoices: ['None', 'Few', 'Many', 'Unknown'],
    placeHolder  : 'Please select'
  },

  catkins: {
    label        : 'Catkins',
    description  : 'Are catkins present?',
    selectChoices: ['Present', 'Absent', 'Unknown'],
    placeHolder  : 'Please select'
  },

  //Torreya questions
  numberRootSprouts: {
    label            : 'Root sprouts',
    description      : 'How many living root sprouts are present?',
    numeric          : true,
    units            : 'sprouts',
    placeHolder      : 'Please enter',
    images           : [
      require('../img/torreya/Torreya_taxifolia_root_sprouts_by_Trey_Fletcher.jpg'),
      require('../img/torreya/Torreya_taxifolia_at_Torreya_State_Park_04012018_Diana_Picklesimer_IMG_7421.png'),
      require('../img/torreya/Gholson_Nature_Park,_Florida_Torreya_and_Helen_Roth_02102018.jpg')
    ],
    captions         : ['Example of root sprouts. Root sprouts are stems growing up from the roots of a mature, dead Torreya tree.  There may be some dead stems.  Photo credit: Trey Fletcher.',
      'Florida Torreya caged root sprout at Torreya State Park.  Photo credit: Diana Picklesimer.',
      'Helen Roth with Florida Torreya root sprout at Angus K. Gholson, Jr. Nature Park in Chattahoochee.  Photo credit: Leigh Brooks.'],
    numberPlaceHolder: 'Tap to enter number'
  },

  deerRub: {
    label        : 'Deer rub',
    description  : 'Is there evidence of deer rub on the trunk?',
    selectChoices: ['Present', 'Absent, but caged', 'Absent', 'Not sure'],
    placeHolder  : 'Please select',
    images       : [require('../img/torreya/Deer_rub_on_Torreya_taxifolia_photo_by_Liza_Uzzell.jpg')],
    captions     : ['Deer rub on Florida Torreya stem.  Look for smooth stems with  bark missing. Photo credit: Liza Uzzell.']
  },

  torreyaFungalBlight: {
    label        : 'Disease symptoms',
    description  : 'What madroneDisease symptoms are present?',
    selectChoices: ['Cankers', 'Needle lesions or yellowing'],
    placeHolder  : 'No madroneDisease symptoms',
    multiCheck   : true,
    images       : [
      require('../img/torreya/Canker_on_Florida_Torreya_stem_by_Houston_Snead.jpg'),
      require('../img/torreya/20180201_140312_PElliott.jpg'),
      require('../img/torreya/torreya1_mark_schwartz_lg.jpg'),
      require('../img/torreya/2004-canker.jpg')
    ],

    captions: ['Canker on Florida Torreya stem.  Photo credit: Houston Snead.',
      'Canker on Florida Torreya stem.  Photo credit: Padraic Elliott.',
      'Close up of diseased needles on Florida Torreya.  Photo credit: Mark Schwartz, USDA USFS web page “Why Are Some Plants Rare?”',
      'Close up of stem cankers on Florida Torreya.  Photo credit: Connie Barlow, Torreya Guardians web site'
    ]
  },

  conesMaleFemale: {
    label        : 'Cones',
    description  : 'Are cones present?',
    selectChoices: ['Absent', 'Male present', 'Female present', 'Not sure'],
    placeHolder  : 'Please select',
    images       : [
      require('../img/torreya/male_cones_torreya.jpg'),
      require('../img/torreya/female_cones_torreya.jpg'),
      require('../img/torreya/Three_Rivers_SP_11282010_031_Torreya_taxifolia_male_cones_group_campground.jpg')

    ],
    captions     : [
      'Male cones.',
      'Female cones.',
      'Under side of Florida Torreya leaves and buds of male cones. Photo credit: Leigh Brooks.'
    ]
  },

  needleColor: {
    label        : 'Needles Color',
    description  : 'What color ar the needles?',
    selectChoices: [
      'Green',
      'Green Blue',
      'Green Yellow',
      'Golden Yellow'
    ],
    placeHolder  : 'Please select',
    images       : [
      require('../img/eastern_larch/needle-green.png'),
      require('../img/eastern_larch/needle-green-blue.png'),
      require('../img/eastern_larch/needle-green-yellow.png'),
      require('../img/eastern_larch/needle-golden-yellow.png')
    ],
    captions     : [
      'Green. Tamaracks on Barnum Bog at the Paul Smiths VIC (12 July 2012).',
      'Green Blue. Jean Baxter, New England Tree Directory (2018).',
      'Green Yellow. Tamaracks on Barnum Bog at the Paul Smiths VIC (12 July 2012).',
      'Golden Yellow. Jonathan Schechter, Vermont County Blog (November 2016).'
    ]
  },

  needleAmount: {
    label        : 'Amount of Needles',
    description  : 'Describe needle presence on the tree.',
    selectChoices: [
      'Full',
      'Falling',
      'Sparse',
      'Bare'
    ],
    placeHolder  : 'Please select',
    images       : [
      require('../img/eastern_larch/full-needle-presence.png'),
      require('../img/eastern_larch/falling-needle-presence.png'),
      require('../img/eastern_larch/sparse-needle-presence.png'),
      require('../img/eastern_larch/bare-needle-presense.png')
    ],
    captions     : [
      'Full. Johnson’s Nursery (2018).',
      'Falling. Dave’s Garden (2012).',
      'Sparse. The Mary T. and Frank L. Hoffman Family Foundation (2001)',
      'Bare. Volo Bog State Natural Area (April 2017).'
    ]
  },

  standDiversity: {
    label        : 'Stand diversity',
    description  : 'What types of trees do you see in the stand where the tree is found?',
    selectChoices: ['Pure stand of this species', 'Mixed stand (this species and others)', 'Tree is standing alone', 'Not sure'],
    placeHolder  : 'Please select'
  },

  crownAssessment: {
    label        : 'Tree Crown Assessment',
    description  : 'What percentage of the tree crown looks unhealthy or appears damaged?',
    selectChoices: ['< 10%', '10% to 20%', '20% to 50%', '50% to 75%', '> 75%'],
    placeHolder  : 'Please select'
  },

  madroneDisease: {
    label        : 'Disease',
    description  : 'Do you see any disease symptoms on the leaves, branches, or trunk?',
    selectChoices: ['Wilting leaves', 'Leaf spots', 'Rust', 'Blight', 'Defoliation', 'Lesions', 'Cankers'],
    placeHolder  : 'Please select',
    multiCheck   : true,
    images       : [
      require('../img/madrone/ARME_wilt-min.jpg'),
      require('../img/madrone/ARME_blight-min.jpg'),
      require('../img/madrone/ARME_dieback-min.jpg'),
      require('../img/madrone/ARME_defoliated-min.jpg'),
      require('../img/madrone/ARME_P_canker-min.jpg'),
      require('../img/madrone/ARME_cankers-min.jpg'),
    ],
    captions    : [
      'Wilting leaves. Marianne Elliott, WSU',
      'Leaf blight (Whole leaf appears dry and dead, brown in color). Marianne Elliott, WSU',
      'Botryosphaeria blight (Leaves that appear grey/black or "burnt"). Marianne Elliott, WSU',
      'Shoots or branches partially defoliated or completely dead. Marianne Elliott, WSU',
      'Dark, smooth, discolored lesions on trunk. Marianne Elliott, WSU',
      'Raised bumpy cankers on trunk or branches. Michael Yadrick, City of Seattle',
    ]
  }

}


export default DCP
