import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  Navigator,
  Dimensions,
  StyleSheet
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Icon from 'react-native-vector-icons/Ionicons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

const theme  = getTheme()
const plants = [
  {
    title: 'American Chestnut',
    image: require('../img/am_chestnut4.jpg'),
  },
  {
    title: 'Green Ash',
    image: require('../img/ash.jpg'),
  },
  {
    title: 'Hemlock',
    image: require('../img/hemlock.jpg'),
  },
  {
    title: 'White Oak',
    image: require('../img/white_oak.jpg'),
  }
]

const sidebarLinks = [
  {
    icon : 'account-key',
    title: 'Login',
    label: 'AboutScene'
  }, {
    icon : 'account-card-details',
    title: 'About Us',
    label: 'AboutScene'
  }, {
    icon : 'sign-caution',
    title: 'Health and Safety',
    label: 'HealthSafetyScene'
  }, {
    icon : 'lock',
    title: 'Privacy Policy',
    label: 'PrivacyPolicyScene'
  }, {
    icon : 'logout-variant',
    title: 'Logout',
    label: 'PrivacyPolicyScene'
  }
]

export default class LandingScene extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.props.title}
          navigator={this.props.navigator}
          initial={true}
          onMenuPress={this.toggleMenu.bind(this)}
        sidebar={this.refs.sidebar}/>
        <Sidebar
          ref="sidebar"
          navigator={this.props.navigator}
          routes={sidebarLinks}/>
        <ScrollView style={{flex: 0}}>
          <View style={styles.plantsContainer}>
            {plants.map((plant, index) => {
              return (
                <TouchableHighlight
                  style={styles.card}
                  key={index}
                  onPress={() => {
                    this.props.navigator.push({label: 'TreeDescriptionScene', title: plant.title})
                  }}
                  underlayColor="#fff">
                  <View>
                    <Image source={plant.image} style={styles.cardImage}/>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>
                        {plant.title}
                      </Text>
                      <Icon name="md-arrow-dropright-circle" size={22} color={Colors.primary} style={styles.icon}/>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }

  toggleMenu() {
    this.refs.sidebar.toggleMenu()
  }
}

LandingScene.propTypes = {
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
  icon           : {
    backgroundColor: 'transparent'
  },
  plantsContainer: {
    marginHorizontal: 5,
    flex            : 1,
    flexDirection   : 'column',
    paddingVertical : 10
  }
})
