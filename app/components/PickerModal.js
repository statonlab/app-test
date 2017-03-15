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
  style     : View.propTypes.style
};

const defaultProps = {
  choices   : ['choice 1', 'choice 2'],
  header    : 'default header',
  onSelect  : () => {
    warning
  },
};


export default class PickerModal extends Component {

  constructor() {
    super();
    this.state = {
      animationType: 'fade',
      modalVisible : false,
      cancelText: "Back"
    };

  }


  onChange = (item) => {
    this.props.onSelect(item);
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


  render() {
    return (
      <View style={this.props.style}>
        <Modal transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          <View style={styles.container}>

            <View style={styles.modalHead}>
              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                  {this.props.header}
                </Text>
              </View>
            </View>

            <View style={styles.modalChoices}>
              <ScrollView>
                {this.props.choices.map((choice, index) => {
                  return (
                    <TouchableHighlight
                      style={styles.choiceContainer}
                      key={index}
                      onPress={() => {
                    this.onChange(choice)
                  }}
                      underlayColor="#fff">
                      <View style={styles.choiceItem}>
                        {/*{this.state.selected == this.choice ?  {checkedBox} : {uncheckedBox}  }*/}
                        {checkedBox}
                        <Text style={styles.choiceText}>
                          {choice}
                        </Text>
                      </View>

                    </TouchableHighlight>
                  )
                })}
              </ScrollView>
            </View>
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
    borderRadius   : 10,
    padding        : 20,
    margin         : 20,
  },

  modalChoices      : {
    backgroundColor: '#dedede',
    ...theme.cardStyle,
    flex           : 10,
    flexDirection  : 'column',
    marginBottom   : 10,
    borderRadius   : 0
  },
  choice            : {
    flex: 1
  },
  modalHead         : {
    ...elevationStyle,
    flex           : 3,
    marginBottom        : 10,
    marginTop : 10,
    borderRadius   : 2,
    backgroundColor: Colors.primary,
  },
  headerQuestionText: {
    flex     : 1,
    textAlign: 'left'
  },
  headTextBox       : {
    ...elevationStyle,
    flex           : 1,
    backgroundColor: "#ffffff",
    margin         : 10,
    borderRadius   : 1
  },
  modalFooter       : {
    backgroundColor: '#dedede',
    flex           : 1,
    margin         : 10
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

  choiceText: {
    flex       : 1,
    color      : '#444',
    width      : undefined,
    marginTop  : 10,
    textAlign  : 'left',
    paddingLeft: 15
  },

  choiceItem: {
    flex         : 1,
    flexDirection: 'row'
  },
  icon      : {
    width   : 20,
    fontSize: 10,
    color   : '#aaa'
  },
  button    : {
    ...(new Elevation(1)),
    flex           : 1,
    borderRadius   : 2,
    backgroundColor: '#fff',
    padding        : 10,
  },
  buttonText: {
    textAlign: 'center',
    color    : '#666'
  }

});

const uncheckedBox = (<Icon name="checkbox-blank-outline" style={styles.icon}/>)
const checkedBox   = (<Icon name="checkbox-marked" style={styles.icon}/>)