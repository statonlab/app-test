import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'
import Camera from 'react-native-camera'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'

export default class CameraScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      camera: {
        type : Camera.constants.Type.back,
        flash: Camera.constants.FlashMode.auto
      }
    }
  }

  render() {
    let flashIcon
    const {auto, on, off} = Camera.constants.FlashMode

    if (this.state.camera.flash === on) {
      flashIcon = (
        <TouchableOpacity
          style={[styles.toolTouchable, styles.flashTouchable]}
          onPress={this.switchFlash.bind(this)}
        >
          <IonIcon name="ios-flash"
            color={Colors.warning}
            size={28}
            style={styles.flash}
          />
          <Text style={[styles.toolText, styles.iconText]}>
            On
          </Text>
        </TouchableOpacity>
      )
    }
    else if (this.state.camera.flash === off) {
      flashIcon = (
        <TouchableOpacity
          style={[styles.toolTouchable, styles.flashTouchable]}
          onPress={this.switchFlash.bind(this)}
        >
          <IonIcon name="ios-flash-outline"
            color="#fff"
            size={28}
            style={styles.flash}
          />
          <Text style={[styles.toolText, styles.iconText]}>
            Off
          </Text>
        </TouchableOpacity>
      )
    }
    else if (this.state.camera.flash === auto) {
      flashIcon = (
        <TouchableOpacity
          style={[styles.toolTouchable, styles.flashTouchable]}
          onPress={this.switchFlash.bind(this)}
        >
          <IonIcon name="ios-flash-outline"
            color={Colors.warning}
            size={28}
            style={styles.flash}
          />
          <Text style={[styles.toolText, styles.iconText]}>
            Auto
          </Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          captureTarget={Camera.constants.CaptureTarget.disk}
          style={styles.preview}
          keepAwake={true}
          mirrorImage={false}
          type={this.state.camera.type}
          aspect={Camera.constants.Aspect.fill}
          captureQuality="high"
          flashMode={this.state.camera.flash}
          >
          <View style={styles.topToolsContainer}>
            {flashIcon}
          </View>
          <View style={styles.toolsContainer}>
            <TouchableOpacity style={styles.toolTouchable} onPress={this.cancel.bind(this)}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture.bind(this)}>
              <Icon name="camera" size={36} color={"#fff"}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolTouchable, {alignItems: 'flex-end', paddingRight: 15}]}
              onPress={this.switchType.bind(this)}>
              <IonIcon name="ios-reverse-camera-outline" size={32} color={"#fff"}/>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    )
  }

  switchFlash = () => {
    let newFlashMode
    const {auto, on, off} = Camera.constants.FlashMode

    if (this.state.camera.flash === auto) {
      newFlashMode = on
    } else if (this.state.camera.flash === on) {
      newFlashMode = off
    } else if (this.state.camera.flash === off) {
      newFlashMode = auto
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flash: newFlashMode
      },
    })
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

  switchType = () => {
    let newType
    const {back, front} = Camera.constants.Type

    if (this.state.camera.type === back) {
      newType = front
    } else if (this.state.camera.type === front) {
      newType = back
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    })
  }

  cancel = () => {
    this.props.navigator.pop()
  }
}

CameraScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

function getVerticalPadding() {
  if (Platform.OS == 'android')
    return 0;
  else
    return 15;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  preview: {
    flex          : 1,
    justifyContent: 'space-between',
    height        : undefined,
    width         : undefined
  },

  toolsContainer: {
    flex           : 0,
    flexDirection  : 'row',
    width          : undefined,
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
  },

  topToolsContainer: {
    flex             : 0,
    width            : undefined,
    height           : undefined,
    justifyContent   : 'center',
    alignItems       : 'flex-start',
    backgroundColor  : '#000',
    paddingTop: getVerticalPadding()
  },

  iconText: {
    flex          : 0,
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
    padding: 0,
    paddingLeft: 5,
    marginBottom: 5
  },

  flash: {
    marginRight: 0,
    paddingLeft: 30
  },

  flashTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5
  }
})
