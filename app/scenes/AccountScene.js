import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, Text, TextInput} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'
import PickerModal from '../components/PickerModal'
import realm from '../db/Schema'
import axios from '../helpers/Axios'
import SnackBar from '../components/SnackBarNotice'
import Spinner from '../components/Spinner'
import DateModal from '../components/DateModal'

export default class AccountScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSpinner  : false,
      name         : '',
      anonymous    : '',
      is_private   : '',
      email        : '',
      zipcode      : '',
      birth_year   : '',
      oldPassword  : '',
      newPassword  : '',
      reNewPassword: '',
      errors       : {
        name         : false,
        anonymous    : false,
        email        : false,
        zipcode      : false,
        is_private   : false,
        birth_year   : false,
        oldPassword  : false,
        newPassword  : false,
        reNewPassword: false
      }
    }

    this.user = realm.objects('User')[0]
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
      is_private: this.user.is_private ? 'Yes' : 'No',
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
      private   : false,
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
    if (this.state.is_private.trim().length === 0) {
      errors.is_private = 'The private field is required'
      hasErrors         = true
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
   * Handle the submit/update button click
   */
  submit() {
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
      is_private  : this.state.is_private.trim() === 'Yes',

      birth_year: this.state.birth_year
    }).then(response => {
      this.refs.snackbar.showBar()
      this.setState({showSpinner: false})
      this.updateRealmUser(response.data.data)
    }).catch(error => {
      switch (error.status) {
        case 500:
          alert('Could not reach server. Make sure you have internet connection.')
          break
        default:
          this.handleValidationErrors(error.response.data.error)
          break
      }
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
      name      : false,
      anonymous : false,
      is_private: false,
      email     : false,
      zipcode   : false,
      birth_year: false
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
        this.user.is_private = response.is_private
        this.user.birth_year = response.birth_year
        this.user.zipcode    = response.zipcode === null ? '' : response.zipcode
      })
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner show={this.state.showSpinner}/>
        <Header title="Account" navigator={this.props.navigator} elevation={4} showRightIcon={false}/>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                    returnKeyType={'next'}
                    onChangeText={(name) => this.setState({name})}
                    defaultValue={this.state.name}
                    underlineColorAndroid="transparent"
                    onBlur={this.validate.bind(this)}
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
                    returnKeyType={'next'}
                    onChangeText={(email) => this.setState({email})}
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
                    returnKeyType={'next'}
                    onChangeText={(zipcode) => this.setState({zipcode})}
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
                onSelect={(anonymous) => this.setState({anonymous})}
                initialSelect={this.user.anonymous ? 'Yes' : 'No'}
                choices={['Yes', 'No']}
                header="Anonymous users have their information hidden from other users.  Scientific partners will still be able to contact you with questions regarding submitted trees. Would you like to be anonymous?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Anonymous</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholder={'No'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'next'}
                    value={this.state.anonymous}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                </View>
                {this.state.errors.anonymous ? <Text style={styles.warning}>{this.state.errors.anonymous}</Text> : null}
              </PickerModal>
              <PickerModal
                style={[styles.formGroup]}
                choices={['Yes', 'No']}
                onSelect={(is_private) => this.setState({is_private})}
                initialSelect={this.user.is_private ? 'Yes' : 'No'}
                header="We take timber theft and the privacy of your submissions seriously.  Trees displayed on our public map are randomly shifted within a 100 mile radius, and positions are shown as inexact circles.
                  Would you like your observations to be private?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Private</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    placeholder={'No'}
                    returnKeyType={'next'}
                    value={this.state.is_private}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                </View>
              </PickerModal>


              <DateModal
                style={[styles.formGroup, styles.noBorder]}
                onSelect={(year) => this.setState({birth_year: year})}
                header="In what year were you born?"
              >
                <View style={styles.row}>
                  <Text style={styles.label}>Birth year</Text>
                  <TextInput
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    value={this.state.birth_year.toString()}
                    editable={false}
                  />
                </View>
                {this.state.errors.birth_year ? <Text style={styles.warning}>{this.state.errors.birth_year}</Text> : null}
              </DateModal>

            </View>

            <Text style={styles.title}>PASSWORD</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>Old Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    onChangeText={(oldPassword) => this.setState({oldPassword})}
                    placeholder={'Old Password'}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.oldPassword ? <Text style={styles.warning}>{this.state.errors.oldPassword}</Text> : null}
              </View>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>New Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    placeholder={'New Password'}
                    onChangeText={(newPassword) => this.setState({newPassword})}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.newPassword ? <Text style={styles.warning}>{this.state.errors.newPassword}</Text> : null}
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <View style={styles.row}>
                  <Text style={[styles.label, styles.labelLg]}>Repeat Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.textField}
                    autoCapitalize={'words'}
                    placeholderTextColor="#aaa"
                    placeholder={'Repeat New Password'}
                    onChangeText={(reNewPassword) => this.setState({reNewPassword})}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {this.state.errors.reNewPassword ? <Text style={styles.warning}>{this.state.errors.reNewPassword}</Text> : null}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.column}>
            <MKButton style={styles.button} onPress={this.submit.bind(this)}>
              <Text style={styles.buttonText}>Update</Text>
            </MKButton>
          </View>
          <View style={styles.column}>
            <MKButton
              style={[styles.button, styles.buttonLink]}
              rippleColor="rgba(0,0,0,0.1)"
              onPress={() => {
                this.props.navigator.pop()
              }}
            >
              <Text style={[styles.buttonText, styles.buttonLinkText]}>Cancel</Text>
            </MKButton>
          </View>
        </View>
        <SnackBar ref="snackbar" noticeText={'Account updated successfully!'} placement="top"/>
      </View>
    )
  }
}

AccountScene.PropTypes = {
  navigator: PropTypes.object.isRequired
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
    fontSize        : 14,
    color           : '#222',
    fontWeight      : 'bold',
    width           : 100,
    borderRightWidth: 1
  },

  labelLg: {
    width: 120
  },

  textField: {
    flex             : 1,
    height           : 40,
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14
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
