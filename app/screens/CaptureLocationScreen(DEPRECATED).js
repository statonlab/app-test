import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet
} from 'react-native'
import GetLocation from '../components/GetLocation'
import Header from '../components/Header'

export default class CaptureLocationScreen extends Screen {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Capture Location" navigator={this.navigator}/>
        <GetLocation
          accept={this.goToForm}
          cancel={this.goToForm}/>
      </View>
    )
  }

  goToForm = () => {
    this.props.navigator.popN(1)
  }
}

CaptureLocationScreen.propTypes = {
  navigator : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
});
