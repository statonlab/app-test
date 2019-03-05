import React, {Component} from 'react'
import PropTypes from 'prop-types'
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
  Platform,
  Keyboard
} from 'react-native'
import TreeNames from '../resources/treeNames.js'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {ifIphoneX} from 'react-native-iphone-x-helper'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resultList            : TreeNames,
      selected              : null,
      modalVisible          : false,
      searchText            : '',
      textFieldBottomSpacing: 0
    }

    this.events = []
    this.events.push(Keyboard.addListener('keyboardDidShow', () => this.setBottomSpacing(true)))
    this.events.push(Keyboard.addListener('keyboardDidHide', () => this.setBottomSpacing(false)))
  }

  /**
   * Remove event listeners
   */
  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  /**
   * If entered text matches something, render the table of suggestions
   * @returns {{XML}}
   */
  open = () => {
    this.setState({
      resultList  : TreeNames,
      searchText  : '',
      selected    : null,
      modalVisible: true
    })
  }

  /**
   * Close the modal
   */
  close = () => {
    this.setState({modalVisible: false})
  }

  renderResults = () => {
    let results = this.state.resultList

    let sorted = {}
    Object.keys(results).sort().forEach(key => {
      sorted[key] = results[key];
    });

    let keys    = Object.keys(sorted)
    if (keys.length > 0) {
      return keys.map(species => {
          let common = sorted[species]

          return (
            <TouchableOpacity
              key={species}
              onPress={() => this.submit(common)}>
              <View style={styles.rowView}>
                <Text style={styles.searchText}>
                  {Array.isArray(common) ? common[0] : common}
                </Text>
                <Text style={[styles.searchText, styles.species]}>
                  {species}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      )
    }

    return (
      <View style={styles.rowView}>
        <Text style={styles.searchText}>
          No results found.
        </Text>
      </View>
    )
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
    text = text.toLowerCase().trim()

    // return to the default search case
    if (!text) {
      this.setState({resultList: TreeNames})
      return
    }

    let matches = {}

    for (const [species, common] of Object.entries(TreeNames)) {
      if (species.toLowerCase().trim().indexOf(text) > -1) {
        matches[species] = common.join(', ')
        continue
      }

      for (const name of common) {
        if (name.toLowerCase().trim().indexOf(text) > -1) {
          matches[species] = name
          break
        }
      }
    }

    this.setState({resultList: matches})
  }

  setBottomSpacing(keyboardIsOpen) {
    let textFieldBottomSpacing = !keyboardIsOpen ? (ifIphoneX(20) || 5) : 5

    this.setState({textFieldBottomSpacing})
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Modal
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={'fade'}>
          <View style={[{
            paddingVertical: 10,
            backgroundColor: Colors.primary,
            flex           : 0,
            alignItems     : 'center',
            //justifyContent : 'space-between',
            flexDirection  : 'row',
            paddingLeft    : 10,
            ...ifIphoneX({
              paddingTop: 40
            })
          }, new Elevation(2)]}>
            <TouchableOpacity
              style={{paddingRight: 20, paddingTop: 5}}
              onPress={() => {
                this.close()
              }}>
              <Icon name="chevron-left" style={{fontSize: 25}} color="#fff"/>
            </TouchableOpacity>
            <Text style={{color: '#fff', fontWeight: '500', alignSelf: 'center', fontSize: 18}}>
              Select a Tree
            </Text>
          </View>
          <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#f7f7f7'}}
                                behavior={Platform.OS === 'android' ? undefined : 'padding'}>
            <ScrollView style={{flex: 1}} keyboardDismissMode={'on-drag'} keyboardShouldPersistTaps={'never'}>
              {this.renderResults()}
            </ScrollView>
            <View style={[styles.textInputContainer, {paddingBottom: this.state.textFieldBottomSpacing}]}>
              <View style={{flex: 1}}>
                <TextInput
                  style={[styles.textField]}
                  placeholder={'Search or create your own label'}
                  placeholderTextColor="#aaa"
                  onChangeText={searchText => {
                    this.setState({searchText})
                    this.search(searchText)
                  }}
                  value={this.state.selected}
                  underlineColorAndroid="transparent"
                  autoFocus={true}
                  onSubmitEditing={({nativeEvent}) => {
                    let text = nativeEvent.text
                    if (text.length > 0) {
                      this.submit(nativeEvent.text)
                    }
                  }}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity style={styles.button}
                                onPress={() => this.submit(this.state.searchText)}>
                <Text style={styles.buttonText}>
                  Create
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

AutoComplete.propTypes = {
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
    height         : 40,
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
    // flex             : 0,
    flexDirection    : 'column',
    paddingHorizontal: 15,
    paddingVertical  : 10,
    backgroundColor  : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
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
