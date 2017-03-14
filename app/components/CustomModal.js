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
  TouchableOpacity
} from 'react-native'

const propTypes = {
  data: PropTypes.array,
  onChange: PropTypes.func,
  initValue: PropTypes.string,
  options: PropTypes.array,
  cancelText: PropTypes.string,
  style: PropTypes.style
};

const defaultProps = {
  data: [],
  onChange: ()=> {},
  initValue: 'Select me!',
  options: {},
  cancelText: 'cancel',
};


export default class CustomModal extends Component {

  constructor () {

    super();

    this.state = {
      animationType               : 'fade',
      modalVisible                : false,
      transparent                 : true,
      selected:           'please select'
    };
  }


  onChange = (item) => {
    this.props.onChange(item);
    this.setState({selected: item.label});
    this.close();
  }
  open = () => {
    this.setState({
      modalVisible: true
    });
  }

  close = () => {
    this.setState({
      modalVisible: false
    });
  }

//This renders what we display

  renderOptionList = () => {
    var options = this.props.data.map((item) => {
      if (item.section) {
        return this.renderSection(item);
      } else {
        return this.renderOption(item);
      }
    });

    return (
      <View style={[styles.overlayStyle, this.props.overlayStyle]} >
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{paddingHorizontal:0}}>
              {options}
            </View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>);
  }


  render() {

    return (
      <View style={this.props.style}>
        <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
          {this.renderOptionList()}
        </Modal>
      </View>
    );
  }
}


CustomModal.propTypes = propTypes;
CustomModal.defaultProps = defaultProps;



const {height, width} = Dimensions.get('window');

 const styles = StyleSheet.create({
   default: {
      flex: 1
   }
  });