import React, { Component } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Elevation from '../helpers/Elevation'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Colors from '../helpers/Colors'
import Spinner from '../components/Spinner'
import axios from '../helpers/Axios'
import realm from '../db/Schema'

export default class ShareLinkModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shareURL: ''
    }
  }

  _getAccurateShareLink() {
    this.spinner.open()
    const user = realm.objects('User')
    if (user.length > 0) {
      axios.get(`share/observation/${this.props.entry.serverID}`,
        {params: {api_token: user[0].api_token}}).then(response => {
          this.setState({
            shareURL: response.data.data
          }, () => {
            this.props.onChange(this.state)
          })
      }).catch(error => {
        console.error(error.response)
        Alert.alert('Server Error', 'Please try again later.')
      })
    }
    this.spinner.close()
  }

  render() {
    return (
      <Modal animationType="slide"
             visible={this.props.visible}
             onRequestClose={this.props.onRequestClose}>
        <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
          <TouchableOpacity style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
                            activeOpacity={1}
                            onPress={() => {
                              this._getAccurateShareLink()
                            }}>
            <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
              <Text>
                Share with accurate location
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
                            activeOpacity={1}
                            onPress={() => {
                              this.setState({
                                shareURL: `https://treesnap.org/observation/${this.props.entry.serverID}`
                              }, () => {
                                this.props.onChange(this.state)
                              })
                            }}>
            <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
              <Text>
                Share without accurate location
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.props.onRequestClose()}>
              <Text style={styles.doneText}>DONE</Text>
            </TouchableOpacity>
          </View>
          <Spinner ref={ref => this.spinner = ref}/>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  formGroup: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    minHeight        : 50
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
  }
})