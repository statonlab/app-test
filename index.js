/**
 * Android App Entry Point
 * @flow
 */
import React from 'react'
import {AppRegistry, YellowBox} from 'react-native'
import TreeSnap from './App'

YellowBox.ignoreWarnings([
  'Warning: isMounted(...)',
  'Module RNFetchBlob requires main queue'
])

AppRegistry.registerComponent('TreeSnap', () => TreeSnap)
