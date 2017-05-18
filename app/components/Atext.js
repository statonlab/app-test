import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native'
import Colors from '../helpers/Colors'

export default class Atext extends Component {
  constructor(props) {
    super(props)
  }


  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url)
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url)
      }
    })
  }


  render() {
    return (
      <Text
        onPress={this.handleClick}
        style={styles.linkText}>
        {this.props.children}
      </Text>
    )
  }
}

Atext.PropTypes = {
  url: PropTypes.string.isRequired
}


const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    color             : Colors.info
  }
})