/**
 * WildType - application entry point
 * https://github.com/statonlab/app-test
 */

import React, {Component} from 'react'
import {
  AppRegistry,
  Navigator,
  StatusBar,
  View,
  StyleSheet
} from 'react-native'
import LandingScene from '../scenes/LandingScene'
import MapScene from '../scenes/MapScene'
import FormScene from '../scenes/FormScene'
import CameraScene from '../scenes/CameraScene'
import CapturedScene from '../scenes/CapturedScene'
import CaptureLocationScene from '../scenes/CaptureLocationScene'
import TreeDescriptionScene from '../scenes/TreeDescriptionScene'
import SubmittedScene from '../scenes/SubmittedScene'

const initialRouteStack = [
  {
    label: 'LandingScene'
  }
]

export default class WildType extends Component {
  renderScene(route, navigator) {
    if (route.label == 'LandingScene') {
      return <LandingScene title="Overview" navigator={navigator}/>
    }

    if (route.label == 'MapScene') {
      return <MapScene title={route.title} navigator={navigator}/>
    }

    if (route.label == 'FormScene') {
      return <FormScene title={route.title} navigator={navigator}/>
    }

    if (route.label == 'CameraScene') {
      return <CameraScene navigator={navigator} plantTitle={route.plantTitle}/>
    }

    if (route.label == 'CapturedScene') {
      return <CapturedScene navigator={navigator} image={route.image} plantTitle={route.plantTitle}/>
    }

    if (route.label == 'CaptureLocationScene') {
      return <CaptureLocationScene title={route.title} navigator={navigator} image={route.image} plantTitle={route.plantTitle}/>
    }

    if (route.label == 'TreeDescriptionScene') {
      return <TreeDescriptionScene title={route.title} navigator={navigator} image={route.image}/>
    }

    if (route.label == 'SubmittedScene') {
      return <SubmittedScene navigator={navigator}/>
    }
  }

  configScene(route, routeStack) {
    switch (route.label) {
      case 'CameraScene':
        return Navigator.SceneConfigs.FloatFromBottom
        break
      default:
        return Navigator.SceneConfigs.PushFromRight
        break
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#25897d"
          barStyle="light-content"
        />
        <Navigator
          style={styles.navigator}
          initialRouteStack={initialRouteStack}
          renderScene={this.renderScene}
          configureScene={this.configScene}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    flex: 1,
  }
})

AppRegistry.registerComponent('WildType', () => WildType);
