import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Platform,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Checkbox from '../components/Checkbox'
import t from 'tcomb-validation'
import Spinner from '../components/Spinner'
import DateModal from '../components/DateModal'
import User from '../db/User'

const isAndroid = Platform.OS === 'android'

export default class RegistrationScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)
    this.state = {
      name           : '',
      email          : '',
      password       : '',
      confirmPassword: '',
      birth_year     : '',
      zipcode        : '',
      is_anonymous   : true,
      warnings       : {},
      terms          : null,
      minorConsent   : null,
      currentYear    : null,
      units          : null
    }

    this.registrationRules = t.struct({
      name           : t.String,
      email          : t.String, // No validation
      password       : t.refinement(t.String, (pw) => pw.length >= 6, 'pw'),// Ensure password is at least 6 characters
      confirmPassword: t.refinement(t.String, (pw) => pw === this.state.password, 'confirmPW'), // Ensure matches password
      birth_year     : t.Integer,
      zipcode        : t.maybe(t.refinement(t.String, (n) => /^([0-9]{5})(-[0-9]{4})?$/i.test(n), 'zipCode')),
      minorConsent   : t.Boolean,
      terms          : t.Boolean
    })
  }

  componentDidMount() {
    this.analytics.visitScreen('RegistrationScreen')

    let currentYear = new Date().getFullYear()
    this.setState({currentYear: currentYear})


    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  /**
   * Validate request and send it to the server.
   */
  submitRegistration = () => {
    // if over 13, set the Consent to true automatically
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
      return
    }
    this.axiosRequest()
  }

  /**
   * Send request to server.
   */
  axiosRequest = () => {
    let request = this.state

    this.spinner.open()

    User.register(request).then(response => {
      if (this.spinner) {
        this.spinner.close()
      }
      // Transition to Landing Scene.
      this.navigator.navigate('Home')
    }).catch(error => {
      this.handleErrorAxios(error)
      this.spinner.close()
    })
  }

  /**
   * Run validation.
   *
   * @returns {*}
   */
  validateState = () => {
    return t.validate(this.state, this.registrationRules)
  }

  /**
   * A modal that parses the tcomb error and alerts user which fields are invalid.
   *
   * @param validationAttempt
   */
  notifyIncomplete = (validationAttempt) => {
    let errors    = validationAttempt.errors
    let errorList = []
    let warnings  = {}
    errors.map((error) => {
      switch (error.path[0]) {
        case 'password':
          warnings.password = true
          errorList.push('Passwords must be 6 characters long')
          break
        case 'confirmPassword':
          warnings.password        = true
          warnings.confirmPassword = true
          errorList.push('Passwords must match')
          break
        case 'email':
          warnings.email = true
          errorList.push('Please enter a valid email address')
          break
        case 'name':
          warnings.name = true
          errorList.push('Please enter a username')
          break
        case 'minorConsent':
          warnings.minorConsent = true
          errorList.push('If you are under the age of 13, you must register with consent of a parent or guardian')
          break
        case 'terms':
          warnings.terms = true
          errorList.push('You must agree with the terms of use to register')
          break
        case 'birth_year':
          warnings.birth_year = true
          errorList.push('Please enter the year you were born')
          break
      }
    })
    this.setState({warnings})
    if (errorList) {
      alert(errorList.join('\n'))
    }
  }

  handleErrorAxios = (error) => {
    if (!error.response) {
      alert('Unable to connect to server.  Please verify your internet connection and try again.')
      return
    }

    switch (error.response.status) {
      case 500:
        alert('Server error. Please contact us to assist you.')
        break
      default:
        let errors    = error.response.data
        let errorList = []
        let warnings  = {}

        Object.keys(errors).map(errorField => {
          errorList.push(errors[errorField])
          warnings[errorField] = true
        })

        this.setState({warnings})
        alert(errorList.join('\n'))
        break
    }
  }

  displayMinorsBox = () => {
    if (this.state.currentYear - this.state.birth_year <= 13) {
      return (
        <View style={styles.formGroup}>
          <Checkbox
            label="Minors: I affirm I have permission from a parent or guardian to register"
            onChange={(checked) => {
              this.setState({minorConsent: checked})
            }}
            warning={this.state.warnings.minorConsent}
          />
        </View>
      )
    }
    return (null)
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>
        <Header title="Register"
                navigator={this.navigator}
                showRightIcon={false}
                initial={isAndroid}
                onMenuPress={() => this.navigator.toggleDrawer()}/>
        <KeyboardAwareScrollView
          keyboardDismissMode={isAndroid ? 'none' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.name ? [styles.label, styles.labelWarning] : styles.label}>Name</Text>
              <TextInput
                autoCapitalize={'words'}
                style={this.state.warnings.name ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'E.g, Jane Doe'}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
                onChangeText={(name) => this.setState({name})}
                underlineColorAndroid="transparent"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.emailInput.focus()
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.email ? [styles.label, styles.labelWarning] : styles.label}>Email</Text>
              <TextInput
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                style={this.state.warnings.email ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'E.g, example@email.com'}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
                onChangeText={(email) => this.setState({email})}
                underlineColorAndroid="transparent"
                ref={ref => this.emailInput = ref}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.password ? [styles.label, styles.labelWarning] : styles.label}>Password</Text>
              <TextInput
                style={this.state.warnings.password ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'Password'}
                secureTextEntry={true}
                placeholderTextColor="#aaa"
                onChangeText={(password) => this.setState({password})}
                underlineColorAndroid="transparent"
                ref={ref => this.passwordInput = ref}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.passwordRepeatInput.focus()
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text
                style={this.state.warnings.confirmPassword ? [styles.label, styles.labelWarning] : styles.label}>Confirm
                Password</Text>
              <TextInput
                style={this.state.warnings.confirmPassword ? [styles.textField, styles.textFieldWarning] : styles.textField}
                placeholder={'Repeat Password'}
                secureTextEntry={true}
                placeholderTextColor="#aaa"
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                underlineColorAndroid="transparent"
                ref={ref => this.passwordRepeatInput = ref}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.zipcodeInput.focus()
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Zip Code (Optional)</Text>
              <TextInput
                autoCapitalize={'none'}
                style={styles.textField}
                placeholder={'E.g, 37919'}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
                onChangeText={(zipcode) => this.setState({zipcode})}
                underlineColorAndroid="transparent"
                ref={ref => this.zipcodeInput = ref}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.dateModal.open()
                }}
              />
            </View>
            <View style={styles.formGroup}>
              <DateModal
                ref={ref => this.dateModal = ref}
                style={styles.picker}
                onSelect={(option) => {
                  this.setState({birth_year: option})
                  if (this.state.currentYear - option >= 13) {
                    this.setState({minorConsent: true})
                  }
                }}
                selectedYear={
                  (this.state.birth_year > 0) ? this.state.birth_year : null
                }
              >
                <Text style={this.state.warnings.birth_year ? [styles.label, styles.labelWarning] : styles.label}>
                  Year of Birth
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  style={this.state.warnings.birth_year ? [styles.textField, styles.textFieldWarning] : styles.textField}
                  editable={false}
                  placeholder={'Enter Year'}
                  placeholderTextColor="#aaa"
                  underlineColorAndroid="transparent"
                  value={this.state.birth_year.toString()}
                />
              </DateModal>

            </View>

            <View style={styles.formGroup}>
              <Checkbox
                label="I agree to the terms of use"
                onChange={(checked) => {
                  this.setState({terms: checked})
                }}
                warning={this.state.warnings.terms}
              />
            </View>

            {this.displayMinorsBox()}

            <View style={styles.formGroup}>
              <TouchableOpacity style={styles.button}
                                onPress={this.submitRegistration}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.formGroup, {marginBottom: 30}]}>
              <TouchableOpacity onPress={() => {
                this.navigator.navigate('Login')
              }}>
                <Text style={styles.link}>Have an account? Login here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

RegistrationScreen.propTypes = {
  // navigator: PropTypes.object.isRequired
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
    fontSize  : 20,
    textAlign : 'center',
    fontWeight: 'bold',
    color     : '#222'
  },

  formGroup: {
    flex  : 0,
    margin: 10,
    width : 300
  },

  label           : {
    fontWeight  : 'bold',
    fontSize    : 14,
    marginBottom: 10,
    color       : '#444'
  },
  labelWarning    : {
    color: Colors.danger
  },
  textField       : {
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
  button          : {
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
