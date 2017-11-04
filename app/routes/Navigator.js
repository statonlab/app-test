import {StackNavigator} from 'react-navigation'
import LandingScreen from '../screens/LandingScreen'
import MapScreen from '../screens/MapScreen'
import CameraScreen from '../screens/CameraScreen'
import SubmittedScreen from '../screens/SubmittedScreen'
import AboutScreen from '../screens/AboutScreen'
import AccountScreen from '../screens/AccountScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicySreen'
import HealthSafetyScreen from '../screens/HealthSafetyScreen'
import LoginScreen from '../screens/LoginScreen'
import RegistrationScreen from '../screens/RegisterationScreen'
import ObservationsScreen from '../screens/ObservationsScreen'
import ObservationScreen from '../screens/ObservationScreen'
import TreeScreen from '../screens/TreeScreen'

const Navigator = new StackNavigator({
  Landing      : {screen: LandingScreen},
  Login        : {screen: LoginScreen},
  About        : {screen: AboutScreen},
  Account      : {screen: AccountScreen},
  Map          : {screen: MapScreen},
  Camera       : {
    screen           : CameraScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Submitted    : {screen: SubmittedScreen},
  PrivacyPolicy: {screen: PrivacyPolicyScreen},
  HealthSafety : {screen: HealthSafetyScreen},
  Registration : {screen: RegistrationScreen},
  Observations : {screen: ObservationsScreen},
  Observation  : {screen: ObservationScreen},
  Tree         : {
    screen           : TreeScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
}, {
  initialRouteName: 'Landing',
  headerMode      : 'none'
})

const prevNavigationState = Navigator.router.getStateForAction
Navigator.router = {
  ...Navigator.router,
  getStateForAction(action, state) {
    if(state && action.type === 'replaceCurrentScreen') {
      const routes = state.routes.slice(0, state.routes.length - 1);
      routes.push(action);
      return {
        ...state,
        routes,
        index: routes.length - 1,
      };
    }
    return prevNavigationState(action, state)
  }
}

export default Navigator