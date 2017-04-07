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
    formProps             : {
      seedsBinary: true,
      flowersBinary: true,
      chestnutBlightSigns: true,
      crownHealth: true,
      diameterNumeric: true
    }
  },
  'Ash'        : {
    image                 : require('../img/ash.jpg'),
    latinName             : 'Fraxinus sp.',
    descriptionCards : [
     {
        title : 'Description',
        body  : ["Ash trees share several features that can be used to distinguish them from other tree species.  Ash trees have an opposite branching pattern, where buds are positioned opposite each other on twigs.  Ash trees also have compound leaves.  Compound leaves are made up of many leaflets, each of which looks like a leaf. However leaves and leaflets can be distinguished because buds are only found at the base of the overall leaf, and not each individual leaflet.  Ashes typically have 5-9 leaflets per leaf, although this varies by species.  In addition, mature ash trees have a characteristic diamond pattern to their bark and ash seeds are distinctively shaped. "],
        images: {}
      },
      {
        title : "American ash species",
        body : ["While there are many different ash species present in North America, the most common include white ash, (Fraxinus americana), green ash (Fraxinus pennsylvanica), black ash, (Fraxinus nigra), and blue ash, (Fraxinus quadrangulata)."],
        images: {}
      }
    ],
    descriptionBody       : 'This is where the body text would go describing the gorgeous ash.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {
      ashSpecies: true,
      seedsBinary: true,
      flowersBinary: true,
      emeraldAshBorer: true,
      crownHealth: true,
      diameterNumeric: true

    }
  },
  'Hemlock'          : {
    image                 : require('../img/hemlock.jpg'),
    latinName             : 'H. lockicus',
    descriptionBody       : 'This is where the body text would go describing the heroic hemlock.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {
      woolyAdesCoverage: true,
      crownHealth: true,
      diameterNumeric: true


    }
  },
  'Other'          : {
    image                 : require('../img/hydrangea.jpg'),
    latinName             : '',
    descriptionBody       : 'Submissions for all other trees.',
    collectionInstructions: '',
    formProps             : {diameterNumeric: true
    }
  },
  'White Oak'        : {
    image                 : require('../img/white_oak.jpg'),
    latinName             : 'W. oakicus',
    descriptionBody       : 'This is where the body text would go describing the witty white oak.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {
      acorns: true,
      diameterDescriptive: true,
      crownHealth: true,
      heightFirstBranch: true,
      oakHealthProblems: true
    }
  }
}

export default class TreeDescriptionScene extends Component {

  constructor(props) {
    super(props);
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
