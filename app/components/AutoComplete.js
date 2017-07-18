import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput, Text} from 'react-native'
import Latin from '../resources/treeNames.js'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state     = {
      resultList: [],
      selected : null
    }
    this.queryList = Latin
  }

  componentWillMount() {
  }


  /**
   * If entered text matches something, render the table of suggestions
   * @returns {XML}
   */

  renderResults = () => {
    if (this.state.resultList.length > 0) {
      let results = this.state.resultList.slice(0, 5)
      return results.map((arrayItem) => {
        let species = Object.keys(arrayItem)[0]
        let common  = arrayItem[species]
        return (
            <TouchableOpacity
              key={species}
              onPress={() => {
                this.updateText(common)
                this.setState({selected: common})
              }}>
              <View style={styles.rowView}>
                <Text style={styles.searchText}>
                  {common}</Text>
                <Text style={styles.searchText}>
                  {species}
                </Text>
              </View>
            </TouchableOpacity>
        )
      })
    }
    //return (<View><Text>Suggestions will appear here</Text></View>)
  }

  updateText = (text) => {
    this.props.onChangeText(text)
    //Query Input against list
    this.searchText(text)
  }

  /**
   * Search the current input text and update the state with an array of matches (species: common name pairs)
   * @param text
   */
  searchText(text) {
    if (text.length > 1) {
      let matches = []
      text        = text.toLowerCase().trim()
      Object.keys(this.queryList).map((species) => {
        let common = this.queryList[species]
        if (common.toLowerCase().trim().indexOf(text) !== -1 || species.toLowerCase().trim().indexOf(text) !== -1) {
          let entry      = {}
          entry[species] = common
          matches.push(entry)
        }
      })
      this.setState({resultList: matches})
    }
  }


  render() {
    return (
      <View>
        <View style={styles.searchBox}>
          {this.state.resultList.length > 0 ?
          this.renderResults() : null}
        </View>
        <View style={styles.rowView}>
          <TextInput
            style={styles.textField}
            placeholder={'Add new label'}
            placeholderTextColor="#aaa"
            onChangeText={(text) =>
              this.updateText(text)
            }
            value={this.state.selected ? this.state.selected : null}

            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    )
  }
}

AutoComplete.PropTypes = {
  onChangeText: PropTypes.func
}

AutoComplete.defaultProps = {}

const styles = StyleSheet.create({
  textField : {
    height           : 40,
    width            : 300,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },
  rowView   : {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center'
  },
  searchBox : {
    flex           : 0,
    padding        : 1,
    backgroundColor: '#f9f9f9',
    flexDirection  : 'column'
  },
  searchText: {
    paddingHorizontal: 5,
    paddingVertical  : 2

  }
})
