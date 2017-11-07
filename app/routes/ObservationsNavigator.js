import React from 'react'
import ObservationsScreen from '../screens/ObservationsScreen'
import ObservationScreen from '../screens/ObservationScreen'
import {StackNavigator} from 'react-navigation'

const Nav = new StackNavigator({
  Observations: {
    screen           : ObservationsScreen,
    navigationOptions: {}
  },
  Observation : {
    screen           : ObservationScreen,
    navigationOptions: {}
  }
}, {
  headerMode      : 'none'
})

export default Nav