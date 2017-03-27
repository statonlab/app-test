import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, Platform} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Checkbox from '../components/Checkbox'

export default class RegistrationScene extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email          : '',
      password       : '',
      confirmPassword: '',
      isOverThirteen : false,
      zipCode        : ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Register" navigator={this.props.navigator} showRightIcon={false}/>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.title}>TreeSource</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                autoCapitalize={'words'}
                autoFocus={true}
                style={styles.textField}
                placeholder={"E.g, Jane Doe"}
                placeholderTextColor="#aaa"
                returnKeyType={'next'}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize={'none'}
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
                onChange={(checked) => this.setState({isOverThirteen: checked})}
              />
            </View>

            <View style={styles.formGroup}>
              <MKButton style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </MKButton>
            </View>

            <View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
              <MKButton>
                <Text style={styles.link}>Have an account? Login here</Text>
              </MKButton>
            </View>
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