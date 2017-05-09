import React, {Component, PropTypes} from 'react'
import {View, Text, Picker, StyleSheet, Modal, TouchableOpacity} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

let dateChoices = [1, 2, 3]

export default class DateModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade',
      modalVisible : false,
      cancelText   : 'CANCEL',
      selected     : null,
      dateChoices  : [1, 2, 3]


    }
  }

  componentWillMount() {
    let choicesArray = []
    let currentYear = new Date().getFullYear()
    for(let i = 0; i < 100; i++) {
      let newVal =currentYear-i
      choicesArray.push(newVal)
    }
  }

  open = () => {
    this.setState({modalVisible: true})
  }

  close = () => {
    this.setState({modalVisible: false})
  }

  renderPickChoices = () => {

    dateChoices.map((value, index) => {
      return (
        <Picker.Item label="test" value="test"/>
      )
    })
  }

  render() {


    return (
      <View>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <View style={styles.dimBox}>
            <View style={styles.container}>
              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                 In what year were you born?
                </Text>
              </View>

              <View style={styles.modalChoices}>
                <Picker>
                  {this.renderPickChoices()}
                </Picker>
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

DateModal.propTypes = {
  ...View.PropTypes,
  onSelect     : PropTypes.func,
  style        : View.propTypes.style,
  selectedYear : PropTypes.number

}

DateModal.defaultProps = {
  onSelect     : () => {
  },
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

  icon     : {
    fontSize : 20,
    color    : '#aaa',
    marginTop: 5
  },

  iconTI   : {
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
    paddingVertical  : 5,
    paddingHorizontal : 5,
    alignItems       : 'center'
  },
})
