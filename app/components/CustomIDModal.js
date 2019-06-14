import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Modal,
  StyleSheet,
  Platform,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Ionicons'
import BarcodeReader from './BarcodeReader'

const isAndroid = Platform.OS === 'android'

export default class CustomIDModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showBarcodeReader: false,
      selected         : null,
    }
  }

  renderField(value, index) {
    const custom_id         = this.props.customID
    const other_identifiers = this.props.otherIdentifiers
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}
            key={`field-${index}`}>
        <View style={{position: 'relative', flex: 1}}>
          <TextInput
            style={styles.customIDInput}
            placeholder="Enter custom ID"
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={(id) => {
              this.props.onChange(custom_id, other_identifiers.map((v, i) => {
                if (i === index) {
                  return id
                }

                return v
              }))
            }}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            onPress={() => this.setState({showBarcodeReader: true, selected: index})}
            style={styles.cameraIcon}>
            <Icon name={'ios-camera'}
                  color={Colors.primary}
                  size={34}
                  style={{paddingRight: 10}}/>
          </TouchableOpacity>
        </View>

        {index === other_identifiers.length - 1 ?
          <TouchableOpacity
            onPress={() => {
              const old = other_identifiers.concat([])
              old.pop()
              this.props.onChange(this.props.customID, old)
            }}
            style={{paddingVertical: 5, paddingLeft: 10}}>
            <Icon name={'md-remove-circle'} color={Colors.danger} size={24}/>
          </TouchableOpacity>
          : null}
      </View>
    )
  }

  renderMoreIDs() {
    const other_identifiers = this.props.otherIdentifiers

    return (
      <View style={{paddingVertical: 10}}>
        {other_identifiers.map(this.renderField.bind(this))}

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.onChange(this.props.customID, other_identifiers.concat(['']))
            }}
            style={{
              backgroundColor: Colors.primary,
              padding        : 10,
              borderRadius   : 4,
              ...(new Elevation(2)),
            }}>
            <Text style={{color: Colors.primaryText}}>Add Another ID</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Modal
        animationType="slide"
        onRequestClose={this.props.onRequestClose}
        visible={this.props.visible}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Custom Tree Identifier</Text>
        </View>
        <KeyboardAvoidingView style={{flex: 1}}
                              {...(isAndroid ? null : {behavior: 'padding'})}>
          <View style={{flex: 1, padding: 10, backgroundColor: '#f7f7f7'}}>
            <Text style={styles.text}>
              You can assign a name to the tree for this observation.
              The tree may have an ID tag as part of a study, or, you
              may pick your own name so that you can observe it over time.
            </Text>
            <View style={{position: 'relative'}}>
              <TextInput
                style={styles.customIDInput}
                placeholder="Enter custom ID"
                placeholderTextColor="#aaa"
                value={this.props.customID}
                onChangeText={(custom_id) => {
                  this.props.onChange(custom_id, this.props.otherIdentifiers)
                }}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                onPress={() => this.setState({showBarcodeReader: true})}
                style={styles.cameraIcon}>
                <Icon name={'ios-camera'}
                      color={Colors.primary}
                      size={34}
                      style={{paddingRight: 10}}/>
              </TouchableOpacity>
              <View>
                <Text style={[styles.text, {marginTop: 5}]}>
                  Click on the camera icon to scan barcodes.
                </Text>
              </View>
            </View>

            {this.renderMoreIDs()}
          </View>
          <View style={{
            flex          : 0,
            justifyContent: 'flex-end',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            ...ifIphoneX({paddingBottom: 20, backgroundColor: '#eee'}),
          }}>
            <TouchableOpacity
              style={[{
                backgroundColor  : '#eee',
                flex             : 0,
                paddingVertical  : 10,
                paddingHorizontal: 15,
              }]}
              onPress={() => {
                this.props.onRequestClose()
              }}>
              <Text style={{
                color     : Colors.primary,
                fontSize  : 14,
                textAlign : 'right',
                fontWeight: '600',
              }}>DONE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <BarcodeReader
          onRequestClose={() => {
            this.setState({showBarcodeReader: false})
          }}
          visible={this.state.showBarcodeReader}
          onChange={custom_id => {
            if (this.state.selected === null) {
              this.setState({selected: null})
              this.props.onChange(custom_id, this.props.otherIdentifiers)
            } else {
              this.setState({
                selected: null,
              }, () => {
                this.props.onChange(custom_id, this.props.otherIdentifiers.map((v, i) => {
                  if (i === this.state.selected) {
                    return custom_id
                  }
                  return v
                }))
              })
            }
          }}/>
      </Modal>
    )
  }
}

CustomIDModal.propTypes = {
  customID        : PropTypes.string.isRequired,
  onRequestClose  : PropTypes.func.isRequired,
  onChange        : PropTypes.func.isRequired,
  visible         : PropTypes.bool.isRequired,
  otherIdentifiers: PropTypes.array,
}

CustomIDModal.defaultProps = {
  otherIdentifiers: [],
}

function getVerticalPadding() {
  if (Platform.OS === 'android') {
    return 0
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 20
  }
}

const styles = StyleSheet.create({
  modalHeader: {
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    paddingBottom  : 10,
    ...(new Elevation(2)),
  },

  modalHeaderText: {
    color          : Colors.primaryText,
    textAlign      : 'center',
    fontWeight     : 'normal',
    fontSize       : 16,
    paddingVertical: 5,
  },

  text: {
    color       : '#555',
    fontSize    : 14,
    marginBottom: 10,
  },

  customIDInput: {
    flex             : 0,
    height           : 40,
    width            : undefined,
    borderWidth      : 1,
    borderColor      : '#ddd',
    backgroundColor  : '#fff',
    borderRadius     : 4,
    paddingHorizontal: 5,
  },

  cameraIcon: {
    position       : 'absolute',
    right          : 0,
    top            : 0,
    height         : 40,
    borderRadius   : 3,
    paddingRight   : 5,
    paddingLeft    : 30,
    backgroundColor: 'transparent',//Colors.primary,
    alignItems     : 'center',
    justifyContent : 'center',
  },
})
