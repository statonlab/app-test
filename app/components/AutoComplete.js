import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, TouchableOpacity, TextInput, Text, Modal, KeyboardAvoidingView, ScrollView} from 'react-native'
import Latin from '../resources/treeNames.js'
import Colors from '../helpers/Colors'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Elevation from '../helpers/Elevation'


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

    let matches = []
    Object.keys(this.queryList).map((species) => {
      let common     = this.queryList[species]
      let entry      = {}
      entry[species] = common
      matches.push(entry)
    })
    this.setState({resultList: matches})
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
      <View style={styles.mainContainer}>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <View style={styles.overlay}>
          <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              enableResetScrollToCoords={false}
              extraScrollHeight={20}
            >
              <View style={styles.container}>
                <TextInput
                  style={styles.textField}
                  placeholder={'Type to search or create your own label'}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) =>
                    this.updateText(text)
                  }
                  value={this.state.selected ? this.state.selected : null}
                  underlineColorAndroid="transparent"
                />
                <ScrollView style={styles.searchBox}>
                  {this.renderResults()}
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={this.close}>
                  <Text style={styles.buttonText}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
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
    flex             : 1,
    flexDirection    : 'column',
    borderRadius     : 2,
    paddingVertical  : 10,
    paddingHorizontal: 15,
    minWidth         : 350,
    marginHorizontal : 20,
    marginTop        : 100
  },
  textField    : {
    height         : 40,
    borderWidth    : 1,
    borderColor    : Colors.black,
    borderRadius   : 2,
    paddingLeft    : 10,
    fontSize       : 14,
    backgroundColor: '#f9f9f9',
    marginBottom   : 3
  },
  rowView      : {
    flex           : 1,
    flexDirection  : 'row',
    alignItems     : 'center',
    justifyContent : 'center',
//    borderColor   : '#dedede',
    //  borderWidth   : 1,
    // borderRadius  : 2,
    margin         : 5,
    paddingVertical: 5,
    backgroundColor: '#fefefe',
    ...(new Elevation(2)),

  },
  searchBox    : {
    flex           : 1,
    padding        : 1,
    maxHeight      : 500,
    minHeight      : 300,
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
  },
  button       : {
    flex           : 0,
    borderRadius   : 2,
    paddingVertical: 5
  },

  buttonText: {
    textAlign : 'right',
    color     : Colors.primary,
    fontWeight: '500'
  },


})

//The styles currently being passed in:
// picker: {
//   flex         : 0,
//     flexDirection: 'row',
//     alignItems   : 'center',
//     width        : undefined
// },