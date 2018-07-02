import React from 'react'
import ObservationsScreen from '../screens/ObservationsScreen'
import ObservationScreen from '../screens/ObservationScreen'
import {createStackNavigator} from 'react-navigation'

const Nav = new createStackNavigator({
  Observations: {
    screen           : ObservationsScreen,
    navigationOptions: {}
  },
  Observation : {
    screen           : ObservationScreen,
    navigationOptions: {
      drawerLockMode: 'locked-closed',
      tabBarVisible: false
    }
  }
}, {
  headerMode: 'none'
})

Nav.navigationOptions = ({navigation}) => {
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

export default Nav
