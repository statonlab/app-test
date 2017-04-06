import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native'
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
      cancelText   : 'CANCEL',
      selected     : 'not set',
      selectedMulti: []
    }
  }

  componentDidMount() {
    this.setState({selected: this.props.initialSelect})
    if (this.props.multiCheck) {
      this.setState({cancelText: 'CONFIRM'})
    }
  }

  onChange = (item) => {
    if (this.props.multiCheck) {
      //For multiCheck type, allow for multiple checks, and keep track of them
      let selected = this.state.selectedMulti
      let index    = selected.indexOf(item)

      if (index >= 0) {
        selected.splice(index, 1)
      } else {
        selected.push(item)
      }

      this.setState({selectedMulti: selected})
      return
    }
    //for single select
    this.props.onSelect(item)
    this.setState({selected: item})
    this.close()
  }

  open = () => {
    this.setState({modalVisible: true})
  }

  close = () => {
    if (this.props.multiCheck) {

      this.props.onSelect(JSON.stringify(this.state.selectedMulti))

    }

    this.setState({modalVisible: false})
  }

  renderOptions(choice, index) {
    const uncheckedBox = (<Icon name="checkbox-blank-outline" style={styles.icon}/>)
    const checkedBox   = (<Icon name="checkbox-marked" style={[styles.icon, {color: Colors.primary}]}/>)

    if (this.props.multiCheck) {
      return (
        <TouchableOpacity
          style={styles.choiceContainer}
          key={index}
          onPress={() => {
            this.onChange(choice)
          }}>
          <View style={styles.choiceItem}>
            {this.state.selectedMulti.indexOf(choice) >= 0 ? checkedBox : uncheckedBox  }
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
          {this.state.selected == choice ? checkedBox : uncheckedBox  }
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

        <TouchableOpacity style={this.props.style} onPress={this.open}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

PickerModal.propTypes = {
  ...View.PropTypes,
  choices      : PropTypes.array,
  header       : PropTypes.string,
  onSelect     : PropTypes.func,
  style        : View.propTypes.style,
  initialSelect: PropTypes.string,
  multiCheck   : PropTypes.bool
}

PickerModal.defaultProps = {
  choices      : ['choice 1', 'choice 2'],
  header       : 'default header',
  onSelect     : () => {
  },
  initialSelect: '',
  multiCheck   : false
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
  }
})
