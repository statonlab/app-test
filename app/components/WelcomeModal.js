import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Modal,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import realm from '../db/Schema'
import Colors from '../helpers/Colors'
import {ifIphoneX} from 'react-native-iphone-x-helper'
import DateModal from './DateModal'
import AText from './Atext'
import User from '../db/User'
import Elevation from '../helpers/Elevation'
import Spinner from '../components/Spinner'

export default class WelcomeModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show         : false,
      showFooter   : true,
      currentPage  : 0,
      lastPageIndex: 0,
      name         : '',
      email        : '',
      password     : '',
      dateOfBirth  : new Date().getFullYear() - 13,
      showPassword : false,
      loading      : false
    }
  }

  componentWillMount() {
    let shown = realm.objects('Guide').filtered('screen == "WelcomeModal"').length

    if (shown) {
      return
    }

    realm.write(() => {
      realm.create('Guide', {
        screen: 'WelcomeModal',
        version: 1
      })
    })

    this.setState({
      show         : true,
      lastPageIndex: this.getPages().length - 1
    })
  }

  getPages() {
    let {width}   = Dimensions.get('window')
    let pageStyle = [
      style.body,
      {width}
    ]


    let pages = [
      // Page 1
      <View style={pageStyle} key="page_1">
        <Image source={require('../img/ts-logo-512.png')}
               style={style.image}/>
        <Text style={style.title}>Welcome to TreeSnap!</Text>
        <Text style={style.bodyText}>
          Welcome to TreeSnap! Submit trees using TreeSnap and Scientists can use the data
          to improve breeding programs and save threatened tree species.
        </Text>
      </View>,

      // Page 2
      <View style={pageStyle} key="page_2">
        <Image source={require('../img/photo-camera.png')}
               style={style.image}/>
        <Text style={style.title}>Observe</Text>
        <Text style={style.bodyText}>
          Found an interesting tree? Snap a picture, answer the additional
          questions and upload it to TreeSnap.
        </Text>
      </View>,

      // Page 3
      <View style={pageStyle} key="page_3">
        <Image source={require('../img/padlock.png')}
               style={style.image}/>
        <Text style={style.title}>Privacy</Text>
        <Text style={style.bodyText}>
          We value your privacy! The location of reported
          trees is automatically protected from prying eyes
          by providing accurate coordinates only to authorized
          users such as scientists and administrators.
        </Text>
      </View>
    ]

    if (!User.loggedIn()) {
      // Register Page
      pages.push(this.getRegistrationPage(pageStyle, width))
    }

    return pages
  }

  register() {
    this.setState({loading: true})

    User.register({
      name      : this.state.name,
      email     : this.state.email,
      password  : this.state.password,
      birth_year: this.state.dateOfBirth
    }).then(response => {
      this.setState({loading: false})
      this.close()
    }).catch(error => {
      this.setState({loading: false})
      let response = error.response

      if (!response) {
        Alert.alert('Network Error', 'Please make sure you are connect to the internet.', {
          OK: {
            onPress: () => {
            }
          }
        })

        return
      }

      if (response.status === 422) {
        let key     = Object.keys(response.data)[0]
        let message = response.data[key][0]
        Alert.alert('Invalid', message, {
          OK: {
            onPress: () => {
            }
          }
        })
        return
      }

      if(response.status === 500) {
        Alert.alert('Server Error', 'Oops! Something went wrong on our part. Please try again later.')
      }
    })
  }

  close() {
    this.setState({show: false})
    this.props.onDone()
  }

  getRegistrationPage(pageStyle, width) {
    return (
      <KeyboardAvoidingView style={[pageStyle, {paddingTop: 50, paddingHorizontal: 10}]}
                            key="page_4">
        <ScrollView style={{flex: 1}}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}>
          <Text style={style.title}>Take Action Today!</Text>
          <Text style={[style.bodyText, {
            marginBottom: 22,
            alignItems  : 'flex-start'
          }]}>
            Register an account now and start snapping
          </Text>
          <View style={style.form}>
            <View style={style.formGroup}>
              <Text style={style.label}>Name</Text>
              <TextInput
                style={[style.input, {width: width - 60}]}
                underlineColorAndroid="transparent"
                returnKeyType="next"
                keyboardType="email-address"
                placeholder="Name"
                value={this.state.name}
                onChangeText={name => this.setState({name})}
                placeholderColor="#aaa"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.emailInput.focus()
                }}
              />
            </View>
            <View style={style.formGroup}>
              <Text style={style.label}>Email</Text>
              <TextInput
                style={[style.input]}
                underlineColorAndroid="transparent"
                returnKeyType="next"
                placeholder="Email Address"
                value={this.state.email}
                onChangeText={email => this.setState({email})}
                placeholderColor="#aaa"
                ref={ref => this.emailInput = ref}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                }}
              />
            </View>
            <View style={style.formGroup}>
              <Text style={style.label}>Password</Text>
              <TextInput
                style={[style.input]}
                placeholder="Password"
                secureTextEntry={!this.state.showPassword}
                value={this.state.password}
                onChangeText={password => this.setState({password})}
                ref={ref => this.passwordInput = ref}
                returnKeyType="next"
                underlineColorAndroid="transparent"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  this.dateInput.open()
                }}
              />
              <TouchableOpacity onPress={() => this.setState({showPassword: !this.state.showPassword})}>
                <Text style={[style.label, {
                  color     : Colors.primary,
                  fontSize  : 12,
                  fontWeight: 'normal',
                  textAlign : 'right'
                }]}>
                  {this.state.showPassword ? 'HIDE' : 'SHOW'}
                </Text>
              </TouchableOpacity>
            </View>
            <DateModal
              ref={ref => this.dateInput = ref}
              onSelect={dateOfBirth => this.setState({dateOfBirth})}
              selectedYear={this.state.dateOfBirth}
              style={{flex: 1}}
            >
              <View style={[style.formGroup, {borderBottomWidth: 0, height: 41}]}>
                <Text style={style.label}>Birth Year</Text>
                <Text style={[style.input, {height: undefined, justifyContent: 'center'}]}>
                  {this.state.dateOfBirth}
                </Text>
              </View>
            </DateModal>
          </View>
          <Text style={style.mutedText}>
            By pressing sign up, you agree to our <AText url="https://treesnap.org/terms-of-use">terms of use</AText>.
            Users under 13 years old must obtain permission from a parent or a guardian.
          </Text>
          <View style={[style.row, {marginTop: 10}]}>
            <TouchableOpacity style={[style.button, style.isPrimary]} onPress={this.register.bind(this)}>
              <Text style={[style.primaryText, {textAlign: 'center'}]}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[style.button, {paddingHorizontal: 0}]}
                              onPress={() => {
                                this.setState({show: false})
                                this.props.onLoginRequest()
                              }}>
              <Text style={style.muteLink}>
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  next() {
    let {width}     = Dimensions.get('window')
    let currentPage = this.state.currentPage

    if (this.state.lastPageIndex === currentPage) {
      this.close()
      return
    }

    currentPage++
    this.scrollview.scrollTo({
      x       : width * currentPage,
      y       : 0,
      animated: true
    })

    this.setState({currentPage})
  }

  back() {
    let {width}     = Dimensions.get('window')
    let currentPage = this.state.currentPage

    if (currentPage === 0) {
      return
    }

    currentPage--
    this.scrollview.scrollTo({
      x       : width * currentPage,
      y       : 0,
      animated: true
    })

    this.setState({currentPage})
  }

  onScroll(event) {
    let {x}     = event.nativeEvent.contentOffset
    let {width} = Dimensions.get('window')

    this.setState({
      currentPage: Platform.OS === 'android' ? Math.ceil((x <= width ? x : x - width) / (width)) : Math.ceil(x / width)
    })
  }

  render() {
    let hasBackPages = this.state.currentPage !== 0
    let hasMorePages = this.state.currentPage !== this.state.lastPageIndex
    let doneText     = User.loggedIn() ? 'Got it' : 'Register Later'
    let doneButtonStyle
    if (User.loggedIn()) {
      doneButtonStyle = style.isPrimary
    } else {
      if (hasMorePages) {
        doneButtonStyle = style.isPrimary
      }
    }
    return (
      <Modal visible={this.state.show}
             onRequestClose={() => {
               return
             }}
             animationType="slide">
        <StatusBar backgroundColor="#25897d"
                   barStyle="dark-content"/>
        <View style={style.container}>
          <ScrollView
            ref={ref => this.scrollview = ref}
            horizontal={true}
            pagingEnabled={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={this.onScroll.bind(this)}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}
          >
            {this.getPages.call(this)}
          </ScrollView>
          {this.state.showFooter ?
            <View style={[style.footer]}>
              <TouchableOpacity
                activeOpacity={hasBackPages ? .2 : 1}
                style={[style.button, hasBackPages ? null : style.isDisabled]}
                onPress={this.back.bind(this)}>
                <Text style={hasBackPages ? {color: '#fff'} : style.disabledText}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[style.button, doneButtonStyle]}
                                onPress={this.next.bind(this)}>
                <Text style={style.primaryText}>{hasMorePages ? 'Next' : doneText}</Text>
              </TouchableOpacity>
            </View>
            : null}
        </View>
        <Spinner show={this.state.loading}/>
      </Modal>
    )
  }
}

