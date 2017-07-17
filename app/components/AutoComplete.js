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
        results.map((pair) => {
          let species = Object.keys(pair)[0]
          let common = pair[species]
          return(
          <TouchableOpacity
            style={styles.card}
            key={species}
            onPress={null}>
            <View>
              <Text style={styles.cardTitle}>
                {common}
              </Text>
              <Text style={[styles.cardBodyText, styles.italics] }>
                {species}
              </Text>
            </View>
          </TouchableOpacity>
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
      console.log("right now, the result state is ", this.state.resultList)
      let matches = []
      Object.keys(this.queryList).map((species) => {
        let common = this.queryList[species]
        if (common.indexOf(text) > 0 || species.indexOf(text) > 0) {
          matches.push({species: common})
        }
      })
      this.setState({resultList: matches})
      console.log("but we're changing it to", matches)
    }
  }


  render() {
    return (
      <View>
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
        {this.renderResults()}
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
})
