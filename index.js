/**
 * Android App Entry Point
 * @flow
 */
import React from 'react'
import { AppRegistry, YellowBox } from 'react-native'
import TreeSnap from './App'

if (__DEV__) {
  YellowBox.ignoreWarnings([
    'Warning: isMounted(...)',
    'Module RNFetchBlob requires main queue'
  ])
}

AppRegistry.registerComponent('TreeSnap', () => TreeSnap)
