/**
 * Android App Entry Point
 * @flow
 */
import React from 'react'
import { AppRegistry, LogBox } from 'react-native'
import TreeSnap from './App'

if (__DEV__) {
  LogBox.ignoreAllLogs()
}

AppRegistry.registerComponent('TreeSnap', () => TreeSnap)
