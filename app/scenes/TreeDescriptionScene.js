import React, {Component, PropTypes} from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'

const theme  = getTheme()
const plants = {
  'American Chestnut': {
    image                 : require('../img/am_chestnut4.jpg'),
    latinName             : 'A. chestnuticus',
    descriptionBody       : 'This is where the body text would go describing the majestic American Chestnut.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    descriptionCards      : [
      {
        title : "Introduction",
        body  : ["American chestnut was once a dominant tree in eastern North American forests but a deadly fungal disease wiped out most of these trees in the early 1900s.  Help us find resistant trees by tagging healthy chestnut trees."],
        images: {}
      }, {
        title : "American chestnut species:",
        body  : ["Castanea dentata"],
        images: {}
      }, {
        title : "Description:",
        body  : ["The leaves of American chestnut are straight with large, widely spaced, often hooked, serrations on their edges.  Chestnut fruits are large, green and covered with spikes on the outside, bearing three large nuts on the inside.  Chestnut produces long cadkins made up of many small, pale green flowers. American chestnut twigs are hairless, reddish brown and have small white lenticels.  While it is relatively common to find stump-sprouting chestnuts that have been killed by blight, health mature American chestnut trees are very rare unless outside the tree’s native range.", "To learn more about identifying American chestnut and distinguishing it from similar species visit: https://www.acf.org/resources/identification/"],
        images: {}
      }, {
        images: {},
        title : "Chestnut blight:",
        body  : ["Chestnut blight is caused by the fungus Cryphonectria parasitica. It was introduced to North America in the early 1900s by accidentally importing infected Asian chestnut trees.  Most Asian chestnuts are quite resistant to the fungus but American chestnut proved highly susceptible and by 1940 few mature chestnut trees were left.  ",
          "The fungus that causes chestnut blight grows in the vascular system of the tree, forming a canker and eventually girdling the tree.  Symptoms of chestnut blight include cracked bark, sunken cankers, and fungal structures. ",
          "Several breeding programs exist to develop trees that are resistant to chestnut blight.  Many of these rely of hybridizing American chestnuts with resistant Chinese of Japanese chestnuts and then back crossing to American chestnut.  In addition, there has been success in producing transgenic chestnut trees with genes from wheat that provide resistance. ",
          "Our hope is that this reporting app will let members of the public identify chestnut trees that have some natural resistance to chestnut blight.  We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration."],
      }
    ],
    formProps             : {
      seedsBinary        : true,
      flowersBinary      : true,
      chestnutBlightSigns: true,
      crownHealth        : true,
      diameterNumeric    : true
    }
  },
  'Ash'              : {
    image                 : require('../img/ash.jpg'),
    latinName             : 'Fraxinus sp.',
    descriptionCards      : [
      {
        title : "﻿Ash:",
        body  : ["There are several different species of American ash trees, all of which are susceptible to the deadly emerald ash borer.  Help us find resistant trees by tagging healthy ash trees."],
        images: {}
      }, {
        title : "American ash species:",
        body  : ["While there are many different ash species present in North America, the most common include white ash, (Fraxinus americana), green ash (Fraxinus pennsylvanica), black ash, (Fraxinus nigra), and blue ash, (Fraxinus quadrangulata)."],
        images: {}
      }, {
        title : "Description:",
        body  : ["Ash trees share several features that can be used to distinguish them from other tree species.  Ash trees have an opposite branching pattern, where buds are positioned opposite each other on twigs.  Ash trees also have compound leaves.  Compound leaves are made up of many leaflets, each of which looks like a leaf. However leaves and leaflets can be distinguished because buds are only found at the base of the overall leaf, and not each individual leaflet.  Ashes typically have 5-9 leaflets per leaf, although this varies by species.  In addition, mature ash trees have a characteristic diamond pattern to their bark and ash seeds are distinctively shaped. "],
        images: {}
      }, {
        title : "Range:",
        body  : ["Ash trees are present throughout Eastern and Midwestern North America.  Different ash species have different distributions within this range.",
          "* White ash",
          "* Green ash",
          "* Black ash",
          "* Blue ash",],
        images: {}
      }, {
        title : "Distinguishing different ash species:",
        body  : ["Leaf scars, twig shape, and species range can be very helpful in distinguishing ash tree species.",
          "Green ash has a leaf scar below the bud while white ash has a leaf scar that wraps around the bud and is more “U”-shaped.  In addition, white ash leaflets are white-colored on the undersides while green ash leaflets are green or rusty on their undersides. Blue ash can be distinguished by its thick square-shaped twigs which are often winged.  Black ash has a leaf scar similar to green ash but leaflets are directly attached to the petiole without stalks to connect them.  In addition, black ash has a more northern range and is typically found in wet sites.",
          "Read more about distinguishing American ash species here. ( https://www.ars.usda.gov/midwest-area/ames/plant-introduction-research/docs/npgs-ash-conservation-project/identifying-ash/)",
        ],
        images: {}
      }, {
        title : "Emerald ash borer",
        body  : ["The reason we are looking for health ash trees is that an invasive insect, the emerald ash borer, is currently moving through North America and killing ash trees.  The larvae of this beetle feed on the inner bark of ash trees, cutting off the tree’s flow of water and nutrients and eventually killing the tree.  All American ash species are susceptible to the Emerald Ash Borer and so far there is very little natural resistance to the insect in our trees.  ",
          "Our hope is that this reporting app will let members of the public identify ash trees that are lingering after the emerald ash borer’s arrival and which may have some natural resistance.  We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees that are not killed by the emerald ash borer to use in forest restoration.",
          "Read more about the emerald ash borer: http://www.hungrypests.com/the-threat/emerald-ash-borer.php"
        ],
        images: {}
      },
    ],
    descriptionBody       : 'This is where the body text would go describing the gorgeous ash.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {
      ashSpecies     : true,
      seedsBinary    : true,
      flowersBinary  : true,
      emeraldAshBorer: true,
      crownHealth    : true,
      diameterNumeric: true
    }
  },
  'Hemlock'          : {
    image                 : require('../img/hemlock.jpg'),
    latinName             : 'H. lockicus',
    descriptionBody       : 'This is where the body text would go describing the heroic hemlock.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    descriptionCards      : [
      {
        title : "Introduction",
        images: {},
        body  : ["American hemlock trees are being killed by hemlock wooly adelgids.  Help fight these invasive insects by tagging health hemlock trees."],
      }, {
        title : "American hemlock species:",
        images: {},
        body  : ["Tsuga canadensis (Eastern hemlock), Tsuga caroliniana (Carolina hemlock)"],
      }, {
        title : "Description:",
        images: {},
        body  : ["Hemlock is an evergreen conifer. Its needles are 1.5-2 cm long, dark green on top and lighter on the underside with two white lines running the length of the needle.  Hemlocks produce small distinctive cones. These trees prefer shade and are often found along creeks and steams in mature forests", "There are two different hemlock species native to North American, Eastern hemlock and Carolina hemlock.  Eastern hemlock is larger and has a much broader distribution than Carolina hemlock, which is endemic to the southern Appalachians."]
      }, {
        title : "Range:",
        images: {},
        body  : ["Eastern hemlock, Tsuga canadensis", "* Carolina hemlock, Tsuga caroliniana"]
      }, {
        title : "Hemlock wooly adelgid:",
        body  : ["This insect sucks the sap of hemlock trees, weakening trees, preventing new growth, and eventually killing trees. In addition, hemlock wooly adelgids are thought to inject a toxin when feeding that further damages hemlock trees by drying them out.  Infested trees loose needles and branches and typically die 4-10 years after initial adelgid arrival unless treated.", "The hemlock wooly adelgid’s name comes from the insect’s egg sacs, which hang from the undersides of branches at certain times of year and look like small wooly tufts.  These insects are invasive in North America, introduced from Japan.", "Our hope is that this reporting app will let members of the public identify hemlock trees that have some natural resistance to hemlock wooly adelgid.  We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration."],
        images: {}
      }
    ],
    formProps             : {
      woolyAdesCoverage: true,
      crownHealth      : true,
      diameterNumeric  : true
    }
  }
  ,
  'Other'            : {
    image                 : require('../img/hydrangea.jpg'),
    latinName             : '',
    descriptionBody       : 'Submissions for all other trees.',
    collectionInstructions: '',
    formProps             : {
      diameterNumeric: true
    }
  }
  ,
  'White Oak'        : {
    image                 : require('../img/white_oak.jpg'),
    latinName             : 'W. oakicus',
    descriptionBody       : 'This is where the body text would go describing the witty white oak.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    descriptionCards      : [
      {
        title : "Introduction:",
        body  : ["White oak is an extremely important tree species.  It provides wood for lumber, (including bourbon barrels) and is also a key food source for wildlife.  Help us breed better white oak by tagging big, healthy trees."],
        images: {},
      },
      {
        title : "Species:",
        body  : ["Quercus alba"],
        images: {}
      },
      {
        title : "Description:",
        body  : ["American white oak, Quercus alba, is a central component of the central hardwood forests.  Mature white oaks typically grow very large, 80-100 feet high, and have broad, full canopies.  White oaks can live a very long time and some trees have been found that are over 400 years old.  ", "The leaves of white oak have alternate branching and seven to nine rounded lobes.  This is different from red oaks, which typically have pointed lobes with a small hair on each tip.  ", "It is important to note that there are several species in the “white oak” group that share this leaf shape (including swamp white oak and bur oak) and that oaks frequently hybridize, sometimes making it challenging to know which oak species you are looking at."],
        images: {}
      },
      {
        title : "Range:",
        images: {},
        body  : ["White oak trees are present throughout Eastern and Midwestern North America.  However, this range overlaps with many other oak species."],
      }]
  }
}

