import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native'

import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class PickerModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade',
      modalVisible : false,
      cancelText   : "CANCEL",
      selected     : 'not set',
      selectedMulti : {}
    }
  }

  componentDidMount() {
    this.setState({selected: this.props.initialSelect})
    if (this.props.modalType == 'multiCheck'){
      this.setState({cancelText : "CONFIRM"})
    }
  }

  onChange = (item) => {
    if (this.props.modalType =='multiCheck'){
      //For multiCheck type, allow for multiple checks, and keep track of them
    selectedOpts = this.state.selectedMulti
      if (selectedOpts[item]) {
      delete selectedOpts[item]
      }else{
      selectedOpts[item] = true
        this.setState({selectedMulti: selectedOpts})
        console.log (this.state.selectedMulti)
        console.log (this.state.selectedMulti[item])

      }

    }else{
      this.props.onSelect(item)
      this.setState({selected: item})
      this.close()
    }
  }

  open = () => {
    this.setState({modalVisible: true})
  }

  close = () => {
    this.setState({modalVisible: false})
  }

  renderOptions(choice, index) {
    const uncheckedBox = (<Icon name="checkbox-blank-outline" style={styles.icon}/>)
    const checkedBox   = (<Icon name="checkbox-marked" style={[styles.icon, {color: Colors.primary}]}/>)

    if (this.props.modalType == "multiCheck") {
      return (
        <TouchableOpacity
          style={styles.choiceContainer}
          key={index}
          onPress={() => {
            this.onChange(choice)
          }}>
          <View style={styles.choiceItem}>
            {this.state.selectedMulti[choice] ? checkedBox : uncheckedBox  }
            <Text style={styles.choiceText}>
              {choice}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }else {
      return (
        <TouchableOpacity
          style={styles.choiceContainer}
          key={index}
          onPress={() => {
            this.onChange(choice)
          }}>
          <View style={styles.choiceItem}>
            {this.state.selected == choice ? checkedBox : uncheckedBox  }
            <Text style={styles.choiceText}>
              {choice}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }


  render() {
    return (
      <View style={this.props.style}>
        <Modal transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <View style={styles.dimBox}>
            <View style={styles.container}>

              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                  {this.props.header}
                </Text>
              </View>

              <View style={styles.modalChoices}>
                {this.props.choices.map(this.renderOptions.bind(this))}
              </View>

              <MKButton style={styles.button} onPress={this.close}>
                <Text style={styles.buttonText}>
                  {this.state.cancelText}
                </Text>
              </MKButton>

            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={this.open}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

PickerModal.propTypes = {
  choices      : PropTypes.array,
  header       : PropTypes.string,
  onSelect     : PropTypes.func,
  style        : View.propTypes.style,
  initialSelect: PropTypes.string
}

PickerModal.defaultProps = {
  choices      : ['choice 1', 'choice 2'],
  header       : 'default header',
  onSelect     : () => {
  },
  initialSelect: ''
}


const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({

  dimBox: {
    backgroundColor: Colors.transparentDark,
    flex           : 1,
    alignItems     : 'center',
    justifyContent : 'center'
  },

  container: {
    backgroundColor  : '#fefefe',
    flex             : 0,
    flexDirection    : 'column',
    borderRadius     : 2,
    paddingVertical  : 15,
    paddingHorizontal: 15,
    maxHeight        : 500,
    marginHorizontal : 20
  },

  headTextBox: {
    flex        : 0,
    marginBottom: 10,
  },

  headerQuestionText: {
    flex      : 0,
    textAlign : 'left',
    fontWeight: '500',
    fontSize  : 16
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
    flex       : 0,
    color      : '#222',
    textAlign  : 'left',
    paddingLeft: 15,
    fontWeight : '500',
    fontSize   : 16
  },

  button: {
    flex        : 0,
    borderRadius: 2,
    padding     : 10,
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
})
