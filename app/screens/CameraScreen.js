import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Animated,
  Alert,
  BackHandler
} from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import File from '../helpers/File'
import ImageZoom from 'react-native-image-pan-zoom'
import AndroidStatusBar from '../components/AndroidStatusBar'
import {isIphoneX, ifIphoneX} from 'react-native-iphone-x-helper'


const android = Platform.OS === 'android'

export default class CameraScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  /**
   * Construct the properties and state.
   *
   * @param props
   */
  constructor(props) {
    super(props)

    this.state = {
      camera       : {
        type : Camera.constants.Type.back,
        flash: Camera.constants.FlashMode.auto
      },
      selectedImage: '',
      images       : [],
      pageWidth    : 0,
      newImages    : [],
      focus        : new Animated.Value(0),
      focusLeft    : 0,
      focusRight   : 0,
      hasPermission: false,
      deletedImages: []
    }

    this.isCapturing = false

    this.fs = new File()
  }

  /**
   * Check for permissions
   */
  componentWillMount() {
    if (!android) {
      Camera.checkVideoAuthorizationStatus().then(response => {
        if (!response) {
          Alert.alert(
            'We need permission to access the camera.',
            'Please fix that from Settings -> TreeSnap -> Camera.',
            [
              {
                text: 'Ok', onPress: () => {
                this.navigator.goBack()
              }
              }
            ]
          )
        } else {
          this.setState({hasPermission: true})
        }
      })
    } else {
      this.setState({hasPermission: true})
    }

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this._cancel()
      return true
    })
  }

  /**
   * Fixes the width of each page
   */
  componentDidMount() {
    let length = this.params.images.length
    this.setState({
      pageWidth: Dimensions.get('window').width,
      images   : this.params.images
    })

    if (length > 0) {
      let selectedImage = this.fs.image(this.params.images[length - 1])

      this.setState({selectedImage})
    }
  }

  render() {
    let flashIcon
    const {auto, on, off} = Camera.constants.FlashMode
    let height            = Dimensions.get('window').height
    let width             = Dimensions.get('window').width

    if (this.state.camera.flash === on) {
      flashIcon = (
        <TouchableOpacity
          style={[styles.toolTouchable, styles.flashTouchable]}
          onPress={this.switchFlash.bind(this)}
        >
          <IonIcon name="ios-flash"
                   color={Colors.warning}
                   size={32}
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
                   size={32}
                   style={styles.flash}
          />
          <Text style={[styles.toolText, styles.iconText]}>
            Off
          </Text>
        </TouchableOpacity>
      )
    } else if (this.state.camera.flash === auto) {
      flashIcon = (
        <TouchableOpacity
          style={[styles.toolTouchable, styles.flashTouchable]}
          onPress={this.switchFlash.bind(this)}
        >
          <IonIcon name="ios-flash-outline"
                   color={Colors.warning}
                   size={32}
                   style={styles.flash}
          />
          <Text style={[styles.toolText, styles.iconText]}>
            Auto
          </Text>
        </TouchableOpacity>
      )
    }

    const statusBarHeight = AndroidStatusBar.get()

    return (
      <ScrollView
        ref="page"
        pagingEnabled={true}
        horizontal={true}
        onContentSizeChange={this._resetWidth}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={[styles.container, {width: this.state.pageWidth}]}>
          <View style={[styles.topToolsContainer, {width: this.state.pageWidth}]}>
            {flashIcon}
            <TouchableOpacity
              style={[styles.toolTouchable, {
                alignItems  : 'flex-end',
                paddingRight: 15
              }]}
              onPress={this.switchType}>
              <IonIcon name="ios-reverse-camera-outline"
                       size={42}
                       color={'#fff'}
                       style={textShadow}
              />
            </TouchableOpacity>
          </View>
          {this.state.hasPermission ?
            <Camera
              ref={cam => {
                this.camera = cam
              }}
              captureTarget={Camera.constants.CaptureTarget.disk}
              style={[styles.preview, {flex: 1}]}
              keepAwake={true}
              mirrorImage={false}
              type={this.state.camera.type}
              aspect={Camera.constants.Aspect.fill}
              captureQuality="high"
              captureAudio={false}
              captureMode={Camera.constants.CaptureMode.still}
              flashMode={this.state.camera.flash}
              onZoomChanged={this.zoom}
              defaultOnFocusComponent={true}
              orientation="auto"
              onFocusChanged={e => {
                let focusLeft = e.nativeEvent.touchPoint.x - 40
                let focusTop  = e.nativeEvent.touchPoint.y - 40
                this.setState({focusLeft, focusTop})
              }}/>
            : <View style={[styles.preview, {backgroundColor: '#000'}]}/>}
          <View style={[
            styles.toolsContainer,
            styles.bottomToolsContainer,
            {width: this.state.pageWidth, top: height - (isIphoneX() ? 130 : 110)}
          ]}>
            <TouchableOpacity style={[styles.toolTouchable, {paddingTop: 15}]} onPress={this._cancel}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
              {/*<Icon name="camera" size={36} color={'#fff'} style={textShadow}/>*/}
            </TouchableOpacity>
            {this.state.images.length > 0 ?
              this._getCameraSideThumbnail()
              :
              <View style={[styles.toolTouchable, {alignItems: 'flex-end'}]}>
                <View style={[styles.thumbnail, {backgroundColor: '#222'}]}/>
              </View>
            }
          </View>
        </View>

        <View style={[styles.container, {
          width          : this.state.pageWidth,
          backgroundColor: '#000'
        }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={this._delete}>
              <IonIcon name="md-trash"
                       style={[styles.headerText, {width: 20, marginTop: 2}]}
                       size={20}/>
              <Text style={styles.headerText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={this._done}>
              <IonIcon name="md-checkmark"
                       style={[styles.headerText, {width: 20, marginTop: 2}]}
                       size={20}/>
              <Text style={styles.headerText}>Done</Text>
            </TouchableOpacity>
          </View>
          {this.state.selectedImage === '' ?
            <View style={{flex: 1, backgroundColor: '#000'}}/> :
            <ImageZoom
              cropHeight={height - (isIphoneX() ? (174 + statusBarHeight) : (144 + statusBarHeight))}
              cropWidth={width}
              imageHeight={height - (134 + statusBarHeight)}
              imageWidth={width}>
              <Image source={{uri: this.state.selectedImage}}
                     style={[styles.preview, {resizeMode: 'contain'}]}/>
            </ImageZoom>
          }
          <View
            style={[styles.toolsContainer, styles.thumbnailsContainer]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.images.map(this.renderThumbnail)}
              <TouchableOpacity style={styles.addIcon} onPress={this._back}>
                <IonIcon name="md-add" size={30} color="#666"/>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    )
  }

  _getCameraSideThumbnail() {
    let image = this.fs.image(this.state.images[this.state.images.length - 1])
    return (
      <TouchableOpacity
        style={[styles.toolTouchable, {alignItems: 'flex-end'}]}
        onPress={this._forward}>
        <Image
          source={{uri: image}}
          style={styles.thumbnail}/>
      </TouchableOpacity>
    )
  }

  /**
   * Renders the thumbnail for each image.
   *
   * @param image object holding the index and the path of the image.
   * @param index integer identifying the thumbnail
   * @returns {XML}
   */
  renderThumbnail = (image, index) => {
    image = this.fs.image(image)
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.setState({selectedImage: image})}>
        <Image source={{uri: image}} style={styles.thumbnail}/>
      </TouchableOpacity>
    )
  }

  /**
   * Fixes the width of the page in case of device orientation changes.
   *
   * @private
   */
  _resetWidth = () => {
    this.setState({
      pageWidth: Dimensions.get('window').width
    })
  }

  /**
   * Goes back to the first page (camera).
   *
   * @private
   */
  _back = () => {
    this.refs.page.scrollTo({x: 0, y: 0, animated: true})
    this.isCapturing = false
  }

  /**
   * Scroll to the page forward.
   *
   * @private
   */
  _forward = () => {
    this.refs.page.scrollTo({x: Dimensions.get('window').width, y: 0, animated: true})
  }

  /**
   * Deletes an image from the array.
   *
   * @private
   */
  _delete = () => {
    let images        = []
    let imageToDelete = this.state.selectedImage
    this.state.images.map(image => {
      if (image !== imageToDelete) {
        images.push(image)
      }
    })

    let newImages = []
    this.state.newImages.map(image => {
      if (image !== imageToDelete) {
        newImages.push(image)
      }
    })


    if (images.length === 0) {
      this.setState({
        selectedImage: '',
        images       : [],
        newImages    : []
      })
      this._back()
    } else {
      let selectedImage = this.fs.image(images[0])

      this.setState({
        selectedImage,
        images,
        newImages
      })
    }

    this.setState({deletedImages: this.state.deletedImages.concat(imageToDelete)})
  }

  /**
   * Sends the list of images to the previous scene.
   *
   * @private
   */
  _done = () => {
    if (this.state.deletedImages.length > 0) {
      this.params.onDelete(this.state.deletedImages)
    }

    this.params.onDone(this.state.images, this.params.id)
    this.params.navigator.goBack(null)
  }

  /**
   *TODO: UNDER DEVELOPMENT
   * @param e
   */
  zoom = (e) => {
    console.log(e)
  }

  /**
   * Switches the flash between auto, on and off in that order.
   */
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
      }
    })
  }

  /**
   * Captures the image.
   */
  takePicture = () => {
    // Do not allow multiple capture calls before processing
    if (this.isCapturing) {
      return
    }

    this.isCapturing = true

    this.camera.capture({
      jpegQuality: 100
    }).then(data => {
      let image  = data.path
      let images = this.state.images.concat(image)
      this.setState({
        selectedImage: image,
        images       : images,
        newImages    : this.state.newImages.concat(image)
      })
      this._forward()
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Switches the type of camera between back and front.
   */
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
        type: newType
      }
    })
  }

  /**
   * Cancels the camera submissions and goes back.
   *
   * @private
   */
  _cancel = () => {
    this.fs.delete({images: this.state.newImages}, () => {
      this.navigator.goBack()
    })
  }
}

