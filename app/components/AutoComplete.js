import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput, Text, KeyboardAvoidingView, ScrollView} from 'react-native'
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
    let list = []
    Object.keys(this.queryList).map((species) => {
      let common = this.queryList[species]
        let entry      = {}
        entry[species] = common
        list.push(entry)
      }
    )
    this.setState({resultList: list})
  }


  /**
   * If entered text matches something, render the table of suggestions
   * @returns {XML}
   */

  renderResults = () => {
    if (this.state.resultList.length > 0) {
     // let results = this.state.resultList.slice(0, 5)
      let results = this.state.resultList
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
                <Text style={[styles.searchText, styles.species]}>
                  {species}
                </Text>
              </View>
            </TouchableOpacity>
        )
      }
      )
    }
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
        <ScrollView style={styles.searchBox}>
          {this.state.resultList  ?
          this.renderResults() : null}
        </ScrollView>

        <View style={styles.rowView}>
          <TextInput
            style={styles.textField}
            placeholder={'Type to search'}
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
    alignItems   : 'center',
    justifyContent: 'center',
    borderColor : '#dedede',
    borderWidth : 1,
    borderRadius : 2
  },
  searchBox : {
    flex           : 0,
    padding        : 1,
    //height : 200,
    width : 300,
    height : 200,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#f9f9f9',
    flexDirection  : 'column',
  },
  searchText: {
    paddingHorizontal: 5,
    paddingVertical  : 10,
  },
  species: {
    fontStyle: 'italic',
    marginRight: 0
  }
})
