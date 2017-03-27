import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform, Alert} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Checkbox from '../components/Checkbox'
import t from 'tcomb-validation'
import Axios from 'axios'
import {UserSchema} from '../db/Schema'
import Realm from 'realm'


export default class RegistrationScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name           : 'default',
      email          : 'wiggle@wiggle.com',
      password       : 'dogdog42',
      confirmPassword: 'dogdog42',
      is_over_thirteen : true,
      zipcode        : 40508,
      is_anonymous : true
    }

    let realm = new Realm({
      schema: [UserSchema]
    })



    this.registrationRules = t.struct({
      email : t.String, //no validation
      password: t.refinement(t.String, (pw) => pw.length >= 6, "pw"),//ensure password is at least 6 characters
       confirmPassword: t.refinement(t.String, (pw) => pw === this.state.password, "confirmPW"), //ensure matches password
      is_over_thirteen : t.refinement(t.Boolean, (val) => val ,  "overThirteen"),
      // zipCode : t.refinement(t.Number, (n) =>  /^([0-9]{5})(-[0-9]{4})?$/i.test(n), 'zipCode')
       zipcode : t.Number  // might have to convert to a string!
       //above regexp is correctly written
    })
  }
  submitRegistration = () => {

    console.log("submitting registration")
    console.log(this.state)
    if (!this.validateState().isValid()) {
      // this.notifyIncomplete(this.validateState())
      console.log(this.validateState())
      return
    }
   let response =  this.axiosRequest();
  if (response) {
    alert("Success!  Registered with {response.email}!  Writing local db entry to realm.")

    this.writeToRealm(response);
    this.props.navigator.push({label: 'LoginScene' , email: this.state.email})

  }
    //transition to confirmation.  I pass email here in the route, need to receive it in the scene
}

writeToRealm = (responseFull) => {
    console.log("writing to realm");

  realm.write((responseFull) => {
    let response = responseFull.data.data
    realm.create('User', {
      id              : response.id.toString(),
      name            : response.name.toString(),
      email           : response.email.toString(),
      anonymous       : response.is_anonymous,
      zipcode         : response.zipcode,
      api_token       : response.api_token,
      is_over_thirteen: response.is_over_thirteen
    })
  })
}


  axiosRequest = () => {

    let request = this.state;
    let axios = Axios.create({
      baseURL: 'http://treesource.app/api/v1/',
      timeout: 10000
    })

    axios.post('users', request)
      .then(response => {
        console.log('RES', response.data);
    return(response);
      })
      .catch(error => {
        console.log('ERR', error);
        alert(error[0]);
      });
  }

  validateState = () => {
    return t.validate(this.state, this.registrationRules)
  }


  notifyIncomplete = (validationAttempt) => {
  }

  updateText = () => {
    return
  }


  render() {
    return (
      <View style={styles.container}>
        <Header title="Register" navigator={this.props.navigator} showRightIcon={false}/>
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.title}>TreeSource</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize={'none'}
              autoFocus={true}
              style={styles.textField}
              placeholder={"E.g, example@email.com"}
              placeholderTextColor="#aaa"
              returnKeyType={'next'}
              onChangeText={(email) =>this.setState({email})}
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

            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.textField}
              placeholder={"Repeat Password"}
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              onChangeText={(confirmPassword) =>this.setState({confirmPassword})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Zip Code (Optional)</Text>
            <TextInput
              autoCapitalize={'none'}
              style={styles.textField}
              placeholder={"E.g, 37919"}
              placeholderTextColor="#aaa"
              returnKeyType={'next'}
              onChangeText={(zipcode) =>this.setState({zipcode})}
            />
          </View>

          <View style={styles.formGroup}>
            <Checkbox
              label="I am over 13 years old"
              onChange={(checked) => this.setState({is_over_thirteen: checked})}
            />
          </View>

          <View style={styles.formGroup}>
            <MKButton style={styles.button}
              onPress={() => {this.submitRegistration() }}>
              <Text style={styles.buttonText}>Register</Text>
            </MKButton>
          </View>

          <View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <MKButton>
              <Text style={styles.link}>Have an account? Login here</Text>
            </MKButton>
          </View>

        </ScrollView>
      </View>
    )
  }

}

RegistrationScene.PropTypes = {
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