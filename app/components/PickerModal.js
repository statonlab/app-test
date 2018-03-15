import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, ScrollView, TextInput, StyleSheet, Modal, TouchableOpacity} from 'react-native'
import Colors from '../helpers/Colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import realm from '../db/Schema'
import ImageModal from './ImageModal'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default class PickerModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade',
      modalVisible : false,
      cancelText   : 'CANCEL',
      selected     : 'not set',
      selectedMulti: [],
      choices      : this.props.choices,
      numberVal    : {value: null}, //expect {value: int, confidence: string},
      numberPlaceHolder: 'Tap to enter diameter'
    }
  }

  componentDidMount() {
    this.setState({selected: this.props.initialSelect})
    if (this.props.multiCheck || this.props.freeText || this.props.numeric) {
      this.setState({cancelText: 'CONFIRM'})
    }
    if (this.props.specialText) {
      this.setState({cancelText: 'OK'})
    }
    if (this.props.freeText) {
      this.fetchSelections()
    }
    if (this.props.default) {
      this.onChange(this.props.default)
    }

    // load in entry values if editing
    if (this.props.startingNumeric) {
      let confidence = this.props.startingNumeric[1]
      if (!confidence) {
        confidence = 'Estimated'
      }
      let newState = {
        value     : this.props.startingNumeric[0],
        confidence: confidence
      }
      this.setState({numberVal: newState})
    }
    if (this.props.startingString) {
      if (this.props.multiCheck) {
        this.setState({selectedMulti: JSON.parse(this.props.startingString)})
      }
      this.setState({selected: this.props.startingString})
    }

    if (this.props.numberPlaceHolder) {
      this.setState({numberPlaceHolder: this.props.numberPlaceHolder})
    }


  }

  onChange = (item) => {
    if (this.props.multiCheck) {
      //If not sure, null all other choices
      if (item === 'I\'m not sure') {
        this.setState({selectedMulti: [item]})
        return
      }

      //For multiCheck type, allow for multiple checks, and keep track of them
      let selected = this.state.selectedMulti
      if (selected[0] === 'I\'m not sure') {
        selected = []
      }
      let index = selected.indexOf(item)

      if (index >= 0) {
        selected.splice(index, 1)
      } else {
        selected.push(item)
      }

      this.setState({selectedMulti: selected})

      return
    }

    // For freeText, don't close every character update, and update the display box within the modal.
    if (this.props.freeText) {
      this.props.onSelect(item)
      this.setState({selected: item})

      return
    }

    if (this.props.numeric) {
      //For numeric,d on't close on checking box, need to type in!
      let current        = this.state.numberVal
      current.confidence = item
      this.setState({numberVal: current})
      this.setState({selected: item})
      return
    }

    // For single select
    this.props.onSelect(item)
    this.setState({selected: item})
    this.close()
  }

  open = () => {
    this.setState({modalVisible: true})
  }

  handleNumber = (number) => {
    let current   = this.state.numberVal
    current.value = number
    this.setState({numberVal: current})
  }

  fetchSelections = () => {
    let labels       = []
    let observations = realm.objects('Submission').filtered('name == \'Other\'').sorted('id', true)
    if (observations) {
      observations.map(observation => {
        let customLabel = JSON.parse(observation.meta_data).otherLabel
        if (labels.indexOf(customLabel) < 0) {
          if (labels.length < 5) {
            labels.push(customLabel)
          }
        }
      })
      this.setState({choices: labels})
    }
  }

  close = () => {
    if (this.props.multiCheck) {
      this.props.onSelect(JSON.stringify(this.state.selectedMulti))
    }

    if (this.props.numeric) {
      let number     = this.state.numberVal.value
      let confidence = this.state.numberVal.confidence
      this.props.onSelect(number, confidence)
    }

    this.setState({modalVisible: false})
  }

  /**
   * Returns the text box for freeform text.  This is for the Other label.
   * DEPRECATED
   * Use AutoComplete modal instead
   * @returns {{XML}}
   */
  renderNumeric = () => {
    return (
      <View style={styles.choiceContainer}>
        <View style={[styles.choiceItem]}>
          <TextInput style={styles.textField}
                     keyboardType={'numeric'}
                     underlineColorAndroid={'transparent'}
                     value={this.state.numberVal.value}
                     placeholder={this.state.numberPlaceHolder}
                     onChangeText={(number) => this.handleNumber(number)}/>
          <Text style={{paddingLeft: 30, paddingRight: 30}}>{this.props.units}</Text>
        </View>
      </View>
    )
  }

  /**
   * If JSX is passed to the modal via specialText as an array, loop through and render it.
   */
  renderJSXText() {
    if (this.props.specialText) {
      return (
        <ScrollView>
          {this.props.specialText.map((text, index) => {
            return (
              <View key={index}>
                {text}
              </View>
            )
          })}
        </ScrollView>
      )
    }
  }

  renderOptions(choice, index) {
    const uncheckedBox = (<Icon name="checkbox-blank-outline" style={styles.icon}/>)
    const checkedBox   = (
      <Icon name="checkbox-marked" style={[styles.icon, {color: Colors.primary}]}/>
    )

    if (this.props.multiCheck) {
      return (
        <TouchableOpacity
          style={styles.choiceContainer}
          key={index}
          onPress={() => {
            this.onChange(choice)
          }}>
          <View style={styles.choiceItem}>
            {this.state.selectedMulti.indexOf(choice) >= 0 ? checkedBox : uncheckedBox}
            <Text style={styles.choiceText}>
              {choice}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={styles.choiceContainer}
        key={index}
        onPress={() => {
          this.onChange(choice)
        }}>
        <View style={styles.choiceItem}>
          {this.state.selected === choice ? checkedBox : uncheckedBox}
          <Text style={styles.choiceText}>
            {choice}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }


  render() {
    return (
      <View>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer} bounces={false} keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={styles.overlay}
              onPress={this.close.bind(this)}
              activeOpacity={.9}
            />
            <View style={styles.container}>
              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                  {this.props.header}
                </Text>
                {this.props.images.length === 0 ? null :
                  <View style={styles.iconsContainer}>
                    <ImageModal images={this.props.images}
                                captions={this.props.captions ? this.props.captions : null}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="camera-burst" size={18} color={Colors.primary}/>
                        <Text style={{
                          color     : Colors.primary,
                          fontWeight: 'bold',
                          fontSize  : 12,
                          marginLeft: 5,
                          height    : 16
                        }}>
                          SHOW EXAMPLES
                        </Text>
                      </View>
                    </ImageModal>
                  </View>
                }
              </View>

              <View style={[styles.modalChoices]}>
                {this.state.choices.map(this.renderOptions.bind(this))}
              </View>
              {this.props.specialText ? this.renderJSXText() : null}
              {this.props.numeric ? this.renderNumeric() : null}
              <TouchableOpacity style={styles.button} onPress={this.close}>
                <Text style={styles.buttonText}>
                  {this.state.cancelText}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Modal>

        <TouchableOpacity onPress={this.open}>
          <View pointerEvents="none" style={this.props.style}>
            {this.props.children}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

PickerModal.propTypes = {
  ...View.propTypes,
  choices        : PropTypes.array,
  header         : PropTypes.string,
  onSelect       : PropTypes.func,
  // style          : PropTypes.style,
  initialSelect  : PropTypes.string,
  multiCheck     : PropTypes.bool,
  numeric        : PropTypes.bool,
  units          : PropTypes.string, //units to display for numeric input
  numberPlaceHolder : PropTypes.string,
  freeText       : PropTypes.bool,
  images         : PropTypes.array,
  captions       : PropTypes.array,
  specialText    : PropTypes.array,
  default        : PropTypes.string,
  //The following 3 props allow pre-existing values (IE from edit) to be passed into the modal.
  startingNumeric: PropTypes.array,
  startingString : PropTypes.string
}

PickerModal.defaultProps = {
  choices      : [],
  numberPlaceHolder: 'Tap to enter diameter',
  header       : 'default header',
  onSelect     : () => {
  },
  initialSelect: '',
  multiCheck   : false,
  freeText     : false,
  images       : [],
  numeric      : false
}

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

  container: {
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

  headTextBox: {
    flex        : 0,
    marginBottom: 10
  },

  headerQuestionText: {
    flex      : 0,
    textAlign : 'left',
    fontWeight: '500',
    fontSize  : 16,
    color     : '#222'
  },

  modalChoices: {
    flex        : 0,
    marginBottom: 10
  },

  choiceContainer: {
    flex           : 0,
    flexDirection  : 'row',
    alignItems     : 'center',
    paddingVertical: 5
  },

  choiceItem: {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center'
  },

  choiceText: {
    flex       : 1,
    color      : '#222',
    textAlign  : 'left',
    paddingLeft: 15,
    fontWeight : '500',
    fontSize   : 16,
    flexWrap   : 'wrap'

  },

  button: {
    flex        : 0,
    borderRadius: 2,
    padding     : 10
  },

  buttonText: {
    textAlign : 'right',
    color     : Colors.primary,
    fontWeight: '500'
  },

  icon: {
    fontSize : 20,
    color    : '#aaa',
    marginTop: 5
  },

  iconTI: {
    fontSize  : 20,
    color     : '#aaa',
    marginTop : 5,
    marginLeft: 15
  },

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

  buttonAlt: {
    borderRadius   : 2,
    height         : 40,
    flex           : 1,
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: '#fff'
  },

  iconsContainer: {
    paddingTop       : 10,
    paddingHorizontal: 5
  }
})
