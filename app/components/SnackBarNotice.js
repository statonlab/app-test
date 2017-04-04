import React, {Component, PropTypes} from 'react'
import {Animated,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

export default class SnackBarNotice extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false,
      noticeText : '',
      position: new Animated.Value(-250),

    }
  }

  componentDidMount() {
    this.setState({message: this.props.noticeText})
  }

  componentWillReceiveProps(props) {
    this.setState({message: props.noticeText})
  }

  showBar = () => {
    this.setState({noticeText : this.props.noticeText})
    this.setState({isVisible: true})

    Animated.timing(
      this.state.position,
      {
        toValue : 20,
        duration: 1000
      }
    ).start()

    setTimeout(this.closeBar, 4000)

  }

  closeBar = () => {
    Animated.timing(
      this.state.position,
      {
        toValue : -100,
        duration: 500
      }
    ).start()
    this.setState({isVisible: false})

  }

//For now will only get message icon.  In the future other icons could be displayed.

  getIcon = () => {
    return (
        <Icon name="message" size={23} color="#fff"/>
    )
  }


  renderBar = () => {
    if (this.state.isVisible)
    return(
      <TouchableHighlight
        underlayColor={Colors.primary}
        onPress={() => {this.closeBar()}}>
        <Animated.View style={[styles.container, {bottom: this.state.position}]}>
          <Text style={[styles.text]}>{this.state.noticeText}</Text>
          {this.getIcon()}
        </Animated.View>
      </TouchableHighlight>
      )
  }



  render() {
    return (
      <View>
          {this.renderBar()}
      </View>
    )
  }
}

SnackBarNotice.propTypes = {
  initial      : PropTypes.bool,
  elevation    : PropTypes.number,
  noticeText : PropTypes.string,
  timeout : PropTypes.number,
  icon : PropTypes.string
}

SnackBarNotice.defaultProps = {
  initial      : false,
  elevation    : 3,
  noticeText : "SnackBar notice text!",
  timeout : 3000,
  icon : "message"

}


const styles = StyleSheet.create({


  text: {
    color     : Colors.primaryText,
    fontSize  : 18,
    fontWeight: '600',
  },

  right: {
    textAlign: 'right'
  },

  container: {
    ...(new Elevation(2)),
    position: 'absolute',
    bottom: 0,
  left: 20,
  right: 20,
  height: 60,
  flex: 1,
  flexDirection: 'row',
  padding: 10,
  justifyContent: 'space-between',
  backgroundColor :  Colors.black,
  alignItems: 'center'
  // add bg color
}

})
