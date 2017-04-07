import React, {Component, PropTypes} from 'react'
import {View, StyleSheet, Modal, TouchableOpacity, Dimensions} from 'react-native'
import ImageSlider from './ImageSlider'

export default class ImageModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
  }

  _toggle() {
    this.setState({show: !this.state.show})
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Modal
          transparent={true}
          visible={this.state.show}
          onRequestClose={this.close}
          animationType="fade"
        >
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={.9}
              style={styles.overlay}
              onPress={this._toggle.bind(this)}
            />
            <ImageSlider style={styles.container} images={this.props.images} onPress={this._toggle.bind(this)}/>
          </View>
        </Modal>

        <TouchableOpacity onPress={this._toggle.bind(this)} style={this.props.style}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

ImageModal.propTypes = {
  ...TouchableOpacity.PropTypes,
  images        : PropTypes.array,
  containerStyle: PropTypes.style
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
    backgroundColor: 'rgba(0,0,0,.85)'
  },

  container: {
    flex          : 1,
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'center'
  },

  image: {
    flex      : 1,
    resizeMode: 'contain',
    width     : Dimensions.get('window').width
  }
})
