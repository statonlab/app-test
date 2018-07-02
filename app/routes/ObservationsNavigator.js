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

export default Nav
