import React, {Component, PropTypes} from 'react'
import {View, StyleSheet, Text, Modal, TouchableOpacity, Dimensions} from 'react-native'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'
import ImageSlider from './ImageSlider'



export default class InstructionModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
  }



  _toggle() {
    this.setState({show: !this.state.show})
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Modal
          transparent={true}
          visible={this.state.show}
          onRequestClose={() => this.setState({show: false})}
          animationType="fade"
        >
          <View style={styles.dimBox}>
            <View style={styles.container}>

              <View style={styles.headTextBox}>
                <Text style={styles.headerQuestionText}>
                  {this.props.text}
                </Text>
              </View>

              <ImageSlider style={styles.container} images={this.props.images} onPress={this._toggle.bind(this)}/>

              <MKButton style={styles.button} onPress={this._toggle.bind(this)}>
                <Text style={styles.buttonText}>
                  OK
                </Text>
              </MKButton>
          </View>
          </View>
        </Modal>
        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this._toggle.bind(this)}
            style={this.props.style}
          >
          {this.props.children}
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

InstructionModal.propTypes = {
  ...TouchableOpacity.PropTypes,
  images        : PropTypes.array,
  containerStyle: PropTypes.object,
  text : PropTypes.string,
  images : PropTypes.array
}

InstructionModal.defaultProps = {
  containerStyle: new StyleSheet.create({})
}

const styles = StyleSheet.create({
  overlay: {
    position       : 'absolute',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    backgroundColor: 'rgba(0,0,0,.85)'

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
  dimBox: {
    backgroundColor: Colors.transparentDark,
    flex           : 1,
    alignItems     : 'center',
    justifyContent : 'center'
  },

  image: {
    flex      : 1,
    resizeMode: 'contain',
    width     : Dimensions.get('window').width
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
  }

})
