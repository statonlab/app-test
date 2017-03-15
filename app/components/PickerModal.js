import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Navigator,
  Platform,
  Modal,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native'

import {getTheme, MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const theme = getTheme()

const propTypes = {
  choices   : PropTypes.array,
  header    : PropTypes.string,
  onSelect  : PropTypes.func,
  style     : View.propTypes.style,
  initialSelect : PropTypes.string
};

const defaultProps = {
  choices   : ['choice 1', 'choice 2'],
  header    : 'default header',
  onSelect  : () => {
    warning
  },
  initialSelect : ''
};


export default class PickerModal extends Component {

  constructor() {
    super();
    this.state = {
      animationType: 'fade',
      modalVisible : false,
      cancelText: "Back",
      selected: 'Im not set!'
    };

  }

  onChange = (item) => {
    this.props.onSelect(item); //first call the selection method passed in props
    this.setState({selected: item});
    this.close();
  }
  open     = () => {
    this.setState({
      modalVisible: true
    });
  }

  close = () => {
    this.setState({
      modalVisible: false
    });
  }
componentDidMount () {
    this.setState({selected: this.props.initialSelect})
}


  render() {
    return (
      <View style={this.props.style}>
        <Modal transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <View style={styles.container}>

              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                  {this.props.header}
                </Text>
              </View>


              <ScrollView style = {styles.modalChoices}>
                {this.props.choices.map((choice, index) => {
                  return (
                    <TouchableHighlight
                      style={styles.choiceContainer}
                      key={index}
                      onPress={() => {
                    this.onChange(choice)
                  }}
                     >
                      <View style={styles.choiceItem}>
                        {this.state.selected == choice ?  checkedBox : uncheckedBox  }
                        <Text style={styles.choiceText}>
                          {choice}
                        </Text>
                      </View>

                    </TouchableHighlight>
                  )
                })}
              </ScrollView>
            <View style={styles.modalFooter}>
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
    );
  }
}


PickerModal.propTypes    = propTypes;
PickerModal.defaultProps = defaultProps;


const {height, width} = Dimensions.get('window');

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    ...elevationStyle,
    flex           : 1,
    flexDirection  : 'column',
    width          : width * .9,
    borderRadius   : 2,
    padding        : 20,
    margin         : 20,
  },

  headTextBox       : {
    ...elevationStyle,
    flex: 0,
    backgroundColor: "#ffffff",
    marginBottom         : 10,
    marginTop         : 10,
    borderRadius   : 2
  },
  headerQuestionText: {
    flex     : 0,
    textAlign: 'left',
    padding: 5
  },
  modalChoices      : {
    backgroundColor: '#dedede',
    ...elevationStyle,
    ...theme.cardStyle,
    flex           : 0,
    flexDirection  : 'column',
    marginBottom   : 10,
    borderRadius   : 0
  },

  choiceContainer: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    height           : undefined,
  },

  choiceItem: {
    flex         : 0,
    flexDirection: 'row',
    alignItems : 'center'
  },
  choiceText: {
    flex       : 0,
    color      : '#444',
    width      : undefined,
    textAlign  : 'left',
    paddingLeft: 15,
    fontWeight: 'bold'
  },
  modalFooter       : {
    backgroundColor: '#dedede',
    flex           : 0,
    marginTop         : 10,
    marginBottom : 10
  },

  button    : {
    ...(new Elevation(1)),
    flex           : 0,
    borderRadius   : 2,
    backgroundColor: '#fff',
    padding        : 10,
  },
  buttonText: {
    textAlign: 'center',
    color    : '#666'
  },
  icon      : {
    width   : 20,
    fontSize: 10,
    color   : '#aaa'
  },
});

const uncheckedBox = (<Icon name="checkbox-blank-outline" style={styles.icon}/>)
const checkedBox   = (<Icon name="checkbox-marked" style={styles.icon}/>)