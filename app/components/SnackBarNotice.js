import React, {Component, PropTypes} from 'react'
import {
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
      noticeText : ''
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
    setTimeout(this.closeBar, 3000)
  }

  closeBar = () => {
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
        <View style={styles.container}>
          <Text style={[styles.text]}>{this.state.noticeText}</Text>
          {this.getIcon()}
        </View>
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
    bottom: 10,
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
