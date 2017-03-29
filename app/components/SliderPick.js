
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
              min={10}
              max={100}
              value={25}
              style={styles.slider}
              lowerTrackColor = {Colors.primary}
            onChange={(curValue) => this.refs.valueText.onChange(curValue.toFixed(1))}
            />
            <ValueText ref="valueText" initial="25.0" rangeText="inches" />
          </View>
        </View>
    );
  }
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