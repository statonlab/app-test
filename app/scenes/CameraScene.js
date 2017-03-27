import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

let imageIndex = 0

export default class CameraScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      camera       : {
        type : Camera.constants.Type.back,
        flash: Camera.constants.FlashMode.auto
      },
      selectedImage: {
        path: ''
      },
      images       : [],
      pageWidth    : 0
    }
  }

  componentDidMount() {
    this.setState({
      pageWidth: Dimensions.get('window').width
    })
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
      <ScrollView
        ref="page"
        pagingEnabled={true}
        horizontal={true}
        directionalLockEnabled={false}
        onContentSizeChange={this._resetWidth}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={[styles.container, {width: this.state.pageWidth}]}>
          <View style={styles.topToolsContainer}>
            {flashIcon}
          </View>
          <Camera
            ref={cam => {this.camera = cam}}
            captureTarget={Camera.constants.CaptureTarget.disk}
            style={[styles.preview, {flex: 1}]}
            keepAwake={true}
            mirrorImage={false}
            type={this.state.camera.type}
            aspect={Camera.constants.Aspect.fill}
            captureQuality="high"
            flashMode={this.state.camera.flash}
            onZoomChanged={this.zoom}
            defaultOnFocusComponent={true}
          >
          </Camera>
          <View style={styles.toolsContainer}>
            <TouchableOpacity style={styles.toolTouchable} onPress={this.cancel}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
              <Icon name="camera" size={36} color={"#fff"}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolTouchable, {alignItems: 'flex-end', paddingRight: 15}]}
              onPress={this.switchType}>
              <IonIcon name="ios-reverse-camera-outline" size={32} color={"#fff"}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container, {width: this.state.pageWidth, backgroundColor: '#000'}]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={this._back}>
              <IonIcon name="ios-arrow-back" style={[styles.headerText, {width: 15, marginTop: 2}]} size={20}/>
              <Text style={styles.headerText}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <IonIcon name="md-checkmark" style={[styles.headerText, {width: 20, marginTop: 2}]} size={20}/>
              <Text style={styles.headerText}>Done</Text>
            </TouchableOpacity>
          </View>
          {this.state.selectedImage.path === '' ? null :
            <Image source={{uri: this.state.selectedImage.path }} style={styles.preview}/>
          }
          <View style={[styles.toolsContainer, styles.thumbnailsContainer]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.images.map(this.renderThumbnail)}
              <TouchableOpacity style={styles.addIcon} onPress={this._back}>
                <IonIcon name="md-add" size={30} color="#777"/>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    )
  }

  renderThumbnail = (image, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.setState({selectedImage: image})}
        style={{position: 'relative'}}
      >
        <IonIcon name="md-close-circle" style={styles.removeIcon} size={15}/>
        <Image source={{uri: image.path}} style={styles.thumbnail}/>
      </TouchableOpacity>
    )
  }

  _resetWidth = () => {
    this.setState({
      pageWidth: Dimensions.get('window').width
    })
  }

  _back = () => {
    this.refs.page.scrollTo({x: 0, y: 0, animated: true})
  }

  zoom = (e) => {
    console.log(e)
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
          let image  = {
            path : data.path,
            index: imageIndex++
          }
          let images = this.state.images.concat(image)
          this.setState({selectedImage: image, images})
          this.refs.page.scrollToEnd()
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
    flex : 1,
    width: undefined
  },

  header: {
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    flex           : 0,
    justifyContent : 'space-between',
    flexDirection  : 'row',
    zIndex: 5,
    ...(new Elevation(4))
  },

  headerButton: {
    padding      : 10,
    flexDirection: 'row'
  },

  headerText: {
    color     : '#fff',
    fontWeight: '500',
    fontSize  : 16
  },

  addIcon: {
    width           : 50,
    height          : 50,
    backgroundColor : '#ccc',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginHorizontal: 5
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
    height         : 60,
    justifyContent : 'space-between',
    alignItems     : 'center',
    backgroundColor: '#000'
  },

  toolsMini: {
    height: 40
  },

  capture: {
    flex      : 1,
    width     : undefined,
    height    : undefined,
    alignItems: 'center',
    marginTop: 5
  },

  toolText: {
    color  : '#fff',
    flex   : 0,
    padding: 15,
    width  : 90
  },

  removeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    color: '#fff',
    zIndex: 5,
    borderRadius: 5
  },

  toolTouchable: {
    flex  : 0,
    width : 90,
    height: undefined
  },

  topToolsContainer: {
    flex           : 0,
    width          : undefined,
    height         : undefined,
    justifyContent : 'center',
    alignItems     : 'flex-start',
    backgroundColor: '#000',
    paddingTop     : getVerticalPadding()
  },

  iconText: {
    flex          : 0,
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
    padding       : 0,
    paddingLeft   : 5,
    marginBottom  : 5
  },

  flash: {
    marginRight: 0,
    paddingLeft: 30
  },

  flashTouchable: {
    flexDirection    : 'row',
    alignItems       : 'center',
    justifyContent   : 'center',
    paddingHorizontal: 15,
    paddingVertical  : 5
  },

  thumbnailsContainer: {
    backgroundColor: "#ddd"
  },

  thumbnail: {
    width           : 50,
    height          : 50,
    marginHorizontal: 5
  }
})
