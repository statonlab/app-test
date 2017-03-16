import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

export default class LoginScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Login" navigator={this.props.navigator} showRightIcon={false}/>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.title}>TreeSource</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textField}
              placeholder={"Username"}
              placeholderTextColor="#aaa"
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
            <MKButton style={styles.button}>
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