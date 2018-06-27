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
  BackHandler,
  PermissionsAndroid
} from 'react-native'
import {RNCamera} from 'react-native-camera'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import File from '../helpers/File'
import PhotoView from 'react-native-photo-view'
import AndroidStatusBar from '../components/AndroidStatusBar'
import PinchResponder from '../helpers/PinchResponder'
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
        type : RNCamera.Constants.Type.back,
        flash: RNCamera.Constants.FlashMode.auto
      },
      selectedImage: '',
      selectedIndex: 0,
      images       : [],
      pageWidth    : 0,
      pageHeight   : 0,
      newImages    : [],
      focus        : new Animated.Value(0),
      focusLeft    : 0,
      focusRight   : 0,
      hasPermission: false,
      deletedImages: [],
      zoom         : 0,
      activeScale  : 1
    }

    this.isCapturing = false

    this.fs             = new File()
    this.pinchResponder = new PinchResponder(this.zoom.bind(this))
  }

  async requestCameraPermission() {
    if (android) {
      try {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title  : 'Camera Permission',
            message: 'We need permission to access the camera'
          })

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title  : 'Storage Permission',
            message: 'We need permission to write to your storage file system'
          })

        // Android 4.4 returns true while all other devices return `PermissionsAndroid.RESULTS.GRANTED`
        let granted = cameraPermission === PermissionsAndroid.RESULTS.GRANTED
        granted     = granted && storagePermission === PermissionsAndroid.RESULTS.GRANTED
        granted     = granted || (cameraPermission === true && storagePermission === true)
        if (granted) {
          this.setState({hasPermission: true})
        } else {
          this.alertPermissionDenied()
          this._cancel()
        }
      } catch (err) {
        alert(err)
      }
    } else {
      this.setState({hasPermission: true})
    }
  }

  alertPermissionDenied() {
    Alert.alert(
      'We need permission to access the camera.',
      'Please fix that from Settings -> TreeSnap -> Camera.',
      [
        {
          text: 'Ok', onPress: () => {
            this.navigator.goBack(null)
          }
        }
      ]
    )
  }

  /**
   * Check for permissions
   * and fix the width of each page
   */
  componentDidMount() {
    this.requestCameraPermission()

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this._cancel()
      return true
    })

    let length = this.params.images.length
    this.setState({
      pageWidth : Dimensions.get('window').width,
      pageHeight: Dimensions.get('window').height,
      images    : this.params.images
    })

    if (length > 0) {
      let selectedIndex = this.params.images[length - 1]
      let selectedImage = this.fs.image(selectedIndex)

      this.setState({selectedImage, selectedIndex})
    }

    this.analytics.visitScreen('CameraScreen')
  }


  render() {
    let flashIcon
    const {auto, on, off} = RNCamera.Constants.FlashMode
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
          {this.state.hasPermission ?
            <RNCamera
              ref={cam => {
                this.camera = cam
              }}
              style={[{elevation: 0, zIndex: 0, flex: 1}]}
              flashMode={this.state.camera.flash}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              captureAudio={false}
              type={this.state.camera.type}
              zoom={this.state.zoom}
            />
            :
            <View style={[styles.preview, {backgroundColor: '#000'}]}/>
          }
          <View style={styles.responder}
                {...this.pinchResponder.getResponderProps()}/>
          <View style={[styles.topToolsContainer, {width: this.state.pageWidth, zIndex: 1000}]}>
            {flashIcon}
            <TouchableOpacity
              style={[styles.toolTouchable, {
                alignItems : 'flex-end',
                marginRight: 15
              }]}
              onPress={this.switchType}>
              <IonIcon name="ios-reverse-camera-outline"
                       size={42}
                       color={'#fff'}
                       style={textShadow}
              />
            </TouchableOpacity>
          </View>
          <View style={[
            styles.toolsContainer,
            styles.bottomToolsContainer,
            {width: this.state.pageWidth, bottom: isIphoneX() ? 20 : 10}
          ]}>
            <TouchableOpacity style={[styles.toolTouchable, {paddingTop: 15}]} onPress={this._cancel}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture.bind(this)}/>
            {this.state.images.length > 0 ?
              this._getCameraSideThumbnail()
              :
              <View style={[styles.toolTouchable, {alignItems: 'flex-end'}]}>
                <View style={[styles.thumbnail, styles.cameraThumbnail, {backgroundColor: '#222'}]}/>
              </View>
            }
          </View>
        </View>

        {/* Gallery View */}
        <View style={[styles.container, {
          width          : this.state.pageWidth,
          height         : this.state.pageHeight - (android ? statusBarHeight : 0),
          backgroundColor: '#fff'
        }]}>
          <View style={{flex: 1}}>
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
            <View style={{flex: 1}}>
              {this.state.images.length === 0 ?
                <View style={{flex: 1}}/>
                :
                <ScrollView
                  ref={ref => this.imagesScrollView = ref}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled={true}
                  scrollEnabled={this.state.activeScale < 1.2}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  onScroll={({nativeEvent}) => {
                    const x = nativeEvent.contentOffset.x
                    if (x % this.state.pageWidth === 0) {
                      let selectedIndex = x / this.state.pageWidth
                      let selectedImage = this.state.images[selectedIndex]
                      this.setState({selectedIndex, selectedImage})
                    }
                  }}>
                  {this.state.images.map(this._renderPagedImages.bind(this))}
                </ScrollView>
              }
            </View>
            <View style={[styles.thumbnailsContainer]}>
              <ScrollView horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}>
                {this.state.images.map(this.renderThumbnail)}
                <TouchableOpacity style={[styles.addIcon]} onPress={this._back}>
                  <IonIcon name="md-add" size={30} color="#666"/>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  _renderPagedImages(image, key) {
    image = this.fs.image(image)
    return (
      <View key={key}
            style={{
              width          : this.state.pageWidth,
              justifyContent : 'center',
              alignItems     : 'center',
              backgroundColor: '#fff'
            }}>
        <PhotoView source={{uri: image}}
                   minimumZoomScale={1}
                   maximumZoomScale={3}
                   showsHorizontalScrollIndicator={false}
                   showsVerticalScrollIndicator={false}
                   onScale={({nativeEvent}) => {
                     this.setState({activeScale: nativeEvent.scale})
                   }}
                   style={[{
                     flex           : 1,
                     width          : this.state.pageWidth,
                     height         : undefined,
                     justifyContent : 'center',
                     alignItems     : 'center',
                     backgroundColor: '#fff'
                   }]}/>
      </View>
    )
  }

  _getCameraSideThumbnail() {
    let image = this.fs.image(this.state.images[this.state.images.length - 1])
    return (
      <TouchableOpacity
        style={[styles.toolTouchable, styles.cameraThumbnail, {alignItems: 'flex-end'}]}
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
   * @returns {{XML}}
   */
  renderThumbnail = (image, index) => {
    image = this.fs.image(image)
    return (
      <TouchableOpacity
        key={index}
        style={{position: 'relative'}}
        onPress={() => {
          this.setState({
            selectedImage: image,
            selectedIndex: index
          })
          this.imagesScrollView.scrollTo({
            x       : this.state.pageWidth * index,
            y       : 0,
            animated: false
          })
        }}>
        {this.state.selectedIndex === index ?
          <IonIcon size={18} name={'ios-checkmark-circle'} color={Colors.primary} style={{
            position : 'absolute',
            top      : 5,
            right    : 5,
            elevation: 1,
            zIndex   : 100
          }}/>
          : null}
        <Image source={{uri: image}} style={[styles.thumbnail, {
          opacity: this.state.selectedIndex === index ? .7 : 1
        }]}/>
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
    if (this.imagesScrollView) {
      setTimeout(() => {
        this.imagesScrollView.scrollToEnd({animated: false})
      }, 50)
    }
  }

  /**
   * Deletes an image from the array.
   *
   * @private
   */
  _delete = () => {
    let selectedIndex = this.state.selectedIndex
    let imageToDelete = this.state.images[selectedIndex]

    // Remove the selected image from the state
    let images    = this.state.images.filter((image, i) => {
      return i !== selectedIndex
    })
    let newImages = this.state.newImages.filter(image => {
      return image !== imageToDelete
    })


    if (images.length === 0) {
      this.setState({
        selectedImage: '',
        selectedIndex: 0,
        images       : [],
        newImages    : []
      })

      this._back()
    } else {
      let newSelectedIndex = 0

      // Determine which image to select next
      if (selectedIndex === 0) {
        // The first image was selected so the next index is still 0
        newSelectedIndex = 0
      } else if (selectedIndex === this.state.images.length - 1) {
        // Last image was selected so select the one was before it
        newSelectedIndex = images.length - 1
      } else {
        // An image in the middle was selected, so select the one before it
        newSelectedIndex = selectedIndex - 1
      }

      let selectedImage = this.fs.image(images[newSelectedIndex])

      this.setState({
        selectedIndex: newSelectedIndex,
        selectedImage,
        images,
        newImages
      })

      // Move to the newly selected image
      this.imagesScrollView.scrollTo({
        x       : this.state.pageWidth * newSelectedIndex,
        y       : 0,
        animated: false
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
   * Switches the flash between auto, on and off in that order.
   */
  switchFlash = () => {
    let newFlashMode
    const {auto, on, off} = RNCamera.Constants.FlashMode

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

  zoom(value) {
    let zoom = Math.round(value * 100) / 100
    zoom     = Math.max(zoom, 0)
    zoom     = Math.min(zoom, 1)
    this.setState({zoom})
  }

  /**
   * Captures the image.
   */
  async takePicture() {
    // Do not allow multiple capture calls before processing
    if (this.isCapturing) {
      return
    }

    this.isCapturing = true

    try {
      const data = await this.camera.takePictureAsync({
        quality           : .8,
        // Specify a max width to avoid extra large images
        width             : 1000,
        // Want an actual file rather than an base64 string
        base64            : false,
        mirrorImage       : false,
        // We don't want metadata, let the camera module handle orientations
        exif              : false,
        fixOrientation    : true,
        forceUpOrientation: true
      })

      let image  = data.uri
      let images = this.state.images.concat(image)
      this.setState({
        selectedImage: image,
        selectedIndex: images.length - 1,
        images       : images,
        newImages    : this.state.newImages.concat(image)
      })

      this._forward()
      this.isCapturing = false
    } catch (error) {
      this.isCapturing = false
      alert(error)
    }
  }

  /**
   * Switches the type of camera between back and front.
   */
  switchType = () => {
    let newType
    const {back, front} = RNCamera.Constants.Type

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
      this.navigator.goBack(null)
    })
  }
}

/**
 * Component Properties
 *
 * @type {{navigator: *}}
 */
CameraScreen.propTypes = {
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
    return 5
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 20
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
  responder: {
    zIndex   : 900,
    elevation: 1,
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0
  },

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
    paddingHorizontal: 10,
    zIndex           : 10000
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
    color     : '#fff',
    flex      : 0,
    padding   : 5,
    width     : 90,
    fontSize  : 16,
    fontWeight: '600',
    ...textShadow
  },

  toolTouchable: {
    flex           : 0,
    width          : 90,
    height         : undefined,
    backgroundColor: 'transparent',
    elevation      : 5,
    zIndex         : 10000
  },

  topToolsContainer: {
    flex           : 0,
    height         : undefined,
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
    paddingTop     : getVerticalPadding(),
    backgroundColor: 'transparent',
    position       : 'absolute',
    top            : 0,
    left           : 0,
    right          : 0
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
    backgroundColor: '#f7f7f7',
    shadowColor    : '#888',
    borderTopWidth : 1,
    borderTopColor : '#eee',
    padding        : 5,
    paddingLeft    : 0,
    ...ifIphoneX({
      paddingBottom: 30
    })
  },

  thumbnail: {
    width         : 50,
    height        : 50,
    borderRadius  : 4,
    alignItems    : 'center',
    justifyContent: 'center',
    marginLeft    : 5
  },

  cameraThumbnail: {
    width           : 70,
    height          : 70,
    marginHorizontal: 5
  },

  addIcon: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
    alignItems     : 'center',
    justifyContent : 'center',
    marginLeft     : 5,
    borderRadius   : 4,
    width          : 50,
    height         : 50
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
