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
import File from '../helpers/File'

export default class CameraScene extends Component {
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
      pageWidth    : 0
    }

    this.isCapturing = false

    this.fs = new File()
  }

  /**
   * Fixes the width of each page
   */
  componentDidMount() {
    let length = this.props.images.length
    this.setState({
      pageWidth: Dimensions.get('window').width,
      images   : this.props.images
    })

    if (length > 0) {
      this.setState({selectedImage: this.props.images[length - 1]})
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
    } else if (this.state.camera.flash === auto) {
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
        onContentSizeChange={this._resetWidth}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={[styles.container, {width: this.state.pageWidth}]}>
          <View style={styles.topToolsContainer}>
            {flashIcon}
            <TouchableOpacity
              style={[styles.toolTouchable, {alignItems: 'flex-end', paddingRight: 15}]}
              onPress={this.switchType}>
              <IonIcon name="ios-reverse-camera-outline" size={32} color={'#fff'}/>
            </TouchableOpacity>
          </View>
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
            flashMode={this.state.camera.flash}
            onZoomChanged={this.zoom}
            defaultOnFocusComponent={true}
            onFocusChanged={(e) => {
              return
            }}
            orientation="portrait"/>
          <View style={styles.toolsContainer}>
            <TouchableOpacity style={[styles.toolTouchable]} onPress={this._cancel}>
              <Text style={[styles.toolText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
              <Icon name="camera" size={36} color={'#fff'}/>
            </TouchableOpacity>
            {this.state.images.length > 0 ?
              <TouchableOpacity
                style={[styles.toolTouchable, {alignItems: 'flex-end'}]}
                onPress={this._forward}>
                <Image source={{uri: this.state.images[this.state.images.length - 1]}} style={styles.thumbnail}/>
              </TouchableOpacity>
              :
              <View style={[styles.toolTouchable, {alignItems: 'flex-end'}]}>
                <View style={[styles.thumbnail, {backgroundColor: '#222'}]}></View>
              </View>
            }
          </View>
        </View>

        <View style={[styles.container, {width: this.state.pageWidth, backgroundColor: '#000'}]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={this._delete}>
              <IonIcon name="md-trash" style={[styles.headerText, {width: 20, marginTop: 2}]} size={20}/>
              <Text style={styles.headerText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={this._done}>
              <IonIcon name="md-checkmark" style={[styles.headerText, {width: 20, marginTop: 2}]} size={20}/>
              <Text style={styles.headerText}>Done</Text>
            </TouchableOpacity>
          </View>
          {this.state.selectedImage === '' ?
            <View style={{flex: 1, backgroundColor: '#000'}}></View> :
            <Image source={{uri: this.state.selectedImage}} style={[styles.preview, {resizeMode: 'contain'}]}/>
          }
          <View style={[styles.toolsContainer, styles.thumbnailsContainer]}>
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

  /**
   * Renders the thumbnail for each image.
   *
   * @param image object holding the index and the path of the image.
   * @param index integer identifying the thumbnail
   * @returns {JSX}
   */
  renderThumbnail = (image, index) => {
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
    let images   = []
    let imageToDelete = this.state.selectedImage
    this.state.images.map((image) => {
      if (image !== this.state.selectedImage) {
        images.push(image)
      }
    })


    if (images.length === 0) {
      this.setState({
        selectedImage: '',
        images       : []
      })
      this._back()
    } else {
      this.setState({
        selectedImage: images[0],
        images
      })
    }

    this.fs.delete(imageToDelete)
  }

  /**
   * Sends the list of images to the previous scene.
   *
   * @private
   */
  _done = () => {
    this.props.onDone(this.state.images, this.props.id)
    this.props.navigator.pop()
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
      jpegQuality: 80
    }).then(data => {
      let image  = data.path
      let images = this.state.images.concat(image)
      this.setState({selectedImage: image, images})
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
    this.props.navigator.pop()
  }
}

/**
 * Component Properties
 *
 * @type {{navigator: *}}
 */
CameraScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  onDone   : PropTypes.func.isRequired,
  images   : PropTypes.array,
  id       : PropTypes.string
}

CameraScene.defaultProps = {
  images: [],
  id    : 'images'
}

/**
 * Gets the padding of the navbar depending on the platform (android vs ios).
 *
 * @returns {number}
 */
function getVerticalPadding() {
  if (Platform.OS === 'android')
    return 0
  else
    return 15
}

/**
 * Create the scene's stylesheet.
 */
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
    width            : undefined,
    height           : 80,
    justifyContent   : 'space-between',
    alignItems       : 'center',
    backgroundColor  : '#000',
    paddingHorizontal: 10
  },

  capture: {
    flex      : 1,
    width     : undefined,
    height    : undefined,
    alignItems: 'center',
    marginTop : 5
  },

  toolText: {
    color  : '#fff',
    flex   : 0,
    padding: 5,
    width  : 90
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
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
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
    backgroundColor  : '#ddd',
    height           : 70,
    paddingHorizontal: 5,
    ...(new Elevation(4)),
    shadowOffset     : {
      height: -3
    },
    shadowColor      : '#888'
  },

  thumbnail: {
    width           : 50,
    height          : 50,
    marginHorizontal: 5,
    borderRadius    : 3
  },

  addIcon: {
    width           : 50,
    height          : 50,
    backgroundColor : '#ccc',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginHorizontal: 5,
    borderRadius    : 3
  }
})
