import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'
import Axios from 'axios'
import realm from '../db/Schema'
import Spinner from '../components/Spinner'


export default class LoginScene extends Component {

  constructor(props) {
    super(props)

    this.state      = {
      email      : null,
      password   : null,
      showSpinner: false

    }
    this.realm      = realm
    this.loginRules = t.struct({
      email   : t.String,
      password: t.String
    })
  }

  logInUser = () => {
    if (t.validate(this.state, this.loginRules).isValid()) {
      //Check email and password against server, store in realm
      this.loginRequest()
    } else {
      alert("Please enter an email and password")
    }
  }

  loginRequest = () => {
    this.setState({showSpinner: true})

    console.log("executing login request")

    let axios = Axios.create({
      baseURL: 'https://treesource.almsaeedstudio.com/api/v1/',
      timeout: 10000
    })

    axios.post('user/login', {email: this.state.email, password: this.state.password})
      .then(response => {
        console.log("SUCCESS:", response.data.data)
        this.storeUser(response)
        this.setState({showSpinner: false})

        this.props.navigator.pop()
      })
      .catch(error => {
        console.log("ERR", error)
        this.setState({showSpinner: false})
        alert(error)
      })

  }

  storeUser = (response) => {
    this.realm.write(() => {
      // Delete existing users first
      this.realm.deleteAll()
      if (!response.data.data.zipcode) {
        response.data.data.zipcode = ''
      }
      this.realm.create('User', {
        name            : response.data.data.name.toString(),
        email           : response.data.data.email.toString(),
        anonymous       : response.data.data.is_anonymous,
        zipcode         : response.data.data.zipcode,
        api_token       : response.data.data.api_token,
        is_over_thirteen: response.data.data.is_over_thirteen
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner show={this.state.showSpinner}/>
        <Header title={'Login'} navigator={this.props.navigator} showRightIcon={false}/>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.title}>TreeSource</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize={'none'}
              autoFocus={true}
              style={styles.textField}
              placeholder={"Email"}
              placeholderTextColor="#aaa"
              returnKeyType={'next'}
              onChangeText={(email) =>this.setState({email})}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textField}
              placeholder={"Password"}
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              onChangeText={(password) =>this.setState({password})}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.formGroup}>
            <MKButton
              style={styles.button}
              onPress={() => {this.logInUser() }}>
              <Text style={styles.buttonText}>Login</Text>
            </MKButton>
          </View>

          <View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <MKButton>
              <Text style={styles.link}>Forgot your password?</Text>
            </MKButton>
            <MKButton>
              <Text style={[styles.link]}>Register</Text>
            </MKButton>
          </View>

        </View>
      </View>
    )
  }

}

LoginScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  scrollView: {
    flex: 1,
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

  textField: {
    height           : 40,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },

  button: {
    ...(new Elevation(1)),
    flex           : 0,
    borderRadius   : 2,
    backgroundColor: Colors.primary,
    padding        : 10,
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