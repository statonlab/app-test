import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import {getTheme, MKButton} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import UploadButton from '../components/UploadButton'

const theme  = getTheme()
const plants = [
  {
    title: 'American Chestnut',
    image: require('../img/am_chestnut4.jpg')
  },
  {
    title: 'Ash',
    image: require('../img/ash.jpg')
  },
  {
    title: 'Hemlock',
    image: require('../img/hemlock.jpg')
  },
  {
    title: 'White Oak',
    image: require('../img/white_oak.jpg')
  },
  {
    title: 'Other',
    image: require('../img/hydrangea.jpg')

  }
]

export default class LandingScene extends Component {
  constructor(props) {
    super(props)

    // Links that always show up
    this.defaultSidebarLinks = [
      {
        icon : 'map-marker-radius',
        title: 'My Entries',
        label: 'ObservationsScene'
      },
      {
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
      }
    ]

    // Links that show up when the user is logged in
    this.loggedInLinks = [
      {
        icon   : 'logout-variant',
        title  : 'Logout',
        onPress: this.logout
      }
    ]

    // Links that show up when the user is not logged in
    this.loggedOutLinks = [
      {
        icon : 'account-key',
        title: 'Login',
        label: 'LoginScene'
      }, {
        icon : 'account-plus',
        title: 'Register',
        label: 'RegistrationScene'
      }
    ]

    this.state = {
      sidebar     : [],
      userLoggedIn: false
    }

    // Hold all events so we can remove them later and prevent memory leaks
    this.events = []
  }

  /**
   * Sets the initial sidebar links and listens to events.
   */
  componentDidMount() {
    this.setSidebarLinks()
    this.setState({
      userLoggedIn: this.isLoggedIn()
    })

    this.events.push(DeviceEventEmitter.addListener('userLoggedOut', () => {
      this.setSidebarLinks()
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
      this.setState({userLoggedIn: false})
    }))

    this.events.push(DeviceEventEmitter.addListener('newSubmission', () => {
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
      this.setState({userLoggedIn: true})
    }))

    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', this.setSidebarLinks.bind(this)), {})
  }

  /**
   * Stop listening
   */
  componentWillUnmount() {
    this.events.forEach(event => {
      event.remove()
    })
  }

  /**
   * Resets the sidebar links based on logged in status
   */
  setSidebarLinks() {
    if (this.isLoggedIn()) {
      this.setState({
        sidebar: [
          ...this.defaultSidebarLinks,
          ...this.loggedInLinks
        ]
      })
      return
    }

    this.setState({
      sidebar: [
        ...this.loggedOutLinks,
        ...this.defaultSidebarLinks
      ]
    })
  }

  /**
   * Logs the user out after confirming the click.
   */
  logout() {
    Alert.alert(
      'Logging Out',
      'Are you sure you want to log out? Observations will be lost if you logout before uploading them.', [
        {
          text   : 'Yes',
          onPress: () => {
            // Deletes all user records thus logging out
            realm.write(() => {
              let users = realm.objects('User')
              realm.delete(users)
            })
            DeviceEventEmitter.emit('userLoggedOut')
          }
        },
        {text: 'Cancel', style: 'cancel'}
      ])
  }

  /**
   * Checks if the user is logged in.
   *
   * @returns {boolean}
   */
  isLoggedIn() {
    return (realm.objects('User').length > 0)
  }

  /**
   * Toggle sidebar menu (show/hide)
   */
  toggleMenu() {
    this.refs.sidebar.toggleMenu()
  }

  /**
   * Render login button.
   * 
   * @returns {XML}
   */
  loginButton() {
    return (
      <MKButton style={styles.button} onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
        <Text style={styles.buttonText}>Login to upload your entries</Text>
      </MKButton>
    )
  }

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
          routes={this.state.sidebar}/>
        <ScrollView style={{flex: 0}}>
          <View style={styles.plantsContainer}>
            {this.state.userLoggedIn ? <UploadButton ref="uploadButton"/> : this.loginButton.call(this)}

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
}

LandingScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired
}

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  card: {
    ...theme.cardStyle,
    ...elevationStyle,
    marginBottom: 10,
    borderRadius: 3
  },

  cardImage: {
    height              : 150,
    resizeMode          : 'cover',
    width               : undefined,
    borderTopRightRadius: 3,
    borderTopLeftRadius : 3,
    backgroundColor     : '#fff'
  },

  cardTitle: {
    ...theme.cardTitleStyle,
    fontSize: 14,
    flex    : 50,
    padding : 0,
    position: undefined,
    top     : 0,
    left    : 0
  },

  cardBody: {
    flexDirection : 'row',
    flex          : 1,
    padding       : 10,
    alignItems    : 'center',
    justifyContent: 'center'
  },

  icon: {
    backgroundColor: 'transparent'
  },

  plantsContainer: {
    marginHorizontal: 5,
    flex            : 1,
    flexDirection   : 'column',
    paddingVertical : 10
  },

  button: {
    ...(new Elevation(2)),
    paddingVertical  : 15,
    paddingHorizontal: 10,
    marginBottom     : 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: '500',
    textAlign : 'center'
  }
})
