import React, {Component, PropTypes} from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'

export default class Checkbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      checked: false
    }
  }

  componentDidMount() {
    this.setState({checked: this.props.checked})
  }

  changed() {
    let checked = !this.state.checked
    this.setState({checked})

    this.props.onChange(checked)
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.changed.bind(this)}>
        <Icon name={this.state.checked ? 'checkbox-marked' : 'checkbox-blank-outline'} style={[styles.checkboxIcon, {color: this.state.checked ? Colors.primary : '#aaa'}]}/>
        <Text style={styles.label}>{this.props.label}</Text>
      </TouchableOpacity>
    )
  }

}

Checkbox.PropTypes = {
  label   : PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked : PropTypes.bool
}

Checkbox.defaultProps = {
  checked: false
}

const styles = new StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems   : 'center'
  },

  checkboxIcon: {
    fontSize: 21,
    color   : '#aaa',
    width   : 30
  },

  label: {
    fontWeight: 'bold'
  }
})