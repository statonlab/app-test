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
      drawerLockMode: 'locked-closed'
    }
  }
}, {
  headerMode: 'none'
})

Nav.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked'
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed'
  }

  return {
    drawerLockMode
  }
}

export default Nav
