import React from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  DeviceEventEmitter,
  Alert
} from 'react-native'
import Screen from './Screen'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import realm from '../db/Schema'
import axios from '../helpers/Axios'
import SnackBar from '../components/SnackBarNotice'
import Spinner from '../components/Spinner'
import DateModal from '../components/DateModal'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import User from '../db/User'

const isAndroid = Platform.OS === 'android'

export default class PersonalInformationScreen extends Screen {
  constructor(props) {
    super(props)

    this.state = {
      name        : '',
      email       : '',
      zipcode     : '',
      birth_year  : '',
      errors      : {
        name      : false,
        email     : false,
        zipcode   : false,
        birth_year: false
      },
      changes     : false,
      snackMessage: 'Account updated successfully'
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

    this.setState({
      name      : this.user.name,
      email     : this.user.email,
      zipcode   : this.user.zipcode,
      anonymous : this.user.anonymous ? 'Yes' : 'No',
      birth_year: this.user.birth_year,
      units     : this.user.units
    })

    this.analytics.visitScreen('PersonalInformationScreen')
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
   * Update user profile.
   */
  submit() {
    if (!this.validate()) {
      return
    }

    this.spinner.open()

    axios.put('user', {
      api_token   : this.user.api_token,
      name        : this.state.name,
      email       : this.state.email,
      zipcode     : this.state.zipcode,
      is_anonymous: this.user.anonymous,
      birth_year  : this.state.birth_year,
      units       : this.user.units,
      snackMessage: 'Profile updated successfully'
    }).then(response => {
      this.refs.snackbar.showBar()
      this.setState({changes: false})
      this.updateRealmUser(response.data.data)
      this.spinner.close()
    }).catch(error => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            Alert.alert('Server Error', 'Please try again later.')
            console.log(error.response)
            break
          default:
            this.handleValidationErrors(error.response.data.error)
            break
        }
      } else {
        Alert.alert('Network Error', 'Could not reach server. Make sure you have internet connection.')
      }

      this.spinner.close()
    })
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
        this.user.units      = response.units
        this.user.auto_sync  = true
      })
    } catch (error) {
      console.warn(error)
    }
  }

  /**
   * Show validation errors to the user
   *
   * @param errors
   */
  handleValidationErrors(errors) {
    let stateErrors = {
      name      : false,
      email     : false,
      zipcode   : false,
      birth_year: false
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
        <Header title="Personal Information"
                navigator={this.navigator}
                showRightIcon={false}
                initial={false}
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
                    onChangeText={(name) => this.setState({name, changes: true})}
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
                    keyboardType={'email-address'}
                    onChangeText={(email) => this.setState({email, changes: true})}
                    defaultValue={this.state.email}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
                  />
                </View>
                {this.state.errors.email ? <Text style={styles.warning}>{this.state.errors.email}</Text> : null}
              </View>
              <View style={[styles.formGroup]}>
                <View style={styles.row}>
                  <Text style={styles.label}>Zip Code</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'E.g, 37919'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'done'}
                    onChangeText={(zipcode) => this.setState({zipcode, changes: true})}
                    defaultValue={this.state.zipcode}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
                  />
                </View>
                {this.state.errors.zipcode ? <Text style={styles.warning}>{this.state.errors.zipcode}</Text> : null}
              </View>
              <DateModal
                style={[styles.formGroup, styles.noBorder]}
                onSelect={(year) => this.setState({birth_year: year, changes: true})}
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