WelcomeModal.propTypes = {
  onLoginRequest: PropTypes.func.isRequired,
  onDone        : PropTypes.func.isRequired
}

const style = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5',
    justifyContent : 'space-between'
  },

  body: {
    flex             : 1,
    justifyContent   : 'center',
    alignItems       : 'center',
    paddingHorizontal: 30,
    paddingBottom    : 10,
    ...ifIphoneX({
      paddingTop: 45
    }, {
      paddingTop: 30
    })
  },

  footer: {
    justifyContent : 'space-between',
    flexDirection  : 'row',
    padding        : 10,
    backgroundColor: '#212121',
    ...ifIphoneX({
      paddingBottom: 25
    })
  },

  image: {
    width       : 128,
    height      : 128,
    resizeMode  : 'contain',
    marginBottom: 22
  },

  title: {
    color     : '#222',
    fontWeight: '500',
    fontSize  : 16,
    textAlign : 'center'
  },

  bodyText: {
    color     : '#444',
    marginTop : 22,
    fontSize  : 14,
    textAlign : 'center',
    lineHeight: 20
  },

  button: {
    paddingVertical  : 10,
    paddingHorizontal: 20,
    borderRadius     : 4
  },

  buttonText: {
    fontSize: 12
  },

  isPrimary: {
    backgroundColor: Colors.primary,
    ...(new Elevation(2))
  },

  primaryText: {
    color: Colors.primaryText
  },

  isDisabled: {
    backgroundColor: 'transparent'
  },

  disabledText: {
    color: '#555'
  },

  form: {
    backgroundColor: '#fff',
    marginBottom   : 10,
    borderRadius   : 5,
    borderWidth    : 1,
    borderColor    : '#ddd'
  },

  formGroup: {
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10
  },

  label: {
    color     : '#444',
    fontWeight: '500',
    fontSize  : 12,
    width     : 70
  },

  input: {
    flex           : 1,
    borderWidth    : 0,
    borderColor    : '#ddd',
    padding        : 10,
    color          : '#777',
    backgroundColor: 'transparent',
    fontSize       : 12,
    borderRadius   : 5,
    height         : 40
  },

  mutedText: {
    fontSize: 12,
    color   : '#888'
  },

  row: {
    justifyContent: 'space-between',
    flexDirection : 'row',
    alignItems    : 'center'
  },

  muteLink: {
    color             : '#666',
    textDecorationLine: 'underline',
    fontSize          : 14
  }
})