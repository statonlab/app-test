import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {MKSlider} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import ImageModal from "./ImageModal";
import NumericModal from '../components/NumericModal'

export default class SliderPick extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: null,
    }
  }

  componentDidMount() {
    this.onChange(this.props.start)
  }


  onChange = (curValue) => {
    let value = Math.round(curValue)
    // if (value = 0) {
    //   value = null
    // }
    this.setState({value})
    this.props.onChange(value)
  }

  /**
   * Display the current value if set
   * @returns {XML}
   */
  displayLegend = () => {
    if (this.state.value) {
      return (
        <NumericModal setValue={this.state.value} onSelect={(value) => this.onChange(value)}>
          <Text style={styles.label}>{this.state.value} {this.props.legendText}</Text>
        </NumericModal>
      )
    }
    return (
      <NumericModal onSelect={(value) => this.onChange(value)}>
        <Text style={styles.label}>Not set</Text>
      </NumericModal>
    )
  }
  /**
   * Display the help icon if there are help images to view
   * @returns {XML}
   */
  displayIcon   = () => {
    let captions = [this.props.description]
    if (this.props.images) {
      return (
        <ImageModal
          captions={captions}
          images={this.props.images}
        >
          <Icon name="help-circle" style={styles.icon}/>
        </ImageModal>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MKSlider
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          style={styles.slider}
          lowerTrackColor={Colors.primary}
          onChange={(value) => this.onChange(value)}
          thumbRadius={this.state.value ? 6 : 0}
          thumbPadding={10}
        />
        {this.displayLegend()}
        {this.displayIcon()}
      </View>
    )
  }
}

SliderPick.propTypes = {
  min        : PropTypes.number,
  max        : PropTypes.number,
  start      : PropTypes.number,
  legendText : PropTypes.string,
  onChange   : PropTypes.func,
  description: PropTypes.string,
  images     : PropTypes.array,
}

SliderPick.defaultProps = {
  min       : 1,
  max       : 50,
  start     : 25,
  legendText: "Inches",
  onChange  : () => {
  }
}

const styles = StyleSheet.create({
  slider: {
    flex: 1
  },

  container     : {
    flex          : 1,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center'
  },
  modalContainer: {
    flex          : 0,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center'

  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : Colors.info
  },

  label: {
    flex       : 0,
    color      : '#666',
    paddingLeft: 10,
    fontSize   : 12,
    width      : 74
  },

})