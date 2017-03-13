import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import Emmiter from 'emitter'
import GetLocation from '../components/GetLocation'
import Header from '../components/Header'

export default class CaptureLocationScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Capture Location" navigator={this.props.navigator}/>
        <GetLocation
          image={this.props.image}
          accept={this.goToForm}
          cancel={this.goToForm}/>
      </View>
    )
  }

  goToForm = () => {
    this.props.navigator.popN(3)
    DeviceEventEmitter.emit('LocationCaptured')
  }
}

CaptureLocationScene.propTypes = {
  navigator : PropTypes.object.isRequired,
  image     : PropTypes.object.isRequired,
  plantTitle: PropTypes.string.isRequired,
  formProps : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
});
