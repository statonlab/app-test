import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'
import Screen from './Screen'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import Package from '../../package'
import User from '../db/User'
import Colors from '../helpers/Colors'

export default class IOSMoreScreen extends Screen {
  constructor(props) {
    super(props)
  }

  renderLoggedInMenu() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.navigator.navigate('Account')
          }}
          style={[styles.formItem]}>
          <Text style={styles.formLabel}>
            Account Settings
          </Text>
          <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => User.logout()}
          style={[styles.formItem, styles.lastFormItem]}>
          <Text style={[styles.formLabel, {color: Colors.danger}]}>
            Logout
          </Text>
          <Icon name={'ios-log-out'} size={22} color={Colors.danger}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoggedOutMenu() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.navigator.navigate('Register')
          }}
          style={[styles.formItem]}>
          <Text style={styles.formLabel}>
            Register
          </Text>
          <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.navigator.navigate('Login')
          }}
          style={[styles.formItem, styles.lastFormItem]}>
          <Text style={styles.formLabel}>
            Log In
          </Text>
          <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={'More'}
                elevation={2}
                navigator={this.navigator}
                showLeftIcon={false}
                showRightIcon={false}/>
        <ScrollView style={styles.body}>
          <Text style={styles.title}>Membership</Text>
          <View style={styles.card}>
            {User.loggedIn() ? this.renderLoggedInMenu() : this.renderLoggedOutMenu()}
          </View>

          <Text style={styles.title}>Information</Text>
          <View style={styles.card}>
            <View
              style={[styles.formItem]}>
              <Text style={[styles.formLabel, {marginRight: 10}]}>
                App Version
              </Text>
              <Text style={[styles.formLabel, {fontWeight: 'normal'}]}>{Package.version}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.navigator.navigate('About')
              }}
              style={styles.formItem}>
              <Text style={styles.formLabel}>
                About Us
              </Text>
              <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.navigator.navigate('PrivacyPolicy')
              }}
              style={styles.formItem}>
              <Text style={styles.formLabel}>
                Privacy Policy
              </Text>
              <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.navigator.navigate('HealthSafety')
              }}
              style={[styles.formItem, styles.lastFormItem]}>
              <Text style={styles.formLabel}>
                Health and Safety
              </Text>
              <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  body: {
    flex           : 1,
    backgroundColor: '#f7f7f7',
    paddingTop     : 10
  },

  title: {
    fontSize         : 14,
    color            : '#222',
    paddingHorizontal: 5,
    fontWeight       : 'bold',
    marginTop        : 10
  },

  card: {
    backgroundColor  : '#fff',
    borderTopWidth   : 1,
    borderTopColor   : '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 5,
    marginTop        : 5,
    marginBottom     : 10
  },

  formItem: {
    paddingRight     : 10,
    flexDirection    : 'row',
    alignItems       : 'center',
    justifyContent   : 'space-between',
    height           : 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  lastFormItem: {
    borderBottomWidth: 0
  },

  formLabel: {
    fontSize: 14,
    color   : '#222'
  }
})
