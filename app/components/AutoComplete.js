import React, {Component, PropTypes} from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native'
import Latin from '../resources/treeNames.js'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state     = {
      resultList   : [],
      selected     : null,
      animationType: 'fade',
      modalVisible : false,
      searchText   : ''
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
  open = () => {
    this.setState({searchText: ''})
    this.setState({selected: null})
    this.setState({modalVisible: true})
  }

  close = () => {
    this.setState({modalVisible: false})
  }


  renderResults = () => {
    if (this.state.resultList.length > 0) {
      let results = this.state.resultList
      return results.map(arrayItem => {
          let species = Object.keys(arrayItem)[0]
          let common  = arrayItem[species]
          return (
            <TouchableOpacity
              key={species}
              onPress={() => this.submit(common)}>
              <View style={styles.rowView}>
                <Text style={styles.searchText}>
                  {common}
                </Text>
                <Text style={[styles.searchText, styles.species]}>
                  {species}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      )
    } else {
      return (
        <View style={styles.rowView}>
          <Text style={styles.searchText}>
            No results found.
          </Text>
        </View>
      )
    }
  }

  /**
   * Submit a text and close the modal
   * @param text
   * TODO: Validate zero length novel submissions (lets user submit blank other observations...)
   */
  submit = (text) => {
    this.props.onChange(text)
    this.setState({selected: text})
    this.close()
  }

  /**
   * Search the current input text and update the state with an array of matches (species: common name pairs)
   * @param text
   */
  search = (text) => {
    let matches = []
    text        = text.toLowerCase().trim()
    Object.keys(this.queryList).map((species) => {
      let common = this.queryList[species]
      if (common.toLowerCase().trim().indexOf(text) !== -1 || species.toLowerCase()
          .trim()
          .indexOf(text) !== -1) {
        let entry      = {}
        entry[species] = common
        matches.push(entry)
      }
    })
    this.setState({resultList: matches})
  }


  render() {
    const offset = (Platform.OS === 'android') ? -200 : 0
    return (
      <View style={styles.mainContainer}>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <StatusBar hidden={true}/>
          <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#f7f7f7'}} behavior="padding"
                                keyboardVerticalOffset={offset}>
            <View style={[{
              height         : 40,
              backgroundColor: Colors.primary,
              flex           : 0,
              alignItems     : 'center',
              justifyContent : 'space-between',
              flexDirection  : 'row',
              paddingLeft    : 10
            }, new Elevation(2)]}>
              <TouchableOpacity onPress={() => {
                this.close()
              }}>
                <Icon name="chevron-left" style={{fontSize: 25}} color="#fff"/>
              </TouchableOpacity>
              <Text style={{color: '#fff', fontWeight: '500', alignSelf: 'center'}}>Select a
                tree </Text>
              <Text style={{paddingRight: 10}}/>
            </View>
            <ScrollView style={{flex: 1}}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive">
              {this.renderResults()}
            </ScrollView>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.textField, {flex: 1}]}
                placeholder={'Type to search or create your own label'}
                placeholderTextColor="#aaa"
                onChangeText={searchText => {
                  this.setState({searchText})
                  this.search(searchText)
                }}
                value={this.state.selected}
                underlineColorAndroid="transparent"
                autoFocus={true}
                onSubmitEditing={({nativeEvent}) => {
                  this.submit(nativeEvent.text)
                }}
              />
              <TouchableOpacity style={styles.button}
                                onPress={() => this.submit(this.state.searchText)}>
                <Text style={styles.buttonText}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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

  textInputContainer: {
    flex             : 0,
    flexDirection    : 'row',
    paddingHorizontal: 10,
    paddingVertical  : 5,
    alignItems       : 'center',
    borderTopWidth   : 1,
    borderTopColor   : '#ddd'
  },

  mainContainer: {
    flex          : 1,
    alignItems    : 'center',
    justifyContent: 'center'
  },

  container: {
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

  textField: {
    height         : 35,
    borderWidth    : 1,
    borderColor    : '#ddd',
    borderRadius   : 2,
    paddingLeft    : 10,
    fontSize       : 14,
    backgroundColor: '#fff',
    marginBottom   : 3,
    marginRight    : 10
  },

  rowView: {
    flex             : 1,
    flexDirection    : 'column',
    paddingHorizontal: 15,
    paddingVertical  : 10,
    backgroundColor  : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  searchBox: {
    flex             : 1,
    paddingHorizontal: 10,
    maxHeight        : 500,
    minHeight        : 300,
    backgroundColor  : '#f9f9f9',
    flexDirection    : 'column'
  },

  searchText: {
    color: '#444'
  },

  species: {
    fontStyle : 'italic',
    marginLeft: 10,
    color     : '#777'
  },

  button: {
    flex           : 0,
    borderRadius   : 4,
    backgroundColor: 'transparent',
    alignItems     : 'center',
    justifyContent : 'center',
    width          : 60,
    height         : 35
  },

  buttonText: {
    textAlign : 'right',
    color     : Colors.primary,
    fontWeight: '500'
  },
  submitText: {
    textAlign : 'center',
    color     : Colors.primary,
    fontWeight: '500'
  }


})

//The styles currently being passed in:
// picker: {
//   flex         : 0,
//     flexDirection: 'row',
//     alignItems   : 'center',
//     width        : undefined
// },