import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {View, StyleSheet, Text, TextInput, TouchableOpacity, BackHandler, DeviceEventEmitter} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import PickerModal from '../components/PickerModal'
import realm from '../db/Schema'
import axios from '../helpers/Axios'
import SnackBar from '../components/SnackBarNotice'
import Spinner from '../components/Spinner'
import DateModal from '../components/DateModal'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import User from '../db/User'

export default class AccountScreen extends Screen {
  constructor(props) {
    super(props)

    this.state = {
      showSpinner              : false,
      name                     : '',
      anonymous                : '',
      auto_sync                : false,
      email                    : '',
      zipcode                  : '',
      birth_year               : '',
      old_password             : '',
      new_password             : '',
      new_password_confirmation: '',
      errors                   : {
        name                     : false,
        anonymous                : false,
        email                    : false,
        zipcode                  : false,
        birth_year               : false,
        old_password             : false,
        new_password             : false,
        new_password_confirmation: false
      },
      passwordChanges          : false,
      userChanges              : false,
      snackMessage             : 'Account updated successfully'
    }

    this.user = User.user()
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
    this.events    = [
      DeviceEventEmitter.addListener('userLoggedOut', this.props.onLogout)
    ]
  }

  componentWillUnmount() {
    this.backEvent.remove()
    this.events.map(event => event.remove())
  }

  /**
   * Populate the user fields.
   */
  componentDidMount() {
    this.setState({
      name      : this.user.name,
      email     : this.user.email,
      zipcode   : this.user.zipcode,
      anonymous : this.user.anonymous ? 'Yes' : 'No',
      birth_year: this.user.birth_year
    })
  }

  /**
   * Validate the form
   *
   * @returns {boolean} true if valid and false otherwise
   */
  validate() {
    let errors = {
      name      : false,
      anonymous : false,
      email     : false,
      zipcode   : false,
      birth_year: false
    }

    let hasErrors = false

    if (this.state.email.trim().length === 0) {
      errors.email = 'The email field is required'
      hasErrors    = true
    }

    if (this.state.name.trim().length === 0) {
      errors.name = 'The name field is required'
      hasErrors   = true
    }

    if (this.state.anonymous.trim().length === 0) {
      errors.anonymous = 'The anonymous field is required'
      hasErrors        = true
    }

    if (this.state.zipcode.trim().length > 0 && !/^([0-9]{5})(-[0-9]{4})?$/i.test(this.state.zipcode)) {
      errors.zipcode = 'The zip code field must be a valid zip code'
      hasErrors      = true
    }

    if (this.state.birth_year.length === 0) {
      errors.birth_year = 'The birth year field is required'
      hasErrors         = true
    }

    this.setState({errors})

    // True if valid and false otherwise
    return !hasErrors
  }

  /**
   * Validate password fields.
   *
   * @returns {boolean}
   */
  validatePassword() {
    let errors    = {
      old_password             : false,
      new_password             : false,
      new_password_confirmation: false
    }
    let hasErrors = false


    if (this.state.old_password.trim().length === 0) {
      errors.old_password = 'The old password field is required'
      hasErrors           = true
    }

    if (this.state.new_password.trim().length === 0) {
      errors.new_password = 'The new password field is required'
      hasErrors           = true
    }

    if (this.state.new_password_confirmation.trim().length === 0) {
      errors.new_password_confirmation = 'The repeat new password field is required'
      hasErrors                        = true
    }

    this.setState({errors})

    // True if valid and false otherwise
    return !hasErrors
  }

  /**
   * Handle the submit/update button click
   */
  submit() {
    if (this.state.userChanges) {
      this.updateUserProfile()
    }

    if (this.state.passwordChanges) {
      this.updatePassword()
    }
  }

  /**
   * Update user profile.
   */
  updateUserProfile() {
    if (!this.validate()) {
      return
    }

    this.setState({showSpinner: true})

    axios.put('user', {
      api_token   : this.user.api_token,
      name        : this.state.name,
      email       : this.state.email,
      zipcode     : this.state.zipcode,
      is_anonymous: this.state.anonymous.trim() === 'Yes',
      birth_year  : this.state.birth_year,
      snackMessage: 'Profile updated successfully'
    }).then(response => {
      this.refs.snackbar.showBar()
      this.setState({userChanges: false})
      this.updateRealmUser(response.data.data)
    }).catch(error => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            alert('Server error. Please try again later.')
            console.log(error.response)
            break
          default:
            this.handleValidationErrors(error.response.data.error)
            break
        }
      } else {
        alert('Could not reach server. Make sure you have internet connection.')
      }
    }).then(() => {
      this.setState({showSpinner: false})
    })
  }

  /**
   * Update user password and regenerate token
   */
  updatePassword() {
    if (!this.validatePassword()) {
      return
    }

    this.setState({showSpinner: true})

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
        snackMessage             : 'Password updated successfully'
      })

      try {
        realm.write(() => {
          this.user.api_token = token
        })
      } catch (e) {
        console.log(e)
      }

      this.refs.snackbar.showBar()
    }).catch(error => {
      console.log(error)
      if (error.response && error.response.status === 422) {
        this.handleValidationErrors(error.response.data)
      } else {
        alert('Could not connect to server. Please try again later.')
      }
    }).then(() => {
      this.setState({showSpinner: false})
    })
  }

  /**
   * Show validation errors to the user
   *
   * @param errors
   */
  handleValidationErrors(errors) {
    let stateErrors = {
      name                     : false,
      anonymous                : false,
      email                    : false,
      zipcode                  : false,
      birth_year               : false,
      old_password             : false,
      new_password             : false,
      new_password_confirmation: false
    }

    Object.keys(errors).map(key => {
      stateErrors[key] = errors[key]
    })

    this.setState({errors: stateErrors})
  }

  /**
   * Update the local realm user record.
   *
   * @param response
   */
  updateRealmUser(response) {
    try {
      realm.write(() => {
        this.user.name       = response.name
        this.user.email      = response.email
        this.user.anonymous  = response.is_anonymous
        this.user.birth_year = response.birth_year
        this.user.zipcode    = response.zipcode === null ? '' : response.zipcode
        this.user.auto_sync  = this.state.auto_sync
      })
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner show={this.state.showSpinner}/>
        <Header title="Account"
                navigator={this.navigator}
                elevation={4}
                showRightIcon={false}
                initial={true}
                onMenuPress={() => this.navigator.navigate('DrawerToggle')}
        />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>PERSONAL</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'E.g, Jane Doe'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    onChangeText={(name) => this.setState({name, userChanges: true})}
                    defaultValue={this.state.name}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
                    blurOnSubmit={true}
                  />
                </View>
                {this.state.errors.name ? <Text style={styles.warning}>{this.state.errors.name}</Text> : null}
              </View>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'E.g, jane@example.com'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    onChangeText={(email) => this.setState({email, userChanges: true})}
                    defaultValue={this.state.email}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
                  />
                </View>
                {this.state.errors.email ? <Text style={styles.warning}>{this.state.errors.email}</Text> : null}
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <View style={styles.row}>
                  <Text style={styles.label}>Zip Code</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'E.g, 37919'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    onChangeText={(zipcode) => this.setState({zipcode, userChanges: true})}
                    defaultValue={this.state.zipcode}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
                  />
                </View>
                {this.state.errors.zipcode ? <Text style={styles.warning}>{this.state.errors.zipcode}</Text> : null}
              </View>
            </View>

            <Text style={styles.title}>PRIVACY</Text>
            <View style={styles.card}>
              <PickerModal
                style={[styles.formGroup]}
                onSelect={(anonymous) => this.setState({anonymous, userChanges: true})}
                initialSelect={this.user.anonymous ? 'Yes' : 'No'}
                choices={['Yes', 'No']}
                header="Anonymous users have their information hidden from other users. Would you like to be anonymous?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Anonymous</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'No'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    value={this.state.anonymous}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                </View>
                {this.state.errors.anonymous ? <Text style={styles.warning}>{this.state.errors.anonymous}</Text> : null}
              </PickerModal>

              <DateModal
                style={[styles.formGroup, styles.noBorder]}
                onSelect={(year) => this.setState({birth_year: year, userChanges: true})}
                header="In what year were you born?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Birth year</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    underlineColorAndroid="transparent"
                    value={this.state.birth_year.toString()}
                    editable={false}
                  />
                </View>
                {this.state.errors.birth_year ?
                  <Text style={styles.warning}>{this.state.errors.birth_year}</Text> : null}
              </DateModal>
            </View>

            <Text style={styles.title}>AUTO SYNCHRONIZE</Text>
            <View style={styles.card}>
              <PickerModal
                style={[styles.formGroup, styles.noBorder]}
                onSelect={(auto_sync) => this.setState({
                  auto_sync  : auto_sync === 'Yes' ? true : false,
                  userChanges: true
                })}
                initialSelect={this.user.auto_sync ? 'Yes' : 'No'}
                choices={['Yes', 'No']}
                header="Auto sync allows TreeSnap to upload observations as soon as you reach a WiFi enabled area. Would you like to activate auto sync?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Activated</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'No'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    value={this.user.auto_sync ? 'Yes' : 'No'}
                    underlineColorAndroid="transparent"
                    editable={false}
                    readOnly={true}
                  />
                </View>
              </PickerModal>
            </View>

            <Text style={styles.title}>PASSWORD</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>Old Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    placeholderTextColor="#aaa"
                    onChangeText={(old_password) => this.setState({old_password, passwordChanges: true})}
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
                    onChangeText={(new_password) => this.setState({new_password, passwordChanges: true})}
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
                      passwordChanges: true
                    })}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.new_password_confirmation ?
                  <Text style={styles.warning}>{this.state.errors.new_password_confirmation}</Text> : null}
              </View>
            </View>

            <Text style={styles.title}>LOG OUT</Text>
            <View style={styles.card}>
              <View style={[styles.formGroup, styles.row, styles.noBorder]}>
                <TouchableOpacity
                  style={[{height: 40, justifyContent: 'center'}]}
                  onPress={() => {
                    User.logout()
                  }}
                >
                  <Text style={[{color: Colors.danger}]}>Press to log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          <View style={styles.column}>
            <TouchableOpacity style={styles.button} onPress={this.submit.bind(this)}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <TouchableOpacity
              style={[styles.button, styles.buttonLink]}
              onPress={() => {
                this.navigator.goBack()
              }}
            >
              <Text style={[styles.buttonText, styles.buttonLinkText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SnackBar ref="snackbar" noticeText={this.state.snackMessage}/>
      </View>
    )
  }
}

AccountScreen.PropTypes = {
  //navigator: PropTypes.object.isRequired
  onLogout: PropTypes.func
}

AccountScreen.defaultProps = {
  onLogout() {
    return false
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
    paddingLeft      : 5,
    marginHorizontal : 5
  },

  row: {
    flex         : 1,
    flexDirection: 'row',
    alignItems   : 'center'
  },

  label: {
    fontSize  : 14,
    color     : '#222',
    fontWeight: 'bold',
    width     : 100
  },

  labelLg: {
    width: 120
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
    color     : '#777',
    fontSize  : 12,
    fontWeight: 'bold',
    padding   : 10
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
