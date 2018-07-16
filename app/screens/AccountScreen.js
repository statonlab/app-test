import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
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
import Colors from '../helpers/Colors'
import PickerModal from '../components/PickerModal'
import realm from '../db/Schema'
import axios from '../helpers/Axios'
import SnackBar from '../components/SnackBarNotice'
import Spinner from '../components/Spinner'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import User from '../db/User'
import Icon from 'react-native-vector-icons/Ionicons'
import Errors from '../helpers/Errors'

const isAndroid = Platform.OS === 'android'

export default class AccountScreen extends Screen {
  constructor(props) {
    super(props)

    this.state = {
      anonymous   : '',
      auto_sync   : false,
      units       : 'US',
      errors      : {
        anonymous: false,
        units    : false
      },
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
      isAndroid ? this.navigator.navigate('Landing') : this.navigator.goBack()
      return true
    })

    this.events = [
      DeviceEventEmitter.addListener('userLoggedOut', this.props.onLogout)
    ]

    this.setState({
      anonymous: this.user.anonymous ? 'Yes' : 'No',
      units    : this.user.units
    })

    this.analytics.visitScreen('AccountScreen')
  }

  /**
   * Show validation errors to the user
   *
   * @param errors
   */
  handleValidationErrors(errors) {
    let stateErrors = {
      anonymous: false,
      units    : false
    }

    Object.keys(errors).map(key => {
      stateErrors[key] = errors[key]
    })

    this.setState({errors: stateErrors})
  }

  patch(field, value, realmField) {
    let data    = {
      api_token: this.user.api_token
    }
    data[field] = value

    this.spinner.open()

    axios.patch('/user', data).then(response => {
      this.spinner.close()
      this.setState({snackBarMessage: 'Settings updated successfully'})
      this.refs.snackbar.showBar()
      realm.write(() => {
        this.user[realmField || field] = response.data.data[field]
      })
    }).catch(error => {
      this.spinner.close()
      if (error.response && error.response.status === 422) {
        if (typeof error.response.data.is_anonymous !== 'undefined') {
          error.response.data.anonymous = error.response.data.is_anonymous
        }
        this.handleValidationErrors(error.response.data)
      } else {
        let errors = new Errors(error)
        if (errors.has('general')) {
          alert(errors.first('general'))
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>
        <Header title="Account"
                navigator={this.navigator}
                elevation={4}
                showRightIcon={false}
                initial={isAndroid}
                onMenuPress={() => this.navigator.toggleDrawer()}
        />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>PERSONAL</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      this.navigator.navigate('PersonalInformation')
                    }}
                    style={styles.touchableRow}>
                    <Text style={[styles.label, styles.labelFullWidth]}>Edit Personal Information</Text>
                    <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      this.navigator.navigate('ChangePassword')
                    }}
                    style={styles.touchableRow}>
                    <Text style={[styles.label, styles.labelFullWidth]}>Change Password</Text>
                    <Icon name={'ios-arrow-forward'} size={22} color={'#777'}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.title}>PRIVACY</Text>
          <View style={styles.card}>
            <PickerModal
              style={[styles.formGroup, styles.noBorder]}
              onSelect={(anonymous) => {
                this.setState({anonymous})
                this.patch('is_anonymous', anonymous === 'Yes', 'anonymous')
              }}
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
          </View>

          <Text style={styles.title}>PREFERENCES</Text>
          <View style={styles.card}>
            <PickerModal
              style={[styles.formGroup, styles.noBorder]}
              onSelect={(units) => {
                this.setState({units})
                this.patch('units', units, 'units')
              }}
              initialSelect={this.user.units ? this.user.units : 'US'}
              choices={['US', 'metric']}
              header="Should measurements be taken in US (inches, feet) or metric?"
            >
              <View style={styles.row}>
                <Text style={[styles.label]}>Units</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'US'}
                  placeholderTextColor="#aaa"
                  value={this.state.units}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </View>
              {this.state.errors.units ?
                <Text style={styles.warning}>{this.state.errors.units}</Text> : null}
            </PickerModal>
          </View>

          {/*<Text style={styles.title}>AUTO SYNCHRONIZE</Text>*/}
          {/*<View style={styles.card}>*/}
          {/*<PickerModal*/}
          {/*style={[styles.formGroup, styles.noBorder]}*/}
          {/*onSelect={(auto_sync) => this.setState({*/}
          {/*auto_sync  : auto_sync === 'Yes' ? true : false,*/}
          {/*})}*/}
          {/*initialSelect={this.user.auto_sync ? 'Yes' : 'No'}*/}
          {/*choices={['Yes', 'No']}*/}
          {/*header="Auto sync allows TreeSnap to upload observations as soon as you reach a WiFi enabled area. Would you like to activate auto sync?"*/}
          {/*>*/}
          {/*<View style={styles.row}>*/}
          {/*<Text style={styles.label}>Activated</Text>*/}
          {/*<TextInput*/}
          {/*style={styles.textField}*/}
          {/*autoCapitalize={'words'}*/}
          {/*placeholder={'No'}*/}
          {/*placeholderTextColor="#aaa"*/}
          {/*returnKeyType={'done'}*/}
          {/*value={this.user.auto_sync ? 'Yes' : 'No'}*/}
          {/*underlineColorAndroid="transparent"*/}
          {/*editable={false}*/}
          {/*readOnly={true}*/}
          {/*/>*/}
          {/*</View>*/}
          {/*</PickerModal>*/}
          {/*</View>*/}

          {isAndroid ? <Text style={styles.title}>LOGOUT</Text> : null}
          {isAndroid ? <View style={styles.card}>
            <View style={[styles.formGroup, styles.row, styles.noBorder]}>
              <TouchableOpacity
                style={styles.touchableRow}
                onPress={() => {
                  User.logout()
                }}
              >
                <Text style={[{color: Colors.danger}]}>Logout</Text>
                <Icon name={'ios-log-out'} size={22} color={Colors.danger}/>
              </TouchableOpacity>
            </View>
          </View> : null}
        </KeyboardAwareScrollView>

        <SnackBar ref="snackbar" noticeText={this.state.snackMessage}/>
      </View>
    )
  }
}

AccountScreen.propTypes = {
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

  noBorder: {
    borderBottomWidth: 0
  },

  warning: {
    color    : Colors.danger,
    textAlign: 'center',
    fontSize : 12
  }
})
