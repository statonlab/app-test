/**
 * Android App Entry Point
 * @flow
 */
import React from 'react'
import {AppRegistry} from 'react-native'
import TreeSnap from './App'

console.ignoredYellowBox= ['Warning: isMounted(...)']

AppRegistry.registerComponent('TreeSnap', () => TreeSnap)
