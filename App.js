import React, {Component} from 'react'
import {
  StatusBar,
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import Diagnostics from './app/helpers/Diagnostics'
import Actions from './app/helpers/Actions'
import SnackBarNotice from './app/components/SnackBarNotice'
import Navigator from './app/routes/Navigator'
import Observation from './app/helpers/Observation'
import WelcomeModal from './app/components/WelcomeModal'
import NotificationsController from './app/components/NotificationsController'
import DeviceInfo from 'react-native-device-info'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      snackMessage: ''
    }

    this.events = []
  }

  componentDidMount() {
    this.initApp()

    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', () => {
      if (this.snackbar) {
        this.setState({snackMessage: 'Logged in successfully!'})
        this.snackbar.showBar()
      }
      Observation.download()
    }))

    this.events.push(DeviceEventEmitter.addListener('userLoggedOut', () => {
      if (this.snackbar) {
        this.setState({snackMessage: 'Logged out successfully!'})
        this.snackbar.showBar()
      }
    }))

    alert(DeviceInfo.getDeviceCountry())
  }

  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  async initApp() {
    try {
      await Diagnostics.run()
    } catch (error) {
      console.log('Unable to run diagnostics', error)
    }
    try {
      const actions = new Actions()
      await actions.run()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#25897d"
          barStyle="light-content"
        />
        <WelcomeModal
          onLoginRequest={() => {
            DeviceEventEmitter.emit('loginRequest')
          }}
          onDone={() => {
            DeviceEventEmitter.emit('welcomeModalDone')
          }}
        />
        <Navigator/>
        <SnackBarNotice ref={(ref) => this.snackbar = ref} noticeText={this.state.snackMessage}/>
        <NotificationsController onUploadRequest={() => {
          DeviceEventEmitter.emit('uploadRequested')
        }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
