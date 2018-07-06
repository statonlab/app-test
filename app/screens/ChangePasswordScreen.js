import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  DeviceEventEmitter
} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import realm from '../db/Schema'
import axios from '../helpers/Axios'
import SnackBar from '../components/SnackBarNotice'
import Spinner from '../components/Spinner'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import User from '../db/User'

const isAndroid = Platform.OS === 'android'

export default class ChangePasswordScreen extends Screen {
  constructor(props) {
    super(props)

    this.state = {
      errors                   : {
        old_password             : false,
        new_password             : false,
        new_password_confirmation: false
      },
      old_password             : '',
      new_password             : '',
      new_password_confirmation: '',
      changes                  : false,
      userChanges              : false,
      snackMessage             : 'Password updated successfully'
    }

    this.user = User.user()
  }

  componentWillUnmount() {
    this.backEvent.remove()
    this.events.map(event => event.remove())
  }

  /**
   * Populate the user fields.
   */
  componentDidMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })

    this.events = [
      DeviceEventEmitter.addListener('userLoggedOut', this.props.onLogout)
    ]

    this.analytics.visitScreen('ChangePasswordScreen')
  }

  /**
   * Validate password fields.
   *
   * @returns {boolean}
   */
  validatePassword(validateEmpty) {
    let errors    = {
      old_password             : false,
      new_password             : false,
      new_password_confirmation: false
    }
    let hasErrors = false

    if (validateEmpty && this.state.old_password.trim().length === 0) {
      errors.old_password = 'The old password field is required'
      hasErrors           = true
    }

    if (validateEmpty && this.state.new_password.trim().length === 0) {
      errors.new_password = 'The new password field is required'
      hasErrors           = true
    }

    if (validateEmpty && this.state.new_password_confirmation.trim().length === 0) {
      errors.new_password_confirmation = 'The repeat new password field is required'
      hasErrors                        = true
    }

    this.setState({errors})

    // True if valid and false otherwise
    return !hasErrors
  }

  /**
   * Update user password and regenerate token
   */
  submit() {
    if (!this.validatePassword(true)) {
      return
    }

    this.spinner.open()

    axios.patch('user/password', {
      old_password             : this.state.old_password,
      new_password             : this.state.new_password,
      new_password_confirmation: this.state.new_password_confirmation,
      api_token                : this.user.api_token
    }).then(response => {
      let token = response.data.data.api_token
      this.setState({
        old_password             : '',
        new_password             : '',
        new_password_confirmation: '',
        changes                  : false,
        snackMessage             : 'Password updated successfully'
      })

      try {
        realm.write(() => {
          this.user.api_token = token
        })
      } catch (e) {
        console.log(e)
      }

      this.spinner.close()
      this.refs.snackbar.showBar()
    }).catch(error => {
      this.spinner.close()

      if (error.response && error.response.status === 422) {
        this.handleValidationErrors(error.response.data)
      } else {
        alert('Could not connect to server. Please try again later.')
      }
    })
  }

  /**
   * Show validation errors to the user
   *
   * @param errors
   */
  handleValidationErrors(errors) {
    let stateErrors = {
      old_password             : false,
      new_password             : false,
      new_password_confirmation: false
    }

    Object.keys(errors).map(key => {
      stateErrors[key] = errors[key]
    })

    this.setState({errors: stateErrors})
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>
        <Header title="Change Password"
                navigator={this.navigator}
                showRightIcon={false}
                initial={false}
        />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>PASSWORD</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>Old Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    placeholderTextColor="#aaa"
                    onChangeText={(old_password) => this.setState({
                      old_password,
                      changes: true
                    }, () => this.validatePassword())}
                    placeholder={'Old Password'}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.old_password ?
                  <Text style={styles.warning}>{this.state.errors.old_password}</Text> : null}
              </View>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>New Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    placeholderTextColor="#aaa"
                    placeholder={'New Password'}
                    onChangeText={(new_password) => this.setState({
                      new_password,
                      changes: true
                    }, () => this.validatePassword())}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.new_password ?
                  <Text style={styles.warning}>{this.state.errors.new_password}</Text> : null}
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>Repeat Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    placeholderTextColor="#aaa"
                    placeholder={'Repeat New Password'}
                    onChangeText={(new_password_confirmation) => this.setState({
                      new_password_confirmation,
                      changes: true
                    }, () => this.validatePassword())}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.new_password_confirmation ?
                  <Text style={styles.warning}>{this.state.errors.new_password_confirmation}</Text> : null}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.state.changes ? <View style={styles.footer}>
          <View style={styles.column}>
            <TouchableOpacity style={styles.button} onPress={this.submit.bind(this)}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
          {isAndroid ? null :
            <View style={styles.column}>
              <TouchableOpacity
                style={[styles.button, styles.buttonLink]}
                onPress={() => {
                  this.navigator.goBack(null)
                }}
              >
                <Text style={[styles.buttonText, styles.buttonLinkText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          }
        </View> : null}

        <SnackBar ref="snackbar" noticeText={this.state.snackMessage}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  innerContainer: {
    paddingVertical: 10
  },

  card: {
    backgroundColor  : '#fff',
    marginBottom     : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopWidth   : 1,
    borderTopColor   : '#ddd'
  },

  formGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical  : 5,
    paddingLeft      : 0,
    marginHorizontal : 5
  },

  row: {
    flex         : 1,
    flexDirection: 'row',
    alignItems   : 'center'
  },

  touchableRow: {
    flex          : 1,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    height        : 40,
    paddingRight  : 5
  },

  label: {
    fontSize  : 14,
    color     : '#222',
    fontWeight: 'normal',
    width     : 100
  },

  labelLg: {
    width: 120
  },

  labelFullWidth: {
    flex : 1,
    width: undefined
  },

  textField: {
    flex             : 1,
    height           : 40,
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    color            : '#000'
  },

  title: {
    color            : '#222',
    fontSize         : 12,
    fontWeight       : 'bold',
    paddingTop       : 10,
    paddingBottom    : 5,
    paddingHorizontal: 5
  },

  footer: {
    flex          : 0,
    height        : 50,
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },

  column: {
    flex   : 1,
    padding: 5
  },

  button: {
    ...(new Elevation(2)),
    flex           : 1,
    backgroundColor: Colors.primary,
    borderRadius   : 2,
    alignItems     : 'center',
    justifyContent : 'center'
  },

  buttonText: {
    color     : Colors.primaryText,
    flex      : 0,
    fontWeight: 'bold'
  },

  buttonLink: {
    backgroundColor: '#fff'
  },

  buttonLinkText: {
    color: '#777'
  },

  noBorder: {
    borderBottomWidth: 0
  },

  warning: {
    color    : Colors.danger,
    textAlign: 'center',
    fontSize : 12
  }
})
