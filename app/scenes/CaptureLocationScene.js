import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import GetLocation from '../components/GetLocation'
import Header from '../components/Header'

export default class CaptureLocationScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Capture Location" navigator={this.props.navigator}/>
        <GetLocation
          accept={this.goToForm}
          cancel={this.goToForm}/>
      </View>
    )
  }

  goToForm = () => {
    DeviceEventEmitter.emit('FormStateChanged')
    this.props.navigator.popN(1)
  }
}

CaptureLocationScene.propTypes = {
  navigator : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
});
