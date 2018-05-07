import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

export default class SnackBarNotice extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible : false,
      noticeText: '',
      position  : new Animated.Value(-60)
    }

    this.closeTimeOut = null
    this.openTimeOut  = null
  }

  /**
   * Initialize the message
   */
  componentDidMount() {
    this.setState({message: this.props.noticeText})
  }

  /**
   * Watch for message changes
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    if (props.noticeText !== this.state.noticeText) {
      this.setState({message: props.noticeText})
    }
  }

  /**
   * Show the notification bar
   */
  showBar = () => {
    this.setState({
      noticeText: this.props.noticeText,
      isVisible : true
    })

    let move = 20
    if (this.props.placement === 'top') {
      move = 50
    }

    Animated.timing(
      this.state.position,
      {
        toValue : move,
        duration: 1000
      }
    ).start()

    // Prevent overlap of timeouts
    this.clearTimeouts()
    this.openTimeOut = setTimeout(this.closeBar, 4000)
  }

  /**
   * Hide the notification bar
   */
  closeBar = () => {
    Animated.timing(
      this.state.position,
      {
        toValue : -60,
        duration: 500
      }
    ).start()

    // Prevent overlap of timeouts
    this.clearTimeouts()
    this.closeTimeOut = setTimeout(() => {
      this.setState({isVisible: false})
    }, 1000)
  }

  componentWillUnmount() {
    // This will get rid of the setState on unmounted component warning
    this.clearTimeouts()
  }

  clearTimeouts() {
    clearTimeout(this.closeTimeOut)
    clearTimeout(this.openTimeOut)
  }

  /**
   * For now will only get message icon.  In the future other icons could be displayed.
   *
   * @returns {{XML}}
   */
  getIcon = () => {
    return (
      <Icon name="message" size={23} color="#fff" style={{marginRight: 10}}/>
    )
  }

  render() {
    if (this.state.isVisible) {
      return (
        <Animated.View style={[styles.container, this.props.placement === 'bottom' ? {bottom: this.state.position} : {top: this.state.position}]}>
          <TouchableOpacity
            onPress={() => {
              this.closeBar()
            }}
            style={styles.flex1}
          >
            <View style={styles.row}>
              {this.getIcon()}

              <Text style={[styles.text]}>{this.state.noticeText}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )
    } else {
      return (null)
    }
  }
}

SnackBarNotice.propTypes = {
  initial   : PropTypes.bool,
  elevation : PropTypes.number,
  noticeText: PropTypes.string,
  timeout   : PropTypes.number,
  icon      : PropTypes.string,
  placement : PropTypes.string
}

SnackBarNotice.defaultProps = {
  initial   : false,
  elevation : 3,
  noticeText: 'SnackBar notice text!',
  timeout   : 3000,
  icon      : 'message',
  placement : 'bottom'
}


const styles = StyleSheet.create({
  text: {
    color     : Colors.primaryText,
    fontSize  : 14,
    fontWeight: 'bold'
  },

  right: {
    textAlign: 'right'
  },

  flex1: {
    flex: 1
  },

  row: {
    flexDirection    : 'row',
    alignItems       : 'center',
    justifyContent   : 'space-between',
    height           : 50,
    paddingHorizontal: 10
  },

  container: {
    ...(new Elevation(2)),
    position         : 'absolute',
    left             : 0,
    right            : 0,
    paddingHorizontal: 10,
    paddingVertical  : 5,
    backgroundColor  : Colors.black,
    zIndex           : 900000
    // borderRadius   : 2
  }
})
