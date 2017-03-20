import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text
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
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
              <Icon name="camera" size={36} color={"#fff"}/>
            </Text>
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
}

CameraScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container     : {
    flex: 1
  },
  preview       : {
    flex          : 1,
    justifyContent: 'flex-end',
    alignItems    : 'center',
    height        : undefined,
    width         : undefined
  },
  toolsContainer: {
    flex           : 0,
    width          : Dimensions.get('window').width,
    height         : 70,
    justifyContent : 'center',
    alignItems     : 'center',
    backgroundColor: Colors.transparentDark
  },
  capture       : {
    flex   : 0,
    color  : '#000',
    padding: 10,
  }
})
