import {createStackNavigator} from 'react-navigation'
import IntermediateAccountScreen from '../screens/IntermediateAccountScreen'
import IOSMoreScreen from '../screens/IOSMoreScreen'
import AboutScreen from '../screens/AboutScreen'
import HealthSafetyScreen from '../screens/HealthSafetyScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicySreen'
import LoginScreen from '../screens/LoginScreen'
import RegistrationScreen from '../screens/RegisterationScreen'

const MoreStackNavigator = new createStackNavigator({
  More         : {
    screen: IOSMoreScreen
  },
  Account      : {
    screen: IntermediateAccountScreen
  },
  About        : {
    screen: AboutScreen
  },
  HealthSafety : {
    screen: HealthSafetyScreen
  },
  PrivacyPolicy: {
    screen: PrivacyPolicyScreen
  },
  Login        : {
    screen: LoginScreen
  },
  Registration : {
    screen: RegistrationScreen
  }
}, {
  initialRouteName: 'More',
  headerMode      : 'none'
})

MoreStackNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked'
  let tabBarVisible  = true
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed'
    tabBarVisible  = false
  }

  return {
    drawerLockMode,
    tabBarVisible
  }
}

export default MoreStackNavigator
