
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {MKSlider} from 'react-native-material-kit';
import Colors from '../helpers/Colors'



class ValueText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curValue: props.initial,
    };
  }

  onChange(curValue) {
    this.setState({curValue});
  }

  render() {
    return (
      <Text style={styles.label}>
        {this.state.curValue} {this.props.rangeText}
      </Text>
    );
  }
}

export default class SliderPick extends Component {


  render() {
    return (
      <View
        contentContainerStyle={styles.container}>
          <View style={styles.col}>
            <MKSlider
              min={this.props.minVal}
              max={this.props.maxVal}
              value={this.props.startVal}
              style={styles.slider}
              lowerTrackColor = {Colors.primary}
              onChange={(curValue) => this.refs.valueText.onChange(curValue.toFixed(0))}
            />
            <ValueText ref="valueText" initial="25" rangeText={this.props.legendText} />
          </View>
        </View>
    );
  }
}


SliderPick.propTypes = {
  minVal: PropTypes.number,
  maxVal: PropTypes.number,
  startVal: PropTypes.number,
  legendText: PropTypes.string
}
SliderPick.defaultProps = {
  minVal: 1,
  maxVal: 100,
  startVal: 25,
  legendText: "Inches"
}

const styles =  StyleSheet.create({
  slider: {
    width: 200,
  },
  container: {

  },
  label: {
    color: '#444',
    paddingLeft: 15

  }
})