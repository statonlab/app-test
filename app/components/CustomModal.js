import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Alert,
  Navigator,
  Platform,
  Modal,
  Item,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native'

const propTypes = {
  data: PropTypes.array,
  onChange: PropTypes.func,
  initValue: PropTypes.string,
  style: View.propTypes.style,
  selectStyle: View.propTypes.style,
  optionStyle: View.propTypes.style,
  optionTextStyle: Text.propTypes.style,
  sectionStyle: View.propTypes.style,
  sectionTextStyle: Text.propTypes.style,
  cancelStyle: View.propTypes.style,
  cancelTextStyle: Text.propTypes.style,
  overlayStyle: View.propTypes.style,
  cancelText: PropTypes.string
};

const defaultProps = {
  data: [],
  onChange: ()=> {},
  initValue: 'Select me!',
  style: {},
  selectStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  sectionStyle: {},
  sectionTextStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel'
};

let componentIndex = 0;


export default class CustomModal extends Component {

  constructor () {

    super();

    this.state = {
      animationType               : 'slide',
      modalVisible                : false,
      transparent                 : true,
      selected:           'please select'
    };
  }


  componentDidMount = () => {
    this.setState({selected: this.props.initValue});
    this.setState({cancelText: this.props.cancelText});
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.initValue != this.props.initValue) {
      this.setState({selected: nextProps.initValue});
    }
  }

  onChange = (item) => {
    this.props.onChange(item);
    this.setState({selected: item.label});
    this.close();
  }

  close = () => {
    this.setState({
      modalVisible: false
    });
  }

  open = () => {
    this.setState({
      modalVisible: true
    });
  }

  renderSection = (section) => {
    return (
      <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
        <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
      </View>
    );
  }

  renderOption = (option) => {
    return (
      <TouchableOpacity key={option.key} onPress={()=>this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle,this.props.optionTextStyle]}>{option.label}</Text>
        </View>
      </TouchableOpacity>)
  }

  renderOptionList = () => {
    var options = this.props.data.map((item) => {
      if (item.section) {
        return this.renderSection(item);
      } else {
        return this.renderOption(item);
      }
    });

    return (
      <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker'+(componentIndex++)}>
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


  renderChildren = () => {

    if(this.props.children) {
      return this.props.children;
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
      </View>
    );
  }

  render() {

    const dp = (
      <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}


CustomModal.propTypes = propTypes;
CustomModal.defaultProps = defaultProps;



const {height, width} = Dimensions.get('window');

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';
const OPTION_CONTAINER_HEIGHT = 400;

 const styles = StyleSheet.create({

  overlayStyle: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },

  optionContainer: {
    borderRadius:BORDER_RADIUS,
    width:width*0.8,
    height:OPTION_CONTAINER_HEIGHT,
    backgroundColor:'rgba(255,255,255,0.8)',
    left:width*0.1,
    top:(height-OPTION_CONTAINER_HEIGHT)/2
  },

  cancelContainer: {
    left:width*0.1,
    top:(height-OPTION_CONTAINER_HEIGHT)/2 + 10
  },

  selectStyle: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: BORDER_RADIUS
  },

  selectTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE
  },

  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING
  },

  cancelTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE
  },

  optionStyle: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE
  }
});