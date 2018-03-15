import React from 'react'
import {DeviceEventEmitter} from 'react-native'
import Screen from './Screen'
import User from '../db/User'
import AccountScreen from './AccountScreen'
import LoginScreen from './LoginScreen'

export default class IntermediateAccountScreen extends Screen {
  static navigationOptions = {
    tabBarOnPress: ({scene, jumpToIndex}) => {
      DeviceEventEmitter.emit('IntermediateAccountScreen.loaded')
      jumpToIndex(scene.index)
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: User.loggedIn()
    }
  }

  componentWillMount() {
    this.events = [
      DeviceEventEmitter.addListener('IntermediateAccountScreen.loaded', () => {
        this.setState({loggedIn: User.loggedIn()})
      }),
      DeviceEventEmitter.addListener('userLoggedOut', () => {
        this.setState({loggedIn: User.loggedIn()})
      })
    ]
  }

  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  updateStatus() {
    this.setState({loggedIn: User.loggedIn()})
    return true
  }

  render() {
    if (this.state.loggedIn) {
      return <AccountScreen {...this.props} onLogout={this.updateStatus.bind(this)}/>
    }

    return <LoginScreen {...this.props} onLogin={this.updateStatus.bind(this)}/>
  }
}

IntermediateAccountScreen.propTypes = {
  // navigator: PropTypes.object.isRequired
}
