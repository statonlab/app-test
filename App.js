import React, {Component} from 'react'
import {
  StatusBar,
  View,
  StyleSheet,
  DeviceEventEmitter,
  Alert
} from 'react-native'
import Diagnostics from './app/helpers/Diagnostics'
import Actions from './app/helpers/Actions'
import BackgroundJobs from './app/helpers/BackgroundJobs'
import Spinner from './app/components/Spinner'
import SnackBarNotice from './app/components/SnackBarNotice'
import Navigator from './app/routes/Navigator'
import Observation from './app/helpers/Observation'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      snackMessage: ''
    }

    try {
      let jobs = new BackgroundJobs()
      jobs.init()
    } catch (error) {
      console.log(error)
    }

    this.events = []
  }

  componentWillMount() {
    this.initApp()

    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', () => {
      if(this.snackbar) {
        this.setState({snackMessage: 'Logged in successfully!'})
        this.snackbar.showBar()
      }
      Observation.download()
    }))

    this.events.push(DeviceEventEmitter.addListener('userLoggedOut', () => {
      if(this.snackbar) {
        this.setState({snackMessage: 'Logged out successfully!'})
        this.snackbar.showBar()
      }
    }))
  }

  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  async initApp() {
    try {
      await Diagnostics.run()
    } catch (error) {
      console.log(error)
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
        <Navigator/>
        <Spinner show={this.state.loading}/>
        <SnackBarNotice ref={(ref) => this.snackbar = ref} noticeText={this.state.snackMessage}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
