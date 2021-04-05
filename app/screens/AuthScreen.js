import Screen from './Screen'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  BackHandler,
  Linking, Alert,
} from 'react-native'
import React from 'react'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/Ionicons'
import User from '../db/User'
import Spinner from '../components/Spinner'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import Axios from '../helpers/Axios'

const isAndroid = Platform.OS === 'android'

export default class AuthScreen extends Screen {

  constructor(props) {
    super(props)

    this.loggingIn = false
    this.spinner   = null

    this.state = {
      auth: null,
    }
  }

  componentDidMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })

    Linking.addEventListener('url', this._handleOpenURL.bind(this))
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this))
    this.backEvent.remove()
  }

  extractAPIToken(link) {
    let sub   = 'social-login/'
    let start = link.indexOf(sub)
    return link.substr(start + sub.length)
  }

  _handleOpenURL(url) {
    let link = url.url
    if (link && link.indexOf('social-login') > -1) {
      this.params.api_token = this.extractAPIToken(link)

      this.handleSocialLoginCallback()
    }
  }

  async onAppleButtonPress() {
    try {
      // performs login request
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes   : [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(response.user)

      // use credentialState response to ensure the user is authenticated
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        // user is authenticated
        Alert.alert('Unable to user Apple Sign In. Please try another method.')
        return
      }

      this.loggingIn = true

      if (this.spinner) {
        this.spinner.open()
      }

      const {data} = await Axios.post(`/apple`, {response})

      let user = await User.socialLogin(data.data.api_token)

      if (this.spinner) {
        this.spinner.close()
      }

      if (!user) {
        Alert.alert('Login Error', 'Unable to login using other platforms. Please use email and password instead.')
        return
      }

      if (typeof this.props.onLogin !== 'function') {
        this.navigator.goBack()
      } else {
        this.props.onLogin()
      }
    } catch (e) {
      alert(e)
      if(this.spinner) {
        this.spinner.close()
      }
      console.error(e)
    }
  }

  async handleSocialLoginCallback() {
    if (this.loggingIn || User.loggedIn()) {
      return
    }

    this.loggingIn = true

    if (this.spinner) {
      this.spinner.open()
    }

    let user = await User.socialLogin(this.params.api_token)

    if (this.spinner) {
      this.spinner.close()
    }

    if (!user) {
      Alert.alert('Login Error', 'Unable to login using other platforms. Please use email and password instead.')
      return
    }

    if (typeof this.props.onLogin !== 'function') {
      this.navigator.goBack()
    } else {
      this.props.onLogin()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>

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
              flex            : 0,
            }}
            onPress={() => this.navigator.goBack()}
          >
            <Icon name={'md-arrow-back'} color={Colors.black} size={24}/>
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
              marginBottom   : 20,
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
            <Icon name={'md-person'} color={Colors.primary} size={22}/>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
                            onPress={() => this.navigator.navigate('Registration')}>
            <Icon name={'md-person-add'} color={Colors.primary} size={22}/>
            <Text style={styles.buttonText}>Create a New Account</Text>
          </TouchableOpacity>


          {isAndroid && Platform.Version <= 22 ? null :
            <View>
              <View style={{alignItems: 'center', flexDirection: 'row', padding: 10, marginVertical: 10}}>
                <View style={{flex: 1, height: 1, backgroundColor: '#dddddd'}}/>
                <View style={{paddingHorizontal: 10}}>
                  <Text style={{fontWeight: 'bold'}}>OR</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: '#dddddd'}}/>
              </View>
              <TouchableOpacity
                style={[styles.button, {
                  backgroundColor: Colors.googleRed,
                  flexDirection  : 'row',
                  justifyContent : 'center',
                  alignItems     : 'center',
                  paddingVertical: 5,
                  borderRadius   : 2,
                }]}
                onPress={User.loginWithGoogle.bind(this)}>
                <Icon name={'logo-google'}
                      size={24}
                      color={Colors.googleRedText}/>
                <Text style={[styles.buttonText, {fontWeight: 'bold', color: '#fff'}]}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {
                  backgroundColor: Colors.black,
                  flexDirection  : 'row',
                  justifyContent : 'center',
                  alignItems     : 'center',
                  paddingVertical: 5,
                  borderRadius   : 2,
                  fontFamily     : 'system',
                }]}
                onPress={() => {
                  if (isAndroid) {
                    User.loginWithApple.call(this)
                  } else {
                    this.onAppleButtonPress()
                  }
                }}>
                <Icon name={'logo-apple'}
                      size={24}
                      color={Colors.googleRedText}
                />
                <Text style={[styles.buttonText, {fontWeight: 'bold', color: '#fff'}]}>
                  Sign in with Apple
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
  },

  form: {
    flex     : 1,
    marginTop: 20,
    // alignItems: 'center'
  },

  title: {
    fontSize  : 20,
    textAlign : 'center',
    fontWeight: 'bold',
    color     : '#222',
  },

  formGroup: {
    flex            : 0,
    marginBottom    : 10,
    marginHorizontal: 10,
    // height: 50,
    // width : 300
  },

  label: {
    fontWeight  : 'bold',
    fontSize    : 14,
    marginBottom: 10,
    color       : '#444',
  },

  labelWarning: {
    color: Colors.danger,
  },

  textField: {
    height           : 40,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9',
  },

  textFieldWarning: {
    borderColor: Colors.danger,
  },

  button: {
    ...(new Elevation(2)),
    borderRadius     : 2,
    alignItems       : 'center',
    justifyContent   : 'flex-start',
    height           : 50,
    backgroundColor  : '#fff',
    flexDirection    : 'row',
    paddingHorizontal: 20,
    marginBottom     : 10,
    marginHorizontal : 10,
  },

  buttonText: {
    color     : Colors.black,
    textAlign : 'center',
    fontSize  : 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },

  link: {
    color: '#666',
  },

  img: {
    resizeMode: 'contain',
    width     : 100,
    height    : 100,
  },
})
