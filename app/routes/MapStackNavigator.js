import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import MapScreen from '../screens/MapScreen'
import ObservationScreen from '../screens/ObservationScreen'

const MapStackNavigator = createStackNavigator({
  Map: {
    screen: MapScreen,
  },

  ObservationFromMap: {
    screen: ObservationScreen,
  },
}, {
  initialRouteName: 'Map',
  headerMode      : 'none',
})

MapStackNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true

  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}

export default MapStackNavigator
