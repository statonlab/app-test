import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native'
import ImageSlider from './ImageSlider'
import Icon from 'react-native-vector-icons/Ionicons'
import {isIphoneX} from 'react-native-iphone-x-helper'

export default class ImageModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  _toggle() {
    this.setState({show: !this.state.show})
  }

  _handleScroll(event) {
    let y = event.nativeEvent.contentOffset.y
    if (y < -100) {
      this.setState({show: false})
    }
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Modal
          transparent={true}
          visible={this.state.show}
          onRequestClose={() => this.setState({show: false})}
          animationType="slide"
        >
          <ScrollView
            contentContainerStyle={{flex: 1, backgroundColor: '#000'}}
            onScroll={this._handleScroll.bind(this)}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            overScrollMode={'always'}
          >
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={styles.overlay}/>
              <TouchableOpacity
                activeOpacity={.9}
                style={[styles.circle, {marginTop: isIphoneX() ? 10 : 3}]}
                onPress={this._toggle.bind(this)}>
                <Icon name="md-close" size={24} color="#444" style={{marginTop: 3}}/>
              </TouchableOpacity>
              <ImageSlider style={styles.container}
                           images={this.props.images}
                           captions={this.props.captions}
                           onPress={this._toggle.bind(this)}/>
            </View>
          </ScrollView>
        </Modal>
        <TouchableOpacity onPress={this._toggle.bind(this)} style={this.props.style}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

ImageModal.propTypes = {
  ...TouchableOpacity.propTypes,
  images        : PropTypes.array,
  containerStyle: PropTypes.object,
  captions      : PropTypes.array
}

ImageModal.defaultProps = {
  containerStyle: new StyleSheet.create({})
}

const styles = StyleSheet.create({
  overlay: {
    position       : 'absolute',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    backgroundColor: 'rgba(0,0,0,1)'
  },

  container: {
    flex          : 1,
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'center'
  },

  circle: {
    position       : 'absolute',
    top            : Platform.OS === 'android' ? 5 : 25,
    right          : 5,
    width          : 40,
    height         : 40,
    borderRadius   : 40 / 2,
    zIndex         : 9999,
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: 'rgba(255,255,255,1)'
  },

  image: {
    flex      : 1,
    resizeMode: 'contain',
    width     : Dimensions.get('window').width
  }
})
