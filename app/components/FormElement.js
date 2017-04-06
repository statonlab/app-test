import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, DeviceEventEmitter} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import t from 'tcomb-validation'


export default class FormElement extends Component {

  constructor(props) {
    super(props)

    this.realm = realm

    this.state = {
      warn: false
    }



checkItem = () => {
if (!this.props.validation){
  return true
}
}


  renderElement= ()=> {

  if (this.state.warning) {
    return(
    <View style={styles.formGroup}>
      <Text style={styles.labelWarning}>{this.props.label}</Text>
      <TextInput
        autoCapitalize={'none'}
        style={styles.textFieldWarning}
        placeholder={this.props.placeholder}
        placeholderTextColor="#aaa"
        returnKeyType={'next'}
        onChangeText={(email) => this.setState({email})}
        underlineColorAndroid="transparent"
      />
      <Text style = {styles.warningDescription}> {this.props.warnText}</Text>
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


  render() {
    return (
      this.renderElement()
    )
  }
}

FormElement.propTypes = {
label = PropTypes.string,
placeholder = PropTypes.string,
warnText = PropTypes.string,
validation = PropTypes.object
}

FormElement.DefaultProps = {
  label = "Label",
  placeholder = "",
  warnText = "requred"
}

const styles = StyleSheet.create({
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
  }
 
})
