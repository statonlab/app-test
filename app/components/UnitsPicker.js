import React, {Component} from 'react'
import {Picker, View, Text} from 'react-native'

export default class UnitsPicker extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <Picker
        selectedValue={this.state.language}
        style={{ height: 50, width: 100 }}
        onValueChange={this.onChange()}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    )
  }
}
