import { createStackNavigator } from 'react-navigation-stack'
import LandingScreen from '../screens/LandingScreen'
import SubmittedScreen from '../screens/SubmittedScreen'
import CameraScreen from '../screens/CameraScreen'
import TreeScreen from '../screens/TreeScreen'
import Icon from 'react-native-vector-icons/Ionicons'

function navigationOptions(label, icon, size) {
  if (typeof size === 'undefined') {
    size = 30
  }

  const renderedIcon = ({tintColor}) => <Icon name={icon} color={tintColor} size={size}/>

  return {
    drawerLabel: label,
    drawerIcon : renderedIcon,
    tabBarLabel: label,
    tabBarIcon : renderedIcon,
  }
}

let ObserveStackNavigator = new createStackNavigator({
  Landing: {
    screen           : LandingScreen,
    navigationOptions: {
      ...(navigationOptions('My Observations', 'md-home', 25)),
    },
  },

  Tree: {
    screen           : TreeScreen,
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode : 'locked-closed',
    },
  },

  Camera: {
    screen           : CameraScreen,
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode : 'locked-closed',
    },
  },

  Submitted: {
    screen           : SubmittedScreen,
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode : 'locked-closed',
    },
  },
}, {
  initialRouteName: 'Landing',
  headerMode      : 'none',
})

ObserveStackNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked'
  let tabBarVisible  = true
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed'
    tabBarVisible  = false
  }

  return {
    drawerLockMode,
    tabBarVisible,
  }
}

export default ObserveStackNavigator
