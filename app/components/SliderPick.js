import React, {Component, PropTypes} from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {MKSlider} from 'react-native-material-kit'
import Colors from '../helpers/Colors'

export default class SliderPick extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0
    }
  }

  componentDidMount() {
    this.setState({value: this.props.start})
  }

  onChange = (curValue) => {
    let value = Math.round(curValue)
    this.setState({value})
    this.props.onChange(value)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.col}>
          <MKSlider
            min={this.props.min}
            max={this.props.max}
            value={this.state.value}
            style={styles.slider}
            lowerTrackColor={Colors.primary}
            onChange={(value) => this.onChange(value)}
          />
          <Text style={styles.label}>{this.state.value} {this.props.legendText}</Text>
        </View>
      </View>
    )
  }
}

SliderPick.propTypes = {
  min       : PropTypes.number,
  max       : PropTypes.number,
  start     : PropTypes.number,
  legendText: PropTypes.string,
  onChange  : PropTypes.func
}

SliderPick.defaultProps = {
  min       : 1,
  max       : 100,
  start     : 25,
  legendText: "Inches",
  onChange  : () => {
  }
}

const styles = StyleSheet.create({
  slider: {
    width: 200,
  },

  container: {
    flex: 1
  },

  label: {
    color      : '#444',
    paddingLeft: 15
  }
})