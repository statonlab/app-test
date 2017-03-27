const DCP = {
  treeHeight: {
    label        : "Tree Height",
    selectChoices: [
      '0-10 feet', '11-50 feet', '51-100 feet', '>100 feet'
    ],
    description  : "Please estimate the height of the tree for this observation.  Some trees are very tall.",
    placeHolder  : "Tree Height"
  },
  treeStand : {
    label        : "Stand Density",
    selectChoices: [
      '1-10', '11-50', '51+'
    ],
    description  : "Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.",
    placeHolder  : "Number of Trees"

  },

  deadTrees          : {
    label        : "Dead Trees",
    selectChoices: ['none', '1-50', '51+'],
    description  : "Of the trees of this species in this stand, how many are dead?",
    placeHolder  : "Number of Trees"
  },
  ashSpecies         : {
    label        : "Species",
    selectChoices: [
      'White ash', 'Green ash', 'Blue ash', 'Black ash', 'Uncertain'
    ],
    description  : "Which species of Ash tree is this?  If you aren't sure, select Uncertain",
    placeHolder  : 'Uncertain'
  },
  seedsBinary        : {
    label        : "Seeds?",
    selectChoices: [
      "Yes", "No"
    ],
    description  : "Are seeds present?",
    placeHolder  : "seeds"
  },
  flowersBinary      : {
    label        : "Flowers?",
    selectChoices: [
      "Yes", "No"
    ],
    description  : "Is this tree flowering?",
    placeHolder  : "flowers"
  },
  emeraldAshBorer    : {
    label        : "Ash Borer",
    selectChoices: [
      "D-shaped adult exit holes", "Bark coming off with tunneling underneath", "Emerald ash borer beetless/larvae", "stump sprouting"
    ],
    description  : "Do you see any of these signs of emerald ash borers?",
    placeHolder  : 'no signs'
  },
  crownHealth        : {
    label        : "Crown health",
    selectChoices: [
      "0-24%", "25-49%", "50-74%", "75-100%"
    ],
    description  : "What percentage of the tree’s crown is healthy?",
    placeHolder  : "% healthy"
  },
  woolyAdes          : {
    label        : "Wooly adelgids",
    selectChoices: [
      "0-24%", "25-49%", "50-74%", "75-100%"
    ],
    description  : "What percentage of the branches you see have hemlock wooly adelgids?",
    placeHolder  : "% adelgid coverage"
  },
  chestnutBlightSigns: {
    label        : "Chestnut Blight",
    selectChoices: [
      "Cankers and cracked bark", "Tan to orange-colored patches or pustules on bark", "Evidence of old dead trunk", "Stump sprouting"
    ],
    description  : "Do you see any of these signs of chestnut blight?  Check all that apply.",
    placeHolder  : "symptoms"
  },
  acorns             : {
    label        : "Acorns",
    selectChoices: [
      "None", "Some", "Lots"
    ],
    description  : "Are there acorns on the tree?  Don't include fallen acorns on the ground in your estimate.",
    placeHolder  : "number of acorns"
  },

  diameterDescriptive: {
    label        : "Diameter",
    selectChoices: [
      "1-15 inches", "16-19 inches", "20-23 inches", "over 24 inches"
    ],
  }


}

export default DCP;