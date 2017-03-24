import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform, Alert} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Checkbox from '../components/Checkbox'
import t from 'tcomb-validation'
import Axios from 'axios'

export default class RegistrationScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name           : 'test',
      email          : 'letsgo@gmail.com',
      password       : 'dogdog42',
      confirmPassword: 'dogdog42',
      is_over_thirteen : true,
      zipCode        : 40508,
      is_anonymous : true
    }

    // const passwordPair = t.subtype(t.struct({
    //   password: t.String,
    //   confirmPassword: t.String
    // }), passwordPair);

     this.registrationRules = t.struct({
      email : t.String, //no validation
      password: t.refinement(t.String, (pw) => pw.length >= 6, "pw"),//ensure password is at least 6 characters
       confirmPassword: t.refinement(t.String, (pw) => pw === this.state.password, "confirmPW"), //ensure matches password
      is_over_thirteen : t.refinement(t.Boolean, (val) => val ,  "overThirteen"),
      // zipCode : t.refinement(t.Number, (n) =>  /^([0-9]{5})(-[0-9]{4})?$/i.test(n), 'zipCode')
       zipCode : t.Number  // might have to convert to a string!
       //above regexp is correctly written
    })
  }
  submitRegistration = () => {
    console.log("submitting registration")
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
      return
    }
    console.log("its valid!");
    this.axiosRequest();

    //transition to confirmation.  I pass email here in the route, need to recieve it in the scene

    alert("Account created");
    this.props.navigator.push({label: 'LoginScene' , email: this.state.email})


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

        let apiToken = response.data.data.api_token;
        //store API token in schema

      })
      .catch(error => {
        console.log('ERR', error);
      });
  }

  validateState = () => {
    return t.validate(this.state, this.registrationRules)
  }


  notifyIncomplete = (validationAttempt) => {
    console.log(validationAttempt);
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
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textField}
              placeholder={"Password"}
              secureTextEntry={true}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.textField}
              placeholder={"Repeat Password"}
              secureTextEntry={true}
              placeholderTextColor="#aaa"
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