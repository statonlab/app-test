import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {isIphoneX} from 'react-native-iphone-x-helper'
import IonIcon from 'react-native-vector-icons/Ionicons'

const isAndroid = Platform.OS === 'android'

export default class AdvancedSettingsModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPrivate         : false,
      hasPrivateComments: false
    }
  }

  componentDidMount() {
    let {
          isPrivate,
          hasPrivateComments
        } = this.props.initialValues

    this.setState({
      isPrivate,
      hasPrivateComments
    })
  }

  render() {
    let commentsPrivacyCheckbox
    if (this.state.hasPrivateComments) {
      commentsPrivacyCheckbox = <IonIcon name={'md-checkbox'} size={20} color={Colors.primary}/>
    } else {
      commentsPrivacyCheckbox = <IonIcon name={'md-square-outline'} size={20} color={'#aaa'}/>
    }

    let isPrivateCheckbox
    if (this.state.isPrivate) {
      isPrivateCheckbox = <IonIcon name={'md-checkbox'} size={20} color={Colors.primary}/>
    } else {
      isPrivateCheckbox = <IonIcon name={'md-square-outline'} size={20} color={'#aaa'}/>
    }

    return (
      <Modal
        animationType="slide"
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>
            Advanced Options
          </Text>
        </View>
        <KeyboardAvoidingView
          style={{flex: 1, backgroundColor: '#f4f4f4'}}
          {...(isAndroid ? null : {behavior: 'padding'})}>
          <View style={{flex: 1}}>

            <Text style={styles.title}>
              Privacy Settings
            </Text>
            <View style={styles.card}>
              <TouchableOpacity style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
                                activeOpacity={1}
                                onPress={() => {
                                  this.setState({
                                    hasPrivateComments: !this.state.hasPrivateComments
                                  }, () => {
                                    this.props.onChange(this.state)
                                  })
                                }}>
                <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
                  <Text style={[styles.label, {flex: 1}]}>
                    Mark comments as private
                  </Text>
                  <Text style={styles.helpText}>
                    {this.state.hasPrivateComments ?
                      'Visible only to you'
                      : 'Will be shared publicly'}
                  </Text>
                </View>
                <Text style={{
                  flex          : 0,
                  color         : this.state.hasPrivateComments ? '#444' : '#aaa',
                  width         : 40,
                  alignItems    : 'center',
                  justifyContent: 'center'
                }}>
                  {commentsPrivacyCheckbox}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
                                activeOpacity={1}
                                onPress={() => {
                                  this.setState({
                                    isPrivate: !this.state.isPrivate
                                  }, () => {
                                    this.props.onChange(this.state)
                                  })
                                }}>
                <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
                  <Text style={[styles.label, {flex: 1}]}>
                    Mark observation as private
                  </Text>
                  <Text style={styles.helpText}>
                    {this.state.isPrivate ?
                      'Visible only to you and our partners'
                      : 'Will be shared publicly'}
                  </Text>
                </View>
                <Text style={{
                  flex          : 0,
                  color         : this.state.isPrivate ? '#444' : '#aaa',
                  width         : 40,
                  alignItems    : 'center',
                  justifyContent: 'center'
                }}>
                  {isPrivateCheckbox}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.props.onRequestClose()}>
              <Text style={styles.doneText}>DONE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

AdvancedSettingsModal.propTypes = {
  visible       : PropTypes.bool.isRequired,
  onChange      : PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  initialValues : PropTypes.object.isRequired
}

AdvancedSettingsModal.defaultProps = {}

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

const styles = StyleSheet.create({
  modalHeader: {
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    paddingBottom  : 10,
    ...(new Elevation(2))
  },

  modalHeaderText: {
    color          : Colors.primaryText,
    textAlign      : 'center',
    fontWeight     : 'normal',
    fontSize       : 16,
    paddingVertical: 5
  },

  title: {
    fontSize         : 14,
    color            : '#444',
    fontWeight       : 'bold',
    paddingHorizontal: 5,
    paddingTop       : 10,
    marginBottom     : 5
  },

  formGroup: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    minHeight        : 60
  },

  label: {
    flex      : 0,
    color     : '#444',
    fontWeight: 'bold'
  },

  card: {
    flex           : 0,
    borderTopWidth : 1,
    borderTopColor : '#dedede',
    backgroundColor: '#fff'
  },

  footer: {
    height           : isIphoneX() ? 60 : 40,
    borderTopWidth   : 1,
    borderTopColor   : '#dedede',
    backgroundColor  : '#eee',
    alignItems       : 'flex-end',
    justifyContent   : 'center',
    paddingHorizontal: 10,
    paddingBottom    : isIphoneX() ? 20 : 0
  },

  doneText: {
    fontSize  : 14,
    fontWeight: 'bold',
    color     : Colors.primary
  },

  helpText: {
    flex         : 1,
    color        : '#999',
    flexDirection: 'column',
    flexWrap     : 'wrap'
  }
})
