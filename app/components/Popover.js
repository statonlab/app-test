import React, {Component} from 'react'
import {Animated, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import Elevation from '../helpers/Elevation'
import PopoverItem from './subcomponents/PopoverItem'

class Popover extends Component {
  constructor(props) {
    super(props)

    this.state = {
      layout : {
        width : 0,
        height: 0
      },
      opacity: new Animated.Value(0),
      visible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible) {
      Animated.timing(
        this.state.opacity,
        {
          toValue : 1,
          duration: 250
        }
      ).start()

      this.setState({visible: nextProps.visible})
    } else {
      Animated.timing(
        this.state.opacity,
        {
          toValue : 0,
          duration: 250
        }
      ).start(() => {
        this.setState({visible: nextProps.visible})
      })
    }
  }

  render() {
    if (!this.state.visible) {
      return null
    }

    const windowHeight = Dimensions.get('window').height
    const measurements = this.props.triggerMeasurements
    const len          = React.Children.count(this.props.children)
    let position       = {
      top : measurements.y + (measurements.height / 2),
      left: measurements.x + (measurements.width / 2) - (this.state.layout.width)
    }

    const distance = windowHeight - (position.top + this.state.layout.height)
    if (distance < this.state.layout.height) {
      position = {
        bottom: windowHeight - measurements.y - this.state.layout.height,
        left  : measurements.x + (measurements.width / 2) - (this.state.layout.width)
      }
    }

    return (
      <Animated.View style={[styles.container, {opacity: this.state.opacity}]}>
        <TouchableOpacity
          style={{flex: 1, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          onPress={() => this.props.onCloseRequest()}/>
        <View
          style={[styles.popover, position, this.props.style]}
          onLayout={({nativeEvent}) => {
            this.setState({layout: nativeEvent.layout})
          }}>
          {React.Children.map(this.props.children, (child, i) => {
            if (child !== null && child.type === PopoverItem) {
              child = React.cloneElement(child, {
                isLast: i === len - 1
              })
            }

            return child
          })}
        </View>
      </Animated.View>
    )
  }
}

export default Popover
export {PopoverItem}

Popover.propTypes = {
  visible            : PropTypes.bool,
  style              : PropTypes.object,
  triggerMeasurements: PropTypes.object,
  onCloseRequest     : PropTypes.func.isRequired
}

Popover.defaultProps = {
  visible            : false,
  style              : {},
  triggerMeasurements: {
    x     : 0,
    y     : 0,
    width : 0,
    height: 0
  }
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    position       : 'absolute',
    backgroundColor: 'transparent',
    zIndex         : 1000,
    elevation      : 5,
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0
  },

  popover: {
    backgroundColor: '#fff',
    position       : 'absolute',
    zIndex         : 2000,
    borderRadius   : 4,
    ...new Elevation(5),
    borderWidth    : 1,
    borderColor    : '#eee'
  }
})
