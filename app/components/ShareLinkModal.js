import React, { Component } from 'react'
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Colors from '../helpers/Colors'
import Spinner from '../components/Spinner'
import axios from '../helpers/Axios'
import realm from '../db/Schema'
import Icon from 'react-native-vector-icons/Ionicons'

export default class ShareLinkModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shareURL: '',
    }

    this.spinner = null
  }

  _getAccurateShareLink() {
    this.spinner.open()
    const user = realm.objects('User')
    if (user.length > 0) {
      axios.get(`/share/observation/${this.props.entry.serverID}`,
        {params: {api_token: user[0].api_token}}).then(response => {
        console.log('HERE', user[0].api_token, response.status)
        this.setState({
          shareURL: response.data.data,
        }, () => {
          this.props.onChange(this.state.shareURL)
        })
        this.spinner.close()
      }).catch(error => {
        this.spinner.close()

        console.error(error.response)
        Alert.alert('Server Error', 'Please try again later.')
      })
    } else {
      Alert.alert('Error', 'You must be logged in to use this feature.')
    }
  }

  render() {
    return (
      <Modal animationType="slide"
             visible={this.props.visible}
             onRequestClose={this.props.onRequestClose}>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Share Observation
            </Text>
          </View>
          <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
            <TouchableOpacity
              style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
              onPress={() => {
                this._getAccurateShareLink()
              }}>
              <Icon name={'ios-eye'} color={'#444'} size={20}/>
              <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
                <Text style={styles.buttonText}>
                  Share with accurate location
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formGroup, {flex: 0, alignItems: 'center'}]}
              onPress={() => {
                this.setState({
                  shareURL: `https://treesnap.org/observation/${this.props.entry.serverID}`,
                }, () => {
                  this.props.onChange(this.state.shareURL)
                })
              }}>
              <Icon name={'ios-eye-off'} color={'#444'} size={20}/>
              <View style={{flex: 1, paddingVertical: 5, flexDirection: 'column'}}>
                <Text style={styles.buttonText}>
                  Share without accurate location
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.props.onRequestClose()}>
              <Text style={styles.doneText}>DONE</Text>
            </TouchableOpacity>
          </View>
          <Spinner ref={ref => this.spinner = ref}/>
        </SafeAreaView>
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
    minHeight        : 50,
    paddingHorizontal: 10,
  },

  footer: {
    height           : isIphoneX() ? 60 : 40,
    borderTopWidth   : 1,
    borderTopColor   : '#dedede',
    backgroundColor  : '#eee',
    alignItems       : 'flex-end',
    justifyContent   : 'center',
    paddingHorizontal: 10,
    paddingBottom    : isIphoneX() ? 20 : 0,
  },

  doneText: {
    fontSize  : 14,
    fontWeight: 'bold',
    color     : Colors.primary,
  },

  header: {
    backgroundColor: Colors.primary,
    height         : 35,
  },

  headerText: {
    color     : Colors.primaryText,
    flex      : 1,
    textAlign : 'center',
    fontWeight: '600',
    fontSize  : 16,
  },

  buttonText: {
    color      : '#444',
    fontSize   : 14,
    paddingLeft: 10,
  },
})
