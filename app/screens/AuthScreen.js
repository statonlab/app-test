import Screen from './Screen'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  StatusBar
} from 'react-native'
import Header from '../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React from 'react'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/Feather'

const isAndroid = Platform.OS === 'android'

export default class AuthScreen extends Screen {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              flexDirection   : 'row',
              justifyContent  : 'flex-start',
              alignItems      : 'center',
              marginHorizontal: 10,
              marginTop       : isAndroid ? 10 : 30,
              height          : 50,
              borderRadius    : 20,
              flex            : 0
            }}
            onPress={() => this.navigator.goBack()}
          >
            <Icon name={'arrow-left'} color={Colors.black} size={24}/>
            <Text style={{fontSize: 16, marginLeft: 10, color: Colors.black}}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
          {isAndroid ? null : <StatusBar barStyle={'dark-content'}/>}
          <View style={{marginHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius   : 20,
              padding        : 7,
              marginBottom   : 20
            }}>
              <Image source={require('../img/logo.png')} style={[styles.img]}/>
            </View>
          </View>

          <View style={[styles.formGroup, {alignItems: 'center', justifyContent: 'center', marginBottom: 20}]}>
            <Text style={[{fontSize: 16, fontWeight: 'bold', color: Colors.black}]}>
              I would like to
            </Text>
          </View>

          <TouchableOpacity style={styles.button}
                            onPress={() => this.navigator.navigate('Login')}>
            <Icon name={'user'} color={Colors.primary} size={22}/>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
                            onPress={() => this.navigator.navigate('Registration')}>
            <Icon name={'user-plus'} color={Colors.primary} size={22}/>
            <Text style={styles.buttonText}>Create a New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  scrollView: {
    flex: 1
  },

  form: {
    flex     : 1,
    marginTop: 20
    // alignItems: 'center'
  },

  title: {
    fontSize  : 20,
    textAlign : 'center',
    fontWeight: 'bold',
    color     : '#222'
  },

  formGroup: {
    flex            : 0,
    marginBottom    : 10,
    marginHorizontal: 10
    // height: 50,
    // width : 300
  },

  label: {
    fontWeight  : 'bold',
    fontSize    : 14,
    marginBottom: 10,
    color       : '#444'
  },

  labelWarning: {
    color: Colors.danger
  },

  textField: {
    height           : 40,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },

  textFieldWarning: {
    borderColor: Colors.danger
  },

  button: {
    ...(new Elevation(2)),
    borderRadius     : 25,
    alignItems       : 'center',
    justifyContent   : 'flex-start',
    height           : 50,
    backgroundColor  : '#fff',
    flexDirection    : 'row',
    paddingHorizontal: 20,
    marginBottom     : 10,
    marginHorizontal : 10
  },

  buttonText: {
    color     : Colors.black,
    textAlign : 'center',
    fontSize  : 14,
    fontWeight: 'bold',
    marginLeft: 20
  },

  link: {
    color: '#666'
  },

  img: {
    resizeMode: 'contain',
    width     : 100,
    height    : 100
  }
})