/**
 * Component Properties
 *
 * @type {{navigator: *}}
 */
CameraScreen.PropTypes = {
  // onDelete : PropTypes.func.isRequired,
  // onDone   : PropTypes.func.isRequired,
  // images   : PropTypes.array,
  // id       : PropTypes.string
}

CameraScreen.defaultProps = {
  // images: [],
  // id    : 'images'
}

/**
 * Gets the padding of the navbar depending on the platform (android vs ios).
 *
 * @returns {number}
 */
function getVerticalPadding() {
  if (Platform.OS === 'android') {
    return 0
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 15
  }
}

const textShadow = {
  textShadowColor : 'rgba(0,0,0,.6)',
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 2
}

/**
 * Create the scene's stylesheet.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    flex           : 0,
    justifyContent : 'space-between',
    flexDirection  : 'row',
    ...(new Elevation(4))
  },

  headerButton: {
    paddingHorizontal: 10,
    paddingVertical  : 15,
    flexDirection    : 'row'
  },

  headerText: {
    color     : '#fff',
    fontWeight: '500',
    fontSize  : 16
  },

  preview: {
    flex          : 1,
    justifyContent: 'space-between',
    height        : undefined,
    width         : undefined
  },

  toolsContainer: {
    flex             : 0,
    flexDirection    : 'row',
    height           : 80,
    justifyContent   : 'space-between',
    alignItems       : 'center',
    backgroundColor  : 'transparent',
    paddingHorizontal: 10
  },

  capture: {
    flex           : 0,
    width          : 70,
    height         : 70,
    borderRadius   : 70 / 2,
    alignItems     : 'center',
    backgroundColor: 'rgba(255, 255, 255, .2)',
    borderWidth    : 6,
    borderColor    : '#fff',
    marginTop      : 5,
    ...(new Elevation(1))
  },

  toolText: {
    color  : '#fff',
    flex   : 0,
    padding: 5,
    width  : 90,
    fontSize: 16,
    fontWeight: '600',
    ...textShadow
  },

  toolTouchable: {
    flex           : 0,
    width          : 90,
    height         : undefined,
    backgroundColor: 'transparent'
  },

  topToolsContainer: {
    flex          : 0,
    height        : undefined,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    paddingTop    : getVerticalPadding(),
    position      : 'absolute',
    zIndex        : 10,
    top           : 10
  },

  bottomToolsContainer: {
    width   : undefined,
    height  : 90,
    position: 'absolute'
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
    backgroundColor  : '#ddd',
    height           : 80,
    paddingHorizontal: 5,
    ...(new Elevation(4)),
    shadowOffset     : {
      height: -3
    },
    shadowColor      : '#888',
    ...ifIphoneX({
      height       : 110,
      paddingBottom: 30
    })
  },

  thumbnail: {
    width           : 70,
    height          : 70,
    marginHorizontal: 5,
    borderRadius    : 3,
    alignItems      : 'center',
    justifyContent  : 'center'
  },

  addIcon: {
    width           : 70,
    height          : 70,
    backgroundColor : '#ccc',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginHorizontal: 5,
    borderRadius    : 3
  },

  focusBox: {
    width          : 80,
    height         : 80,
    borderWidth    : 1,
    borderRadius   : 2,
    backgroundColor: 'transparent',
    borderColor    : Colors.warning,
    borderStyle    : 'solid',
    position       : 'absolute',
    top            : 0,
    left           : 0,
    zIndex         : 1
  }
})