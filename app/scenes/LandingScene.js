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
import moment from 'moment'
import {getTheme, MKButton} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import UploadButton from '../components/UploadButton'
import SnackBarNotice from '../components/SnackBarNotice'
import Observation from '../helpers/Observation'

const theme  = getTheme()
const plants = [
  {
    title    : 'American Chestnut',
    latinName: 'Castanea dentata',
    image    : require('../img/am_chestnut4.jpg')
  },
  {
    title    : 'Ash',
    latinName: 'Fraxinus sp.',
    image    : require('../img/ash.jpg')
  },
  {
    title    : 'Hemlock',
    latinName: 'Tsuga sp.',
    image    : require('../img/hemlock.jpg')
  },
  {
    title    : 'White Oak',
    latinName: 'Quercus alba',
    image    : require('../img/white_oak.jpg')
  },
  {
    title : 'American Elm',
    latinName: 'Ulmus americana',
    image : require('../img/elm.jpg')
  },
  {
    title    : 'Other',
    latinName: 'Other trees that aren\'t listed above',
    image    : require('../img/forest.jpg')
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
      },
      {
        icon : 'sign-caution',
        title: 'Health and Safety',
        label: 'HealthSafetyScene'
      },
      {
        icon : 'lock',
        title: 'Privacy Policy',
        label: 'PrivacyPolicyScene'
      }
    ]

    // Links that show up when the user is logged in
    this.loggedInLinks = [
      {
        icon : 'account',
        title: 'Account',
        label: 'AccountScene'
      },
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
      userLoggedIn: false,
      noticeText  : 'default message'
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
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
      this.setSidebarLinks()
      this.setState({
        userLoggedIn: false,
        noticeText  : 'Successfully logged out!'
      })
      this.refs.snackbar.showBar()
    }))

    this.events.push(DeviceEventEmitter.addListener('newSubmission', () => {
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
      // this.setState({noticeText: 'New submission created!'})
      // this.refs.snackbar.showBar()
    }))

    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', () => {
      this.setState({
        userLoggedIn: true,
        noticeText  : 'Successfully logged in!'
      })
      this.setSidebarLinks()
      this.refs.snackbar.showBar()
      console.log('DB: entries', realm.objects('Submission').length)
      this.downloadObservations()
    }))

    this.events.push(DeviceEventEmitter.addListener('ObservationDeleted', () => {
      this.setState({
        noticeText: 'Observation deleted!'
      })
      this.refs.snackbar.showBar()
    }))

    this.events.push(DeviceEventEmitter.addListener('userRegistered', () => {
      this.setState({
        userLoggedIn: true,
        noticeText  : 'Successfully registered membership!'
      })
      this.setSidebarLinks()
      this.refs.snackbar.showBar()
    }))
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
   * Download observations from the server and add them to realm
   * if they don't already exist
   */
  downloadObservations() {
    let emptyDB = (realm.objects('Submission').length <= 0)

    console.log('DB: entries', realm.objects('Submission').length)


    Observation.get().then(response => {
      let records = response.data.data
      records.forEach(record => {
        let exists = (realm.objects('Submission').filtered(`serverID == ${record.observation_id}`).length > 0)
        if (exists) {
          return
        }

        let primaryKey = 1

        if (!emptyDB) {
          primaryKey = realm.objects('Submission').sorted('id', true)[0].id + 1
        }

        realm.write(() => {
          realm.create('Submission', {
            id       : primaryKey,
            name     : record.observation_category,
            images   : JSON.stringify(record.images),
            location : record.location,
            date     : moment(record.date.date).format('MM-DD-YYYY HH:mm:ss').toString(),
            synced   : true,
            meta_data: JSON.stringify(record.meta_data),
            serverID : parseInt(record.observation_id)
          })

          emptyDB = false
        })
      })
    }).catch(error => {
      console.log('NETWORK ERROR', error)
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
              let user = realm.objects('User')
              realm.delete(user)
              let submissions = realm.objects('Submission')
              realm.delete(submissions)
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
      <MKButton style={[styles.button, {marginHorizontal: 5}]} onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
        <Text style={styles.buttonText}>Login to upload your entries</Text>
      </MKButton>
    )
  }

  /**
   * Notify user of updated observation.
   */
  uploadCompleted() {
    this.setState({noticeText: 'Observations Uploaded'})
    this.refs.snackbar.showBar()
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.plantsContainer}>
            {this.state.userLoggedIn ? <UploadButton ref="uploadButton"
              onUploadDone={this.uploadCompleted.bind(this)}/> : this.loginButton.call(this)}

            {plants.map((plant, index) => {
              return (
                <MKButton
                  style={styles.card}
                  key={index}
                  rippleColor="rgba(0,0,0,.1)"
                  onPress={() => {
                    this.props.navigator.push({label: 'TreeDescriptionScene', title: plant.title})
                  }}>
                  <View style={[styles.flexHorizontal]}>
                    <Image source={plant.image} style={styles.cardImage}/>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>
                        {plant.title}
                      </Text>
                      <Text style={plant.title != 'Other' ? [styles.cardBodyText, styles.italics] : styles.cardBodyText}>

                        {plant.latinName}</Text>
                    </View>
                  </View>
                </MKButton>
              )
            })}
          </View>
        </ScrollView>
        <SnackBarNotice ref="snackbar" noticeText={this.state.noticeText}/>
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

  flexHorizontal: {
    flexDirection: 'row'
  },

  flexSpace: {
    justifyContent: 'space-between'
  },

  card: {
    ...elevationStyle,
    backgroundColor : '#fff',
    marginBottom    : 10,
    marginHorizontal: 5,
    borderRadius    : 3
  },

  cardImage: {
    resizeMode: 'cover',
    flex      : 0,
    height    : 70,
    width     : 70
  },

  cardTitle: {
    backgroundColor: '#fff',
    fontSize       : 16,
    flex           : 0,
    paddingLeft    : 5,
    fontWeight     : '500',
    marginBottom   : 5
  },

  cardBody: {
    flexDirection: 'column',
    flex         : 1,
    padding      : 5
  },

  cardBodyText: {
    color        : '#777',
    paddingBottom: 10,
    paddingLeft  : 5,
    fontSize     : 14
  },

  icon: {
    backgroundColor: 'transparent'
  },

  plantsContainer: {
    //marginHorizontal: 5,
    flex           : 1,
    flexDirection  : 'column',
    paddingVertical: 10
  },

  button: {
    ...(new Elevation(2)),
    paddingVertical  : 15,
    paddingHorizontal: 10,
    marginBottom     : 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2
  },

  cardButton: {
    marginBottom   : 0,
    flex           : 1,
    marginLeft     : 5,
    paddingVertical: 10,
    backgroundColor: Colors.primary
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: '500',
    textAlign : 'center'
  },

  cardButtonText: {
    color: Colors.primaryText
  },
  italics       : {
    fontStyle: 'italic'
  },

  buttonLink: {
    backgroundColor: 'transparent',
    shadowColor    : 'transparent'
  },

  buttonLinkText: {
    color          : Colors.primary,
    textShadowColor: 'transparent'
  }
})
