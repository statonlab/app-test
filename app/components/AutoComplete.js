import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput} from 'react-native'
import Latin from '../resources/treeNames.js'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text      : null,
      resultList: null,
      queryList : null,
    }
  }

  componentWillMount() {
  }


  /**
   * If entered text matches something, render the table of suggestions
   * @returns {XML}
   */
  renderResults = () => {
    if (this.state.resultList) {
      return (
        <View>

          null
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.rowView}>
        <TextInput
          style={styles.textField}
          placeholder={'Add new label'}
          placeholderTextColor="#aaa"
          onChangeText={(text) =>
            this.props.onChangeText(text)
          }
          underlineColorAndroid="transparent"
        />
        {this.state.text}
        {this.renderResults}
      </View>
    )
  }
}

AutoComplete.PropTypes = {
  onChangeText: PropTypes.func
}

AutoComplete.defaultProps = {}

const styles = StyleSheet.create({
  textField: {
    height           : 40,
    flex             : 1,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },
  rowView: {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center'
  },
})
