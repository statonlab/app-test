/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
import FormScene from '../scenes/formScene'
import CameraScene from '../scenes/CameraScene'
import CapturedScene from '../scenes/CapturedScene'
import TreeDescriptionScene from '../scenes/TreeDescriptionScene'

export default class WildType extends Component {
  renderScene(route, navigator) {
      if (route.index == 0) {
          return <LandingScene title={route.title} navigator={navigator}/>
      }

      if (route.index == 1) {
          return <MapScene title={route.title} navigator={navigator}/>
      }

      if (route.index == 2) {
          return <CameraScene navigator={navigator}/>
      }

      if (route.index == 3) {
          return <FormScene title={route.title} navigator={navigator} />
      }

    if(route.index == 4) {
      return <CapturedScene navigator={navigator} image={route.image}/>
    }
    if(route.index == 5) {
      return <TreeDescriptionScene navigator={navigator} image={route.image}/>
    }
  }

  render() {
    return (

      //question: initialRouteStack would go here below initialRoute?
      //https://facebook.github.io/react-native/docs/navigator.html
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#25897d"
          barStyle="light-content"
        />
        <Navigator
          style={styles.navigator}
          initialRoute={{ title: 'Overview', index: 5 }}
          renderScene={this.renderScene}
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
