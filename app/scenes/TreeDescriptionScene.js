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
      treeHeight   : true,
      treeStand: true,
      deadTrees     : true
    }
  },
  'Green Ash'        : {
    image                 : require('../img/ash.jpg'),
    latinName             : 'G. ashicus',
    descriptionBody       : 'This is where the body text would go describing the gorgeous green ash.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {}
  },
  'Hemlock'          : {
    image                 : require('../img/hemlock.jpg'),
    latinName             : 'H. lockicus',
    descriptionBody       : 'This is where the body text would go describing the heroic hemlock.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {}
  },
  'White Oak'        : {
    image                 : require('../img/white_oak.jpg'),
    latinName             : 'W. oakicus',
    descriptionBody       : 'This is where the body text would go describing the witty white oak.',
    collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!',
    formProps             : {}
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
    borderRadius   : 2,
    backgroundColor: Colors.primary,
    padding        : 10,
    width          : 300,
    maxWidth       : 300,
  },

  buttonText: {
    textAlign: 'center',
    color    : '#fff',
    fontSize : 14
  },
})
