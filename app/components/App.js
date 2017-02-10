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
import CameraScene from '../scenes/CameraScene'

export default class WildType extends Component {
  renderScene(route, navigator) {
    if (route.index == 0) {
      return <LandingScene title={route.title} navigator={navigator}/>
    }

    if (route.index == 1) {
      return <MapScene title={route.title} navigator={navigator}/>
    }

    if(route.index == 2) {
      return <CameraScene navigator={navigator}/>
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
          initialRoute={{ title: 'Overview', index: 0 }}
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
