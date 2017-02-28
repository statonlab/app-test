import React, {Component, PropTypes} from 'react'
import {
  View,
  Navigator,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Icon from 'react-native-vector-icons/Ionicons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {
  MKButton,
} from 'react-native-material-kit'

const theme  = getTheme()
const plants = {
    'American Chestnut': {
      image                 : require('../img/am_chestnut4.jpg'),
      latinName             : 'A. chestnuticus',
      descriptionBody       : 'This is where the body text would go describing the majestic American Chestnut.',
      collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!'
    },
    'Green Ash'        : {
      image                 : require('../img/ash.jpg'),
      latinName             : 'G. ashicus',
      descriptionBody       : 'This is where the body text would go describing the gorgeous green ash.',
      collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!'
    },
    'Hemlock'          : {
      image                 : require('../img/hemlock.jpg'),
      latinName             : 'H. lockicus',
      descriptionBody       : 'This is where the body text would go describing the heroic hemlock.',
      collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!'
    },
    'White Oak'        : {
      image                 : require('../img/white_oak.jpg'),
      latinName             : 'W. oakicus',
      descriptionBody       : 'This is where the body text would go describing the witty white oak.',
      collectionInstructions: 'This is where the specific collection instructions would go.  Only collect disease trees for this species!'
    }
  }


let plant = plants['Hemlock'];

const sidebarLinks = [
  {
    title: 'Home',
    index: 0
  },
]


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
          initial={true}
          onMenuPress={this.toggleMenu.bind(this)}/>
        <Sidebar
          ref="sidebar"
          navigator={this.props.navigator}
          routes={sidebarLinks}/>
        <ScrollView>
          <Image source={plants[this.props.title].image} style={styles.cardImage}/>
          <View style={styles.descriptionItemView}>
          <Text style={styles.cardTitle}>Latin name:</Text>
          <Text style={styles.cardBody}>{plants[this.props.title].latinName}</Text>
          </View>
          <View style={styles.descriptionItemView}>
          <Text style={styles.cardTitle}>Tree Description:</Text>
          <Text style={styles.cardBody}>{plants[this.props.title].descriptionBody}</Text>
          </View>
          <View style={styles.descriptionItemView}>
            <Text style={styles.cardTitle}>Collection Instructions:</Text>
          <Text style={styles.cardBody}>{plants[this.props.title].collectionInstructions}</Text>
          </View>
        </ScrollView>
        <MKButton style={styles.button} onPress={() => console.log("Add an entry")}>
          <Text style={styles.buttonText}>
            Add an entry
          </Text>
        </MKButton>
      </View>
    )
  }

  toggleMenu() {
    this.refs.sidebar.toggleMenu()
  }
}

  TreeDescriptionScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
}

const elevationStyle = new Elevation(2)
const iconElevation  = new Elevation(2)

const styles = StyleSheet.create({
  container      : {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
  card           : {
    ...theme.cardStyle,
    ...elevationStyle,
    marginBottom: 10,
    borderRadius: 3
  },
  cardImage      : {
    ...theme.cardImageStyle,
    height              : 150,
    resizeMode          : 'cover',
    width               : undefined,
    borderTopRightRadius: 3,
    borderTopLeftRadius : 3,
    backgroundColor     : '#fff',
  },
  cardTitle      : {
    ...theme.cardTitleStyle,
    fontSize: 14,
    flex    : 50,
    padding : 0,
    position: undefined,
    top     : 0,
    left    : 0
  },
  cardBody       : {
    flexDirection : 'row',
    flex          : 1,
    padding       : 10,
    alignItems    : 'center',
    justifyContent: 'center'
  },
  descriptionContainer: {
  marginHorizontal: 5,
    flex            : 1,
    flexDirection   : 'column',
    paddingVertical : 10
  },
  button : {
    flexDirection: 'column',
    borderRadius: 2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.24,
    shadowColor: 'black',
    elevation: 4,
    backgroundColor: Colors.primary,
    padding: 5,
    marginVertical: 50,
    maxWidth: 300,
    marginLeft: 75

  },
  buttonText : {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  descriptionItemView : {
    flex          : 1,
    padding       : 10,
    justifyContent: 'center',
    borderRadius: 2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.24,
    shadowColor: 'black',
    elevation: 4,

  }
})