export default class TreeDescriptionScene extends Component {

  constructor(props) {
    super(props);
  }

  renderDescriptionCards = () => {
    // plants[this.props.title].descriptionCards.map(() )
    return ( null)
}

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.props.title}
          navigator={this.props.navigator}
        />
        <ScrollView style={styles.scrollView}>
          <Image source={plants[this.props.title].image} style={styles.cardImage}/>
          <View style={styles.card}>
            <View style={[styles.cardBody, {paddingTop: 0}]}>
              <Text style={styles.cardTitle}>Latin name</Text>
              <Text style={styles.cardText}>{plants[this.props.title].latinName}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Tree Description</Text>
              <Text style={styles.cardText}>{plants[this.props.title].descriptionBody}</Text>
            </View>
            <View style={[styles.cardBody, {borderBottomWidth: 0, paddingBottom: 0}]}>
              <Text style={styles.cardTitle}>Collection Instructions</Text>
              <Text style={styles.cardText}>{plants[this.props.title].collectionInstructions}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <MKButton style={styles.button} onPress={() => {
            this.props.navigator.push({label: 'FormScene', title: this.props.title, formProps: plants[this.props.title].formProps})
          }}>
            <Text style={styles.buttonText}>
              Add New Entry
            </Text>
          </MKButton>
        </View>
      </View>
    )
  }
}

TreeDescriptionScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
}

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  scrollView: {
    flex: 1
  },

  card: {
    ...theme.cardStyle,
    ...elevationStyle,
    borderRadius   : 0,
    flex           : 1,
    paddingVertical: 10,
    justifyContent : 'center',
    marginBottom   : 5
  },

  cardImage: {
    ...theme.cardImageStyle,
    height         : 150,
    resizeMode     : 'cover',
    width          : undefined,
    backgroundColor: '#fff',
  },

  cardTitle: {
    fontSize  : 14,
    flex      : 1,
    fontWeight: 'bold',
    color     : "#222"
  },

  cardBody: {
    padding          : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede'
  },

  cardText: {
    padding: 10,
    color  : '#666'
  },

  footer: {
    flex          : 0,
    height        : 60,
    justifyContent: 'center',
    alignItems    : 'center'
  },

  button: {
    ...(new Elevation(1)),
    borderRadius     : 2,
    backgroundColor  : Colors.primary,
    paddingHorizontal: 10,
    paddingVertical  : 15,
    width            : 300,
    maxWidth         : 300,
  },

  buttonText: {
    textAlign : 'center',
    color     : '#fff',
    fontWeight: 'bold'
  },
})
