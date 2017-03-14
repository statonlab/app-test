import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Alert,
  Navigator,
  Platform,
  Modal
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


export default class CustomModal extends Component {

  constructor () {

    super();

    // this._bind(
    //   'onChange',
    //   'open',
    //   'close',
    //   'renderChildren'
    // );


    this.state = {
      animationType               : 'none',
      modalVisible                : false,
      transparent                 : false,
      selectedSupportedOrientation: 0,
      currentOrientation          : 'unknown',
    };

  }

    _setModalVisible = (visible) => {
      this.setState({modalVisible: visible});
    };

    _setAnimationType = (type) => {
      this.setState({animationType: type});
    };

    _toggleTransparent = () => {
      this.setState({transparent: !this.state.transparent});
    };



  render() {
    var modalBackgroundStyle           = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;
    var activeButtonStyle              = {
      backgroundColor: '#ddd'
    }
    return (
    <View>
        <Text>
          Building the Modal
        </Text>
    </View>
    )
  }
}


CustomModal.propTypes = propTypes;
CustomModal.defaultProps = defaultProps;