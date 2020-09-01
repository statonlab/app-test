import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  Platform
} from 'react-native'
import Colors from '../helpers/Colors'
import PhotoView from 'react-native-photo-view-ex'
import {isIphoneX} from 'react-native-iphone-x-helper'

export default class ImageSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      position  : 0,
      height    : Dimensions.get('window').height,
      width     : Dimensions.get('window').width,
      scrolling : false,
      transform : [{rotateX: '0deg'}, {rotateY: '0deg'}],
      pages     : 0,
      imageWidth: Dimensions.get('window').width
    }
  }

  _onRef(ref) {
    this._ref = ref
    if (ref && this.state.position !== this.state.position) {
      this._move(this.state.position)
    }
  }

  _move(index) {
    const isUpdating = index !== this.state.position

    this._ref.scrollTo({x: this.state.width * index, y: 0, animated: true})

    this.setState({position: index})
    if (isUpdating && this.props.onPositionChanged) {
      this.props.onPositionChanged(index)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      this._move(this.props.position)
    }
  }

  componentDidMount() {
    const newWidth = Dimensions.get('window').width
    if (newWidth !== this.state.width) {
      this.setState({width: newWidth})
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  renderCaption(index) {
    let caption = this.props.captions[index]

    if (!caption) {
      return null
    }

    return (
      <View style={styles.captionBox}>
        <Text style={styles.captionText}>
          {caption || null}
        </Text>
      </View>
    )
  }

  _handleScroll(event) {
    let width = Dimensions.get('window').width
    let x     = event.nativeEvent.contentOffset.x

    if (Platform.OS === 'android') {
      x     = Math.round(x)
      width = Math.round(width)
    }

    if (x % width === 0) {
      this.setState({position: x / width})
    }
  }

  render() {
    const width  = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    if (this.props.images.length === 0) {
      return null
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column'}}>
        <ScrollView
          ref={ref => this._onRef(ref)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onScroll={this._handleScroll.bind(this)}
          scrollEventThrottle={16}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems    : 'center',
            marginTop     : 20
          }}
          style={{flex: 1}}
        >
          {this.props.images.map((image, index) => {
            const imageObject = typeof image === 'string' ? {uri: 'file://' + image.replace('file://', '')} : image
            if (this.props.enableZoom === true) {
              return (
                <View key={index}
                      style={{
                        flex: 1,
                        width
                      }}>
                  <PhotoView
                    source={imageObject}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    maximumZoomScale={3}
                    style={{
                      width,
                      height: height - (isIphoneX() ? 50 : 30),
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    resizeMode={'contain'}
                  />
                  {this.props.captions ? this.renderCaption(index) : null}
                </View>
              )
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={this.props.onPress}
                activeOpacity={.8}
                style={{flex: 1}}
              >
                <Image
                  source={imageObject}
                  style={{width: width - 120, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <View style={styles.buttons}>
          {this.props.images.map((image, index) => {
            return (
              <TouchableHighlight
                key={index}
                underlayColor="#ccc"
                onPress={() => {
                  return this._move(index)
                }}
                style={[styles.button, this.state.position === index ? styles.buttonSelected : {}]}>
                <View/>
              </TouchableHighlight>
            )
          })}
        </View>
      </View>
    )
  }
}

ImageSlider.propTypes = {
  onPress   : PropTypes.func,
  images    : PropTypes.array,
  captions  : PropTypes.array,
  enableZoom: PropTypes.bool
}

ImageSlider.defaultProps = {
  onPress   : null,
  images    : [],
  captions  : [],
  enableZoom: true
}

const styles = StyleSheet.create({
  container: {
    width        : Dimensions.get('window').width,
    flex         : 0,
    flexDirection: 'row'
  },

  buttons: {
    height        : 30,
    marginTop     : 0,
    flex          : 0,
    justifyContent: 'center',
    alignItems    : 'center',
    flexDirection : 'row',
    marginBottom  : isIphoneX() ? 20 : 0
  },

  button: {
    margin         : 3,
    width          : 8,
    height         : 8,
    borderRadius   : 8 / 2,
    backgroundColor: '#aaa',
    opacity        : 0.9
  },

  buttonSelected: {
    opacity        : 1,
    backgroundColor: Colors.primary
  },

  captionBox: {
    flex           : 0,
    position       : 'absolute',
    bottom         : 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    left           : 0,
    right          : 0
  },

  captionText: {
    color     : '#ffffff',
    textAlign : 'left',
    padding   : 15,
    fontWeight: '500',
    fontSize  : 16
  }
})
