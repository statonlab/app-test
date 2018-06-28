import React, {Component} from 'react'
import {View, Modal, StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import {RNCamera} from 'react-native-camera'
import Colors from '../helpers/Colors'
import {isIphoneX} from 'react-native-iphone-x-helper'

export default class BarcodeReader extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const {width, height} = Dimensions.get('window')

    return (
      <Modal
        animationType={'fade'}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <View style={styles.container}>
          <RNCamera
            style={{
              flex          : 1,
              justifyContent: 'space-between'
            }}
            onBarCodeRead={(data) => {
              this.props.onChange(data.data)
              this.props.onRequestClose()
            }}
          >
            <View style={[styles.clip, {width, height: (height / 2) - 140}]}>
              <Text style={{color: '#fff', fontSize: 16, marginBottom: 5}}>Contain the barcode within this area</Text>
            </View>
            <View style={[styles.clip, {width, height: (height / 2) - 140}]}/>
          </RNCamera>
          <TouchableOpacity style={styles.cancelBtn} onPress={this.props.onRequestClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

BarcodeReader.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  onChange      : PropTypes.func.isRequired,
  visible       : PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  cancelBtn: {
    height         : isIphoneX() ? 60 : 40,
    justifyContent : 'center',
    alignItems     : 'center',
    backgroundColor: Colors.primary,
    paddingBottom  : isIphoneX() ? 20 : 0
  },

  cancelText: {
    color     : Colors.primaryText,
    fontSize  : 14,
    fontWeight: 'bold'
  },

  clip: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
    justifyContent : 'flex-end',
    alignItems     : 'center'
  }
})
