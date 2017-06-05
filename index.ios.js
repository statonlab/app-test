/**
 * IOs App Entry Point
 * @flow
 */

import React, {Component} from 'react'
import {
  AppRegistry
} from 'react-native'

import App from './app/components/App'

export default class TreeSnap extends Component {

  render() {
    return (
      <App/>
    )
  }
}

AppRegistry.registerComponent('TreeSnap', () => TreeSnap);
