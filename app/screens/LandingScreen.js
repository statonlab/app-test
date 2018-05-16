import React from 'react'
import Screen from './Screen'
import {
  View,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import UploadButton from '../components/UploadButton'
import SnackBarNotice from '../components/SnackBarNotice'
import File from '../helpers/File'
import User from '../db/User'
import Guide from '../components/Guide'
import MainTrees from '../components/MainTrees'

export default class LandingScreen extends Screen {
  constructor(props) {
    super(props)

    let readyToRender = realm.objects('Guide').filtered('screen == "WelcomeModal"').length > 0

    this.state = {
      userLoggedIn: false,
      noticeText  : 'Success!',
      // Wait for all events to execute before asking user
      // for location permissions and displaying Guide
      readyToRender
    }

    // Hold all events so we can remove them later and prevent memory leaks
    this.events = []
    // It's important that we call `registerEvents()` in the constructor
    // If it's not called in the constructor, the readyToRender may never get set
    this.registerEvents()

    this.fs      = new File()
    this.android = Platform.OS === 'android'
  }

  /**
   * Sets the initial sidebar links and listens to events.
   */
  componentDidMount() {
    this.analytics.visitScreen('LandingScreen')

    this.setState({
      userLoggedIn: this.isLoggedIn()
    })
  }

  /**
   * Register event listeners and handlers.
   */
  registerEvents() {
    this.events.push(DeviceEventEmitter.addListener('userLoggedOut', () => {
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }

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
    }))

    this.events.push(DeviceEventEmitter.addListener('ObservationDeleted', () => {
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
    }))

    this.events.push(DeviceEventEmitter.addListener('observationUploaded', () => {
      if (this.refs.uploadButton) {
        this.refs.uploadButton.getObservations()
      }
    }))

    this.events.push(DeviceEventEmitter.addListener('userRegistered', () => {
      this.setState({
        userLoggedIn : true,
        noticeText   : 'Successfully registered membership!',
        readyToRender: true
      })

      if (this.refs.snackbar) {
        this.refs.snackbar.showBar()
      }
    }))

    this.events.push(DeviceEventEmitter.addListener('welcomeModalDone', () => {
      this.setState({readyToRender: true})
    }))

    this.events.push(DeviceEventEmitter.addListener('loginRequest', () => {
      this.navigator.navigate('Login')
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
    this.navigator.navigate('DrawerToggle')
  }

  /**
   * Render login button.
   *
   * @returns {{XML}}
   */
  loginButton() {
    return (
      <TouchableOpacity style={[styles.button, {marginHorizontal: 5}]}
                        onPress={() => this.navigator.navigate('Login')}>
        <Text style={styles.buttonText}>Login to upload your entries</Text>
      </TouchableOpacity>
    )
  }

  /**
   * Notify user of updated observation.
   */
  uploadCompleted() {
    this.setState({noticeText: 'Observations Uploaded'})
    this.refs.snackbar.showBar()
  }

  /**
   * Show error message if upload is unsuccessful.
   */
  uploadError(message) {
    this.setState({noticeText: message})
    this.refs.snackbar.showBar()
  }

  renderGuideMessage() {
    return [
      <View>
        <Text style={Guide.style.headerText}>Welcome to TreeSnap!</Text>
        <Text style={Guide.style.bodyText}>
          To get started, first select the type of tree you'd like to report.
          We have scientific partners with breeding programs for the listed trees, but you can report any tree by
          selecting <Text style={{fontStyle: 'italic'}}>Other</Text>.
        </Text>
      </View>,
      <View>
        <Text style={Guide.style.headerText}>Submit Your Observations</Text>
        <Text style={Guide.style.bodyText}>
          When you've returned from the woods and are back in wi-fi range, submit your observations to the TreeSnap servers.
        </Text>
        <Text style={Guide.style.bodyText}>
          You can visit TreeSnap.org to see your trees and learn more about the TreeSnap project and our scientific partners.
        </Text>
      </View>,
      <View>
        <Text style={Guide.style.headerText}>Navigating TreeSnap</Text>
        {this.android ?
          <Text style={Guide.style.bodyText}>
            You can access the menu by tapping the drawer icon in the upper left.
            From here you can view your submitted observations, change your account settings, and learn more about TreeSnap.
          </Text> :
          <View>
            <Text style={Guide.style.bodyText}>
              Observations can be viewed and edited by tapping the icons at the bottom of the screen to visit the map or see your previously submitted observations.
            </Text>
            <Text style={Guide.style.bodyText}>
              Tap the menu icon in the upper left to access your account settings or learn more about TreeSnap.
            </Text>
          </View>
        }
      </View>
    ]
  }

  render() {
    if (!this.state.readyToRender) {
      return null
    }

    return (
      <View style={styles.container}>
        <Header
          title="Observe"
          navigator={this.navigator}
          rightIcon="help"
          onRightPress={() => {
            if (typeof this.guide === 'undefined') {
              this.setState({showGuide: true})
              setTimeout(() => {
                this.guide.show()
              }, 100)
            } else {
              this.guide.show()
            }
          }}
          initial={true}
          onMenuPress={this.toggleMenu.bind(this)}
        />
        <Spinner ref={ref => this.spinner = ref}/>
        <Guide
          ref={ref => this.guide = ref}
          screen="LandingScreen"
          message={this.renderGuideMessage()}
          version={1}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.plantsContainer}>
            {this.state.userLoggedIn ?
              <UploadButton ref="uploadButton"
                            spinner={this.spinner}
                            onUploadDone={this.uploadCompleted.bind(this)}
                            onError={this.uploadError.bind(this)}/> :
              this.loginButton.call(this)
            }

            <MainTrees
              onPress={tree => {
                this.navigator.navigate('Tree', {title: tree.title})
              }}
              onReady={() => {
                if (this.spinner) {
                  this.spinner.close()
                }
              }}
            />
          </View>
        </ScrollView>
        <SnackBarNotice ref="snackbar" noticeText={this.state.noticeText}/>
      </View>
    )
  }
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
    backgroundColor: 'transparent',
    fontSize       : 16,
    flex           : 0,
    paddingLeft    : 5,
    fontWeight     : '500',
    marginBottom   : 5,
    color          : '#444'
  },

  cardBody: {
    flexDirection: 'column',
    flex         : 1,
    padding      : 5,
    alignItems   : 'center'
  },

  cardBodyText: {
    color        : '#777',
    paddingBottom: 10,
    paddingLeft  : 5,
    fontSize     : 14
  },

  icon: {
    color: '#777',
    width: 20
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

  italics: {
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
