import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput, Text} from 'react-native'
import Latin from '../resources/treeNames.js'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state     = {
      resultList: [],
    }
    this.queryList = Latin
  }

  componentWillMount() {
  }


  /**
   * If entered text matches something, render the table of suggestions
   * @returns {XML}
   */

  renderResults() {

    if (this.state.resultList.length > 0) {
      let results = this.state.resultList.slice(0, 5)
      return (

        results.forEach(function (arrayItem) {
          let species = Object.keys(arrayItem)[0]
          let common  = arrayItem[species]
      console.log(species, common)
          return (
            <View>
            <TouchableOpacity
              style={styles.card}
              key={species}
              onPress={() => {this.updateText(common)}}>
              <View>
                <Text style={styles.cardTitle}>
                  {common}
                </Text>
                <Text style={[styles.cardBodyText, styles.italics] }>
                  {species}
                </Text>
              </View>
            </TouchableOpacity>
            </View>
          )
        })
      )


    }
    return null
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
      Object.keys(this.queryList).map((species) => {
        let common = this.queryList[species]
        if (common.indexOf(text) > 0 || species.indexOf(text) > 0) {
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
        <View style={styles.rowView}>
          {this.renderResults()}
        </View>
        <View style={styles.rowView}>
          <TextInput
            style={styles.textField}
            placeholder={'Add new label'}
            placeholderTextColor="#aaa"
            onChangeText={(text) =>
              this.updateText(text)
            }
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
  textField: {
    height           : 40,
    width            : 300,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },
  rowView  : {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center'
  },
  searchBox : {
    flex : 0,
    flexDirection: 'column'
  }
})
