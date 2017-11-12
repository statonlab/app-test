import React, {Component} from 'react'
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  DeviceEventEmitter
} from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  DrawerItems
} from 'react-navigation'
import LandingScreen from '../screens/LandingScreen'
import MapScreen from '../screens/MapScreen'
import CameraScreen from '../screens/CameraScreen'
import SubmittedScreen from '../screens/SubmittedScreen'
import AboutScreen from '../screens/AboutScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicySreen'
import HealthSafetyScreen from '../screens/HealthSafetyScreen'
import LoginScreen from '../screens/LoginScreen'
import RegistrationScreen from '../screens/RegisterationScreen'
import TreeScreen from '../screens/TreeScreen'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'
import IntermediateAccountScreen from '../screens/IntermediateAccountScreen'
import ObservationsNavigator from './ObservationsNavigator'
import User from '../db/User'
import {ifIphoneX} from 'react-native-iphone-x-helper'

/**
 * Implementation of react-navigation.
 *
 * @see https://reactnavigation.org/
 */
export default class Navigator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: User.loggedIn()
    }

    this.events = []
  }

  /**
   * Listen to log in and out events.
   */
  componentWillMount() {
    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', () => this.setState({loggedIn: User.loggedIn()})))
    this.events.push(DeviceEventEmitter.addListener('userLoggedOut', () => this.setState({loggedIn: User.loggedIn()})))
    this.events.push(DeviceEventEmitter.addListener('userRegistered', () => this.setState({loggedIn: User.loggedIn()})))
  }

  /**
   * Remove event listeners.
   */
  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  /**
   * The observe navigation stack. contains the landing page and all screens
   * to submit an observation.
   *
   * @return {*}
   */
  observationStack() {
    return new StackNavigator({
      Landing  : {
        screen           : LandingScreen,
        navigationOptions: {
          ...(this.navigationOptions('My Observations', 'md-home', 25))
        }
      },
      Tree     : {
        screen           : TreeScreen,
        navigationOptions: {
          gesturesEnabled: false,
          drawerLockMode : 'locked-closed'
        }
      },
      Camera   : {
        screen           : CameraScreen,
        navigationOptions: {
          gesturesEnabled: false,
          drawerLockMode : 'locked-closed'
        }
      },
      Submitted: {
        screen           : SubmittedScreen,
        navigationOptions: {
          gesturesEnabled: false,
          drawerLockMode : 'locked-closed'
        }
      }
    }, {
      initialRouteName: 'Landing',
      headerMode      : 'none'
    })
  }

  /**
   * IOS Bottom Tabs.
   *
   * @return {*}
   */
  tabs() {
    return new TabNavigator({
      Landing              : {
        screen           : this.observationStack(),
        navigationOptions: {
          ...(this.navigationOptions('Observe', 'md-aperture'))
        }
      },
      ObservationsNavigator: {
        screen           : ObservationsNavigator,
        navigationOptions: {
          ...(this.navigationOptions('Observations', 'ios-leaf'))
        }
      },
      Map                  : {
        screen           : MapScreen,
        navigationOptions: {
          ...(this.navigationOptions('Map', 'md-map'))
        }
      },
      Account              : {
        screen           : IntermediateAccountScreen,
        navigationOptions: {
          ...(this.navigationOptions('Settings', 'md-settings'))
        }
      }
    }, {
      initialRouteName: 'Landing',
      animationEnabled: false,
      lazy            : true,
      tabBarOptions   : {
        activeTintColor: Colors.primary
      }
    })
  }

  /**
   * Display routes only if the user is not logged in.
   *
   * @return {*}
   */
  getRegistrationRoutes() {
    if (!this.state.loggedIn) {
      return {
        Registration: {
          screen           : RegistrationScreen,
          navigationOptions: {
            ...(this.navigationOptions('Register', 'md-person-add', 25))
          }
        },
        Login       : {
          screen           : LoginScreen,
          navigationOptions: {
            ...(this.navigationOptions('Login', 'md-person', 25))
          }
        }
      }
    }

    return null
  }

  getLogoutRoute() {
    if (this.state.loggedIn) {
      return {
        Logout: {
          screen           : LoginScreen,
          navigationOptions: {
            ...(this.navigationOptions('Logout', 'md-log-out', 25))
          }
        }
      }
    }

    return null
  }

  /**
   * Routes shared between IOS and Android.
   *
   * @return {Object}
   */
  sharedRoutes() {
    return {
      // Needed to add this here since it needs to go right after the observations item
      ...(Platform.OS === 'android' ? {
        Map: {
          screen           : MapScreen,
          navigationOptions: {
            ...(this.navigationOptions('My Observations Map', 'md-map', 25))
          }
        }
      } : null),

      // Get registration routes
      ...this.getRegistrationRoutes(),

      About        : {
        screen           : AboutScreen,
        navigationOptions: {
          ...(this.navigationOptions('About Us', 'md-contacts', 25))
        }
      },
      PrivacyPolicy: {
        screen           : PrivacyPolicyScreen,
        navigationOptions: {
          ...(this.navigationOptions('Privacy Policy', 'md-lock', 25))
        }
      },
      HealthSafety : {
        screen           : HealthSafetyScreen,
        navigationOptions: {
          ...(this.navigationOptions('Health and Safety', 'md-heart', 25))
        }
      },

      // Get logout route
      ...(this.getLogoutRoute())
    }
  }

  /**
   * Drawer component.
   *
   * @param props
   * @return {XML}
   */
  renderDrawer(props) {
    return (
      <ScrollView style={{flex: 1}}>
        <Text style={[style.sidebarHeader, ifIphoneX({marginTop: 45})]}>NAVIGATION MENU</Text>
        <DrawerItems {...{
          ...props,
          onItemPress: (route) => {
            if (route.route.routeName === 'Logout') {
              User.logout()
              return
            }
            props.onItemPress(route)
          }
        }}/>
      </ScrollView>
    )
  }

  /**
   * Drawer options.
   * @see https://reactnavigation.org/docs/navigators/drawer
   * @return {Object}
   */
  drawerOptions() {
    return {
      contentComponent: this.renderDrawer.bind(this),
      contentOptions  : {
        activeBackgroundColor: '#f7f7f7',
        activeTintColor      : Colors.primary,
        inactiveTintColor    : '#777777'
      }
    }
  }

  /**
   * General navigation options.
   *
   * @param {String} label Display label
   * @param {String} icon Display icon name (see: https://ionicframework.com/docs/ionicons/)
   * @param {Number} size
   * @return {Object}
   */
  navigationOptions(label, icon, size) {
    if (typeof size === 'undefined') {
      size = 30
    }

    const renderedIcon = ({tintColor}) => <Icon name={icon} color={tintColor} size={size}/>

    return {
      drawerLabel: label,
      drawerIcon : renderedIcon,
      tabBarLabel: label,
      tabBarIcon : renderedIcon
    }
  }

  /**
   * IOS navigation.
   *
   * @return {XML}
   */
  ios() {
    const Nav = new DrawerNavigator({
      Landing: {
        screen           : this.tabs(),
        navigationOptions: {
          ...(this.navigationOptions('Home', 'md-home', 25))
        }
      },
      ...(this.sharedRoutes())
    }, {
      initialRouteName: 'Landing',
      ...(this.drawerOptions())
    })

    return (<Nav/>)
  }

  /**
   * Android Navigation.
   *
   * @return {XML}
   */
  android() {
    const Nav = new DrawerNavigator({
      Landing              : {
        screen           : this.observationStack(),
        navigationOptions: {
          ...(this.navigationOptions('Observe', 'md-aperture', 25))
        }
      },
      // Show AccountScreen if user is logged in
      ...(this.state.loggedIn ? {
        Account: {
          screen           : IntermediateAccountScreen,
          navigationOptions: {
            ...(this.navigationOptions('My Account', 'md-settings', 25))
          }
        }
      } : null),
      ObservationsNavigator: {
        screen           : ObservationsNavigator,
        navigationOptions: {
          ...(this.navigationOptions('My Observations', 'ios-leaf', 25))
        }
      },
      ...(this.sharedRoutes())
    }, {
      initialRouteName: 'Landing',
      ...(this.drawerOptions())
    })

    return (<Nav/>)
  }

  /**
   * Main method to create the navigator.
   *
   * @return {XML}
   */
  create() {
    if (Platform.OS === 'android') {
      return this.android()
    } else {
      return this.ios()
    }
  }

  render() {
    return this.create()
  }
}

const style = StyleSheet.create({
  sidebarHeader: {
    color            : '#777',
    fontWeight       : 'bold',
    fontSize         : 12,
    marginVertical   : Platform.OS === 'android' ? 20 : 0,
    marginTop        : Platform.OS === 'android' ? 20 : 25,
    paddingHorizontal: 20
  }
})