import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  DeviceEventEmitter,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'
import axios from '../helpers/Axios'
import realm from '../db/Schema'
import Spinner from '../components/Spinner'
import AText from '../components/Atext'

export default class LoginScreen extends Screen {
  constructor(props) {
    super(props)

    this.state = {
      email      : null,
      password   : null,
      showSpinner: false,
      warnings   : {}
    }

    this.realm = realm

    this.loginRules = t.struct({
      email   : t.String,
      password: t.refinement(t.String, (pw) => pw.length >= 6, 'pw')
    })
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  /**
   * Handle the login button
   */
  logInUser = () => {
    this.resetFormWarnings()

    let submission = t.validate(this.state, this.loginRules)
    if (submission.isValid()) {
      // Check email and password against server, store in realm
      this.loginRequest()
    } else {
      this.handleValidationError(submission)
    }
  }

  /**
   * Clean up previous errors
   */
  resetFormWarnings = () => {
    this.setState({warnings: {}})
  }

  /**
   * Send login request to server
   */
  loginRequest = () => {
    this.setState({showSpinner: true})

    axios.post('user/login', {
      email   : this.state.email,
      password: this.state.password
    }).then(response => {
      this.storeUser(response)
      this.setState({showSpinner: false})

      DeviceEventEmitter.emit('userLoggedIn')

      this.navigator.goBack()
    }).catch(error => {
      this.setState({showSpinner: false})
      this.handleErrorAxios(error)
    })
  }

  /**
   * Sets errors in the state, based on local validation in tcomb.
   *
   * @param submission
   */
  handleValidationError = (submission) => {
    let errors    = submission.errors
    let errorList = []
    let warnings  = {
      emailWarning   : false,
      passwordWarning: false
    }
    errors.map((error) => {
      switch (error.path[0]) {
        case 'email':
          warnings.emailWarning = true
          errorList.push('invalid email')
          break
        case 'password':
          warnings.passwordWarning = true
          errorList.push('invalid password')
          break
      }
    })
    this.setState({warnings})
    if (errorList) {
      alert(errorList.join('\n'))
    }
  }

  /**
   * Handle server errors.
   *
   * @param error
   */
  handleErrorAxios = (error) => {
    //if (error.response && error.response.status === 422) {
    alert('Invalid credentials.')
    this.setState({warnings: {emailWarning: true, passwordWarning: true}})
  }


  /**
   * Stores the user in Realm.
   *
   * @param response
   */
  storeUser = (response) => {
    this.realm.write(() => {
      let user = realm.objects('User')
      if (user.length > 0) {
        // Delete existing users first
        this.realm.delete(user)
      }

      if (!response.data.data.zipcode) {
        response.data.data.zipcode = ''
      }

      let data = response.data.data

      this.realm.create('User', {
        name      : data.name,
        email     : data.email,
        anonymous : data.is_anonymous,
        zipcode   : data.zipcode,
        api_token : data.api_token,
        birth_year: data.birth_year,
        is_private: data.is_private
      })
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Spinner show={this.state.showSpinner}/>
        <Header title="Login" navigator={this.navigator} showRightIcon={false}/>
        <ScrollView keyboardDismissMode={'on-drag'} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.title}>TreeSnap</Text>
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.emailWarning ? [styles.label, styles.labelWarning] : styles.label}>Email</Text>
              <TextInput
                autoCapitalize={'none'}
                style={this.state.warnings.emailWarning ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'Email'}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
                onChangeText={(email) => this.setState({email})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.passwordWarning ? [styles.label, styles.labelWarning] : styles.label}>Password</Text>
              <TextInput
                style={this.state.warnings.passwordWarning ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'Password'}
                secureTextEntry={true}
                placeholderTextColor="#aaa"
                onChangeText={(password) => this.setState({password})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.logInUser()
                }}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
              <TouchableOpacity>
                <AText style={styles.link} url="https://treesnap.org/password/reset">Forgot your password?</AText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.navigator.navigate('Registration')
              }}>
                <Text style={[styles.link]}>Register</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>
    )
  }
}

LoginScreen.PropTypes = {
  navigator: PropTypes.object.isRequired
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
    flex      : 1,
    marginTop : 20,
    alignItems: 'center'
  },

  title: {
    fontSize    : 20,
    textAlign   : 'center',
    marginBottom: 20,
    fontWeight  : 'bold',
    color       : '#222'
  },

  formGroup: {
    flex  : 0,
    margin: 10,
    width : 300
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
    ...(new Elevation(1)),
    flex           : 0,
    borderRadius   : 2,
    backgroundColor: Colors.primary,
    padding        : 10
  },

  buttonText: {
    color     : Colors.primaryText,
    textAlign : 'center',
    fontSize  : 14,
    fontWeight: 'bold'
  },

  link: {
    color: '#666'
  }
})
