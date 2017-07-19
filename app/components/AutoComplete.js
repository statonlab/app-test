import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput, Text, Modal, KeyboardAvoidingView, ScrollView} from 'react-native'
import Latin from '../resources/treeNames.js'
import Colors from '../helpers/Colors'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state     = {
      resultList   : [],
      selected     : null,
      animationType: 'fade',
      modalVisible : false,
    }
    this.queryList = Latin
  }

  componentWillMount() {
  }

  /**
   * If entered text matches something, render the table of suggestions
   * @returns {XML}
   */

  open  = () => {
    this.setState({modalVisible: true})
  }
  close = () => {
    this.setState({modalVisible: false})
  }


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
    this.props.onChange(text)
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
      return
    }
// clear the state of resultList
    this.setState({resultList: []})
  }


  render() {
    return (
      <View>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
            <TouchableOpacity
              style={styles.overlay}
              onPress={this.close.bind(this)}
              activeOpacity={.9}
            />
            <View style={styles.container}>
              <View style={{position: 'relative'}}>
                {this.state.resultList.length !== 0 ?
                  <ScrollView style={styles.searchBox}>
                    {this.renderResults()}
                  </ScrollView> : null}
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
                <TouchableOpacity style={styles.button} onPress={this.close}>
                  <Text style={styles.buttonText}>
                    {this.state.cancelText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
        <TouchableOpacity style={this.props.style} onPress={this.open}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

AutoComplete.PropTypes = {
  onChange: PropTypes.func
}

AutoComplete.defaultProps = {}

const styles = StyleSheet.create({
  overlay: {
    position       : 'absolute',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    backgroundColor: Colors.transparentDark
  },

  mainContainer: {
    flex          : 1,
    alignItems    : 'center',
    justifyContent: 'center'
  },
  container    : {
    backgroundColor  : '#fefefe',
    flex             : 0,
    flexDirection    : 'column',
    borderRadius     : 2,
    paddingVertical  : 10,
    paddingHorizontal: 15,
    maxHeight        : 500,
    minWidth         : 300,
    marginHorizontal : 20
  },
  textField    : {
    height           : 40,
    width            : 300,
    borderWidth      : 1,
    borderColor      : '#dedede',
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14,
    backgroundColor  : '#f9f9f9'
  },
  rowView      : {
    flex          : 0,
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
    borderColor   : '#dedede',
    borderWidth   : 1,
    borderRadius  : 2
  },
  searchBox    : {
    flex           : 1,
    padding        : 1,
    width          : 300,
    height         : 200,
    position       : 'absolute',
    bottom         : 0,
    backgroundColor: '#f9f9f9',
    flexDirection  : 'column',
  },
  searchText   : {
    paddingHorizontal: 5,
    paddingVertical  : 10,
  },
  species      : {
    fontStyle  : 'italic',
    marginRight: 0
  }
})
