/**
 * Android App Entry Point
 * @flow
 */
import React from 'react'
import { AppRegistry, LogBox } from 'react-native'
import TreeSnap from './App'

// if (__DEV__) {
//   LogBox.ignoreWarnings([
//     'Warning: isMounted(...)',
//     'Module RNFetchBlob requires main queue',
//     'Warning: componentWillReceiveProps is',
//     'Warning: componentWillUpdate is',
//   ])
// }

AppRegistry.registerComponent('TreeSnap', () => TreeSnap)
