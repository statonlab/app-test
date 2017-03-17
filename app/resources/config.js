
const DCP = {
   treeHeight: {
     label: "Tree Height",
    selectChoices: [
      '0-10 feet', '11-50 feet', '51-100 feet', '>100 feet'
    ],
    description  : "Please estimate the height of the tree for this observation.  Some trees are very tall.",
     placeHolder : "Tree Height"
  },
   treeStand: {
     label: "Stand Density",
    selectChoices: [
      '1-10', '11-50', '51+'
    ],
    description  : "Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.Full description of number of trees question.  Lorem ipsum.",
     placeHolder : "Number of Trees"

   },

   deadTrees:{
     label: "Dead Trees",
    selectChoices: ['none', '1-50', '51+'],
    description  : "Of the trees of this species in this stand, how many are dead?",
     placeHolder : "Number of Trees"
  }
}

export default DCP;