import Screen from './Screen'
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React from 'react'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

const isAndroid = Platform.OS === 'android'

export default class AuthScreen extends Screen {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref={ref => this.spinner = ref}/>
        <Header title="Authentification"
                navigator={this.navigator}
                showRightIcon={false}
                initial={isAndroid}
                onMenuPress={() => this.navigator.toggleDrawer()}/>
        <KeyboardAwareScrollView
          keyboardDismissMode={isAndroid ? 'none' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={[styles.formGroup, {marginBottom: 0}]}>
              <Text style={styles.title}>
                I'd like to
              </Text>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity style={styles.button}
                                onPress={() => this.navigator.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity style={styles.button}
                                onPress={() => this.navigator.navigate('Registration')}>
                <Text style={styles.buttonText}>Create a New Account</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

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

  labelWarning: {
    color: Colors.danger
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
    borderColor: Colors.danger
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
