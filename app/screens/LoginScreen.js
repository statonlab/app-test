import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'
import realm from '../db/Schema'
import Spinner from '../components/Spinner'
import AText from '../components/Atext'
import User from '../db/User'
import Errors from '../helpers/Errors'

export default class LoginScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    this.state = {
      email   : null,
      password: null,
      warnings: {}
    }

    this.realm = realm

    this.loginRules = t.struct({
      email   : t.String,
      password: t.refinement(t.String, (pw) => pw.length >= 6, 'pw')
    })
  }

  componentDidMount() {
    this.analytics.visitScreen('LoginScreen')
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
    this.spinner.open()

    User.login(this.state.email, this.state.password).then(response => {
      if (this.spinner) {
        this.spinner.close()
      }

      if (typeof this.props.onLogin !== 'function') {
        this.navigator.goBack()
      } else {
        this.props.onLogin()
      }
    }).catch(error => {
      console.log(error)
      this.spinner.close()
      const errors = new Errors(error)
      if (errors.has('general')) {
        alert(errors.first('general'))
        return
      }

      let field = Object.keys(errors.all())[0]
      alert(errors.first(field))
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


  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>
        <Header title="Login"
                navigator={this.navigator}
                showRightIcon={false}
                initial={true}
                onMenuPress={() => this.navigator.toggleDrawer()}/>
        <ScrollView keyboardDismissMode={'on-drag'}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.title}>
                Tree<Text style={{fontWeight: '200'}}>Snap</Text>
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.emailWarning ? [styles.label, styles.labelWarning] : styles.label}>Email</Text>
              <TextInput
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                style={this.state.warnings.emailWarning ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'Email'}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
                onChangeText={(email) => this.setState({email})}
                underlineColorAndroid="transparent"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                }}
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
                ref={ref => this.passwordInput = ref}
                returnKeyType={'done'}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  if (this.state.password.length > 0 && this.state.email.length > 0) {
                    this.logInUser()
                  }
                }}
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

LoginScreen.propTypes = {
  //navigator: PropTypes.object.isRequired
  onLogin: PropTypes.func
}

LoginScreen.defaultProps = {
  onLogin() {
    return false
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
