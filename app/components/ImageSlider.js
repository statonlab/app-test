/**
 * Modified copy of https://github.com/PaulBGD/react-native-image-slider
 */
import React, {Component, PropTypes} from 'react'
import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'


const styles = StyleSheet.create({
  container     : {
    width        : Dimensions.get('window').width,
    flex         : 0,
    flexDirection: 'row',
  },
  buttons       : {
    height        : 100,
    marginTop     : 0,
    flex          : 0,
    justifyContent: 'center',
    alignItems    : 'center',
    flexDirection : 'row'
  },
  button        : {
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
    height: 50,
    width : Dimensions.get('window').width,
    zIndex: 999999,
    backgroundColor: Colors.primary,
    height : 200
  },

  captionText: {
    flex       : 1,
    color      : Colors.primaryText,
    textAlign  : 'left',
    paddingHorizontal: 15,
    fontWeight : '500',
    fontSize   : 16
  },
})

export default class ImageSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      position : 0,
      height   : Dimensions.get('window').height,
      width    : Dimensions.get('window').width,
      scrolling: false
    }
  }

  _onRef(ref) {
    this._ref = ref
    if (ref && this.state.position !== this._getPosition()) {
      this._move(this._getPosition())
    }
  }

  _move(index) {
    const isUpdating = index !== this._getPosition()

    this._ref.scrollTo({x: this.state.width * index, y: 0, animated: true})

    this.setState({position: index})
    if (isUpdating && this.props.onPositionChanged) {
      this.props.onPositionChanged(index)
    }
  }

  _getPosition() {
    if (typeof this.props.position === 'number') {
      return this.props.position
    }
    return this.state.position
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      this._move(this.props.position)
    }
  }

  componentWillMount() {
    let release = (e, gestureState) => {
      const width            = this.state.width
      const relativeDistance = gestureState.dx / width
      const vx               = gestureState.vx
      let change             = 0

      if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
        change = 1
      } else if (relativeDistance > 0.5 || (relativeDistance > 0 && vx >= 0.5)) {
        change = -1
      }
      const position = this._getPosition()
      if (position === 0 && change === -1) {
        change = 0
      } else if (position + change >= this.props.images.length) {
        change = (this.props.images.length) - (position + change)
      }
      this._move(position + change)
      return true
    }

    this._panResponder = PanResponder.create({
      onPanResponderRelease: release
    })

    this._interval = setInterval(() => {
      const newWidth = Dimensions.get('window').width
      if (newWidth !== this.state.width) {
        this.setState({width: newWidth})
      }
    }, 16)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  renderCaption(index){
    let caption = this.props.captions[index]
    console.log("lets write this caption", caption)
      return(
        <View style={styles.captionBox}>
        <Text style={styles.captionText}>
          {caption}
        </Text>
        </View>
      )
  }



  render() {
    const width    = this.state.width
    const height   = this.props.height || this.state.height
    const position = this._getPosition()
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column'}}>

        <ScrollView
          ref={ref => this._onRef(ref)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          {...this._panResponder.panHandlers}
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        >
          {this.props.images.map((image, index) => {
            const imageObject = typeof image === 'string' ? {uri: image} : image
            if (this.props.onPress) {
              return (

                <TouchableOpacity key={index} style={{flex: 1}} onPress={this.props.onPress} activeOpacity={.9}>
                  <Image
                    source={imageObject}
                    style={{width, resizeMode: 'contain'}}
                  />
                  {this.props.captions ?
                    this.renderCaption(index)
                    : null   }
                </TouchableOpacity>
              )
            }
            return (
              <Image
                key={index}
                source={imageObject}
                style={{width, maxHeight: 300, resizeMode: 'contain'}}
              />
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
              style={[styles.button, position === index && styles.buttonSelected]}>
              <View>
              </View>
            </TouchableHighlight>)
          })}
        </View>
      </View>
    )
  }
}

ImageSlider.PropTypes = {
  onPress: PropTypes.func,
  images: PropTypes.array,
  captions: PropTypes.array

}