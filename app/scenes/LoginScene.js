import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'
import Axios from 'axios'
import Users from '../API/users.js'


export default class LoginScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }
//    Route::get('/user', 'UsersController@show');

  putRequest = () => {
    console.log("executing put request");
    Axios.get('http://treesource.app/user', {user: 'bradford.condon@uky.edu'})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("logging error:");
        console.log(error);
      });

  }


  // loadObservations() {
  //   axios.get('/observations').then(response => {
  //     // Setup the observations to be rendered into markers
  //     let markers = []
  //
  //     response.data.data.map(observation => {
  //       markers.push({
  //         title: observation.observation_category,
  //         images: observation.images,
  //         position: {
  //           latitude: observation.location.latitude,
  //           longitude: observation.location.longitude
  //         },
  //         owner: observation.user.name
  //       })
  //     })
  //
  //     // Add the markers to the state
  //     this.setState({markers})
  //
  //   }).catch(error => {
  //     console.log(error)
  //   })
  // }




  render() {
    return (
      <View style={styles.container}>
        <Header title="Login" navigator={this.props.navigator} showRightIcon={false}/>
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
            <MKButton
              style={styles.button}
              onPress={() => {this.tryLogin() }}>
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