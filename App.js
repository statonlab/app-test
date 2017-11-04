import React, {Component} from 'react'
import {
  StatusBar,
  View,
  StyleSheet
} from 'react-native'
import Diagnostics from './app/helpers/Diagnostics'
import Actions from './app/helpers/Actions'
import Spinner from './app/components/Spinner'
import Navigator from './app/routes/Navigator'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  componentWillMount() {
    this.initApp()
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  container: {
    flex: 1
  }
})
