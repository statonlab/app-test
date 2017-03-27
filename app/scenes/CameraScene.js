import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import Camera from 'react-native-camera'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'

export default class CameraScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Camera" navigator={this.props.navigator}/>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          captureTarget={Camera.constants.CaptureTarget.disk}
          style={styles.preview}
          keepAwake={true}
          mirrorImage={false}
          captureQuality="medium">
          <View style={styles.toolsContainer}>
            <TouchableOpacity style={styles.toolTouchable} onPress={this.cancel.bind(this)}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture.bind(this)}>
              <Icon name="camera" size={36} color={"#fff"}/>
            </TouchableOpacity>
            { /* Place holder to guarantee center position of the camera icon */ }
            <Text style={[styles.toolText, {color: 'transparent'}]}>ph</Text>
          </View>
        </Camera>
      </View>
    )
  }

  takePicture = () => {
    try {
      this.camera.capture()
        .then((data) => {
          this.props.navigator.push({
            label: 'CapturedScene',
            image: data
          })
        })
    } catch (err) {
      console.error(err)
    }
  }

  cancel = () => {
    this.props.navigator.pop()
  }
}

CameraScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  preview: {
    flex          : 1,
    justifyContent: 'flex-end',
    alignItems    : 'center',
    height        : undefined,
    width         : undefined
  },

  toolsContainer: {
    flex           : 0,
    flexDirection  : 'row',
    width          : Dimensions.get('window').width,
    height         : 70,
    justifyContent : 'space-between',
    alignItems     : 'center',
    backgroundColor: Colors.transparentDark
  },

  capture: {
    flex      : 1,
    width     : undefined,
    height    : undefined,
    alignItems: 'center'
  },

  toolText: {
    color  : '#fff',
    flex   : 0,
    padding: 15,
    width  : 90
  },

  toolTouchable: {
    flex  : 0,
    width : 90,
    height: undefined
  }
})
