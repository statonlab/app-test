import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text, StyleSheet, Linking} from 'react-native'
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
        style={[styles.linkText, this.props.style]}>
        {this.props.children}
      </Text>
    )
  }
}

Atext.PropTypes = {
  url  : PropTypes.string.isRequired,
  style: PropTypes.object
}

Atext.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    color             : Colors.primary
  }
})