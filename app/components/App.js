/**
 * WildType - application entry point
 * https://github.com/statonlab/app-test
 */

import React, {Component} from 'react'
import {Navigator, StatusBar, View, StyleSheet} from 'react-native'
import LandingScene from '../scenes/LandingScene'
import MapScene from '../scenes/MapScene'
import FormScene from '../scenes/FormScene'
import CameraScene from '../scenes/CameraScene'
import CaptureLocationScene from '../scenes/CaptureLocationScene'
import TreeDescriptionScene from '../scenes/TreeDescriptionScene'
import SubmittedScene from '../scenes/SubmittedScene'
import AboutScene from '../scenes/AboutScene'
import AccountScene from '../scenes/AccountScene'
import PrivacyPolicyScene from '../scenes/PrivacyPolicyScene'
import HealthSafetyScene from '../scenes/HealthSafetyScene'
import LoginScene from '../scenes/LoginScene'
import RegistrationScene from '../scenes/RegisterationScene'
import ObservationsScene from '../scenes/ObservationsScene'
import ObservationScene from '../scenes/ObservationScene'
import TreeScene from '../scenes/TreeScene'

const initialRouteStack = [
  {
    label: 'LandingScene'
  }
]

export default class WildType extends Component {
  renderScene(route, navigator) {
    if (route.label === 'LandingScene') {
      return <LandingScene title="Overview" navigator={navigator}/>
    }

    if (route.label === 'MapScene') {
      return <MapScene title="Your Entries" navigator={navigator}/>
    }

    /** Deprecated

     if (route.label === 'FormScene') {
      return <FormScene title={route.title} navigator={navigator} formProps={route.formProps} entryInfo={route.entryInfo} edit={route.edit}/>
    }
     **/

    if (route.label === 'CameraScene') {
      return <CameraScene navigator={navigator} images={route.images ? route.images : []}/>
    }

    /** DEPRECATED
     if (route.label == 'CapturedScene') {
      return <CapturedScene navigator={navigator} image={route.image}/>
    }**/

    if (route.label === 'CaptureLocationScene') {
      return <CaptureLocationScene title={route.title} navigator={navigator}/>
    }

    if (route.label === 'TreeScene') {
      return <TreeScene title={route.title} navigator={navigator}
        entryInfo={route.entryInfo} edit={route.edit}/>
    }

    if (route.label === 'SubmittedScene') {
      return <SubmittedScene navigator={navigator} plant={route.plant}/>
    }

    if (route.label === 'LoginScene') {
      return <LoginScene navigator={navigator} email={route.email}/>
    }

    if (route.label === 'RegistrationScene') {
      return <RegistrationScene navigator={navigator}/>
    }

    if (route.label === 'ObservationsScene') {
      return <ObservationsScene navigator={navigator}/>
    }

    if (route.label === 'ObservationScene') {
      return (
        <ObservationScene
          navigator={navigator}
          plant={route.plant}
          onUnmount={typeof route.onUnmount === 'function' ? route.onUnmount : () => {
          }}
        />
      )
    }

    if (route.label === 'AccountScene') {
      return <AccountScene navigator={navigator}/>
    }

    // Static Scenes
    if (route.label === 'AboutScene') {
      return <AboutScene navigator={navigator}/>
    }

    if (route.label === 'HealthSafetyScene') {
      return <HealthSafetyScene navigator={navigator}/>
    }

    if (route.label === 'PrivacyPolicyScene') {
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
    flex: 1
  },
  container: {
    flex: 1
  }
})
