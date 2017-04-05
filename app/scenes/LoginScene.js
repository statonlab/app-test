import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, DeviceEventEmitter} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'
import axios from '../helpers/Axios'
import realm from '../db/Schema'
import Spinner from '../components/Spinner'

export default class LoginScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email      : null,
      password   : null,
      showSpinner: false,
      emailWarning : false,
      passwordWarning: false
    }

    this.realm = realm

    this.loginRules = t.struct({
      email   : t.String,
      password: t.String
    })
  }

  logInUser = () => {
    this.resetFormWarnings()

    let submission = t.validate(this.state, this.loginRules)
    if (submission.isValid()) {
      // Check email and password against server, store in realm
      this.loginRequest()
    } else {
      this.handleError(submission)
    }
  }
resetFormWarnings = () => {
    this.setState({emailWarning: false, passwordWarning: false})
}

  loginRequest = () => {
    this.setState({showSpinner: true})

    axios.post('user/login', {
      email   : this.state.email,
      password: this.state.password
    }).then(response => {
      this.storeUser(response)
      this.setState({showSpinner: false})

      DeviceEventEmitter.emit('userLoggedIn')

      this.props.navigator.pop()
    }).catch(error => {
      this.setState({showSpinner: false})
      alert(error)
    })
  }

  handleError = (submission) =>{
    let errors = submission.errors
    let errorList= []
    errors.map((error) => {
      switch(error.path[0]){
        case 'email':
          this.setState({emailWarning:true})
          errorList.push("invalid email")
          break;
        case 'password':
          this.setState({passwordWarning:true})
          errorList.push("invalid password")

          break;
      }
    })
    if (errorList) {
      alert(errorList.join("\n"))
    }
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

    // this.pullServerObservations()
  }


  pullServerObservations = () => {
    let myToken = realm.objects('User')[0].api_token

    axios.get('observations', {api_token: myToken})
      .then(response => {

        let data = response.data.data

        for (observationID in data) {

          let observation = data[observationID]
          if (realm.objects('Submission').filtered(`id == ${observation.id}`).length === 0) {

            let obsToStore = {
              id       : observation.id,
              name     : observation.observation_category,
              images   : observation.images.toString(),
              location : observation.location,
              date     : observation.date.date.toString(),
              synced   : true,
              meta_data: JSON.stringify(observation.meta_data)
            }
            realm.write(() => {
              realm.create('Submission', obsToStore)
            })
          }
        }

      })
      .catch(error => {
        console.log('Error:', error)
      })
  }

  renderEmail() {

  if (this.state.emailWarning) {
    return(
    <View style={styles.formGroup}>
      <Text style={styles.labelWarning}>Email</Text>
      <TextInput
        autoCapitalize={'none'}
        style={styles.textFieldWarning}
        placeholder={'Email'}
        placeholderTextColor="#aaa"
        returnKeyType={'next'}
        onChangeText={(email) => this.setState({email})}
        underlineColorAndroid="transparent"
      />
    </View>
    )
  }
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        autoCapitalize={'none'}
        style={styles.textField}
        placeholder={'Email'}
        placeholderTextColor="#aaa"
        returnKeyType={'next'}
        onChangeText={(email) => this.setState({email})}
        underlineColorAndroid="transparent"
      />
    </View>
  )
  }
  renderPassword() {
    if (this.state.passwordWarning){
      return(
        <View style={styles.formGroup}>
          <Text style={styles.labelWarning}>Password</Text>
          <TextInput
            style={styles.textFieldWarning}
            placeholder={'Password'}
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            onChangeText={(password) => this.setState({password})}
            underlineColorAndroid="transparent"
          />
        </View>
      )
    }

    return(
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.textField}
          placeholder={'Password'}
          secureTextEntry={true}
          placeholderTextColor="#aaa"
          onChangeText={(password) => this.setState({password})}
          underlineColorAndroid="transparent"
        />
      </View>
    )

  }


  render() {
    return (
      <View style={styles.container}>
        <Spinner show={this.state.showSpinner}/>
        <Header title={'Login'} navigator={this.props.navigator} showRightIcon={false}/>
        <ScrollView keyboardDismissMode={'on-drag'}>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.title}>TreeSource</Text>
            </View>
            {this.renderEmail()}
            {this.renderPassword()}

            <View style={styles.formGroup}>
              <MKButton
                style={styles.button}
                onPress={() => {
                  this.logInUser()
                }}>
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
        </ScrollView>
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
    fontWeight  : 'bold',
    fontSize    : 14,
    marginBottom: 10,
    color       : Colors.danger
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
    borderColor: Colors.danger,
    height           : 40,
    borderWidth      : 1,
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
