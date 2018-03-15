import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, Dimensions} from 'react-native'

export default class Tab extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.container, {width: Dimensions.get('window').width}]}>
        {this.props.children}
      </View>
    )
  }

}

Tab.propTypes = {
  title: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
