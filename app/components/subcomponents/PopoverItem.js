import React, {Component} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'

export default class PopoverItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.item, {borderBottomWidth: this.props.isLast ? 0 : 1}, this.props.style]}
        onPress={() => this.props.onPress()}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

PopoverItem.propTypes = {
  style  : PropTypes.any,
  onPress: PropTypes.func.isRequired,
  isLast : PropTypes.bool
}

PopoverItem.defaultProps = {
  style : {},
  isLast: false
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor: '#eee',
    padding          : 10,
    minWidth         : 150,
    zIndex           : 2001
  }
})
