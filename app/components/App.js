/**
 * WildType - application entry point
 * https://github.com/statonlab/app-test
 */

import React, {Component} from 'react'
import {AppRegistry, Navigator, StatusBar, View, StyleSheet} from 'react-native'
import LandingScene from '../scenes/LandingScene'
import MapScene from '../scenes/MapScene'
import FormScene from '../scenes/FormScene'
import CameraScene from '../scenes/CameraScene'
import CapturedScene from '../scenes/CapturedScene'
import CaptureLocationScene from '../scenes/CaptureLocationScene'
import TreeDescriptionScene from '../scenes/TreeDescriptionScene'
import SubmittedScene from '../scenes/SubmittedScene'
import AboutScene from '../scenes/AboutScene'
import PrivacyPolicyScene from '../scenes/PrivacyPolicyScene'
import HealthSafetyScene from '../scenes/HealthSafetyScene'
import LoginScene from '../scenes/LoginScene'
import RegistrationScene from '../scenes/RegisterationScene'

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
      return <MapScene title="Your Entries" navigator={navigator}/>
    }

    if (route.label == 'FormScene') {
      return <FormScene title={route.title} navigator={navigator} formProps={route.formProps}/>
    }

    if (route.label == 'CameraScene') {
      return <CameraScene navigator={navigator}/>
    }

    if (route.label == 'CapturedScene') {
      return <CapturedScene navigator={navigator} image={route.image}/>
    }

    if (route.label == 'CaptureLocationScene') {
      return <CaptureLocationScene title={route.title} navigator={navigator}/>
    }

    if (route.label == 'TreeDescriptionScene') {
      return <TreeDescriptionScene title={route.title} navigator={navigator} image={route.image}/>
    }

    if (route.label == 'SubmittedScene') {
      return <SubmittedScene navigator={navigator} plant={route.plant}/>
    }

    if (route.label == 'LoginScene') {
      return <LoginScene navigator={navigator}/>
    }

    if (route.label == 'RegistrationScene') {
      return <RegistrationScene navigator={navigator}/>
    }

    // Static Scenes
    if (route.label == 'AboutScene') {
      return <AboutScene navigator={navigator}/>
    }

    if (route.label == 'HealthSafetyScene') {
      return <HealthSafetyScene navigator={navigator}/>
    }

    if (route.label == 'PrivacyPolicyScene') {
      return <PrivacyPolicyScene navigator={navigator}/>
    }
  }

  configureScene(route, routeStack) {
    let config = Navigator.SceneConfigs.PushFromRight
    if (typeof route.transition !== 'undefined') {
      if (typeof Navigator.SceneConfigs[route.transition] !== 'undefined') {
        config = Navigator.SceneConfigs[route.transition]
      }
    }

    if (typeof route.gestures !== 'undefined') {
      config = {
        ...config,
        gestures: route.gestures
      }
    }

    return config
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
          configureScene={this.configureScene}
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
