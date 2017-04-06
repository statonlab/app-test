import React, {Component, PropTypes} from 'react'
import {
  Animated,
  View,
  Text,
  TouchableHighlight,
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
  }

  componentDidMount() {
    this.setState({message: this.props.noticeText})
  }

  componentWillReceiveProps(props) {
    if (props.noticeText !== this.state.noticeText) {
      this.setState({message: props.noticeText})
    }
  }

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

    setTimeout(this.closeBar, 4000)
  }

  closeBar = () => {
    Animated.timing(
      this.state.position,
      {
        toValue : -60,
        duration: 500
      }
    ).start()

    setTimeout(() => {
      this.setState({isVisible: false})
    }, 1000)
  }

//For now will only get message icon.  In the future other icons could be displayed.

  getIcon = () => {
    return (
      <Icon name="message" size={23} color="#fff"/>
    )
  }

  render() {
    if (this.state.isVisible) {
      return (
        <Animated.View style={[styles.container, this.props.placement === 'bottom' ? {bottom: this.state.position} : {top: this.state.position}]}>
          <TouchableHighlight
            underlayColor={Colors.primary}
            onPress={() => {
              this.closeBar()
            }}
            style={styles.flex1}
          >
            <View style={styles.row}>
              <Text style={[styles.text]}>{this.state.noticeText}</Text>
              {this.getIcon()}
            </View>
          </TouchableHighlight>
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
    position       : 'absolute',
    left           : 20,
    right          : 20,
    backgroundColor: Colors.black,
    zIndex         : 900000,
    borderRadius   : 2
  }
})
