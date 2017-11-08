import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {isIphoneX} from 'react-native-iphone-x-helper'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuIcon: 'menu'
    }
  }

  componentWillMount() {
    this.listeners = []
  }

  componentWillUnmount() {
    this.listeners.map((event) => event.remove())
  }

  back = () => {
    if (!this.props.onBackPress()) {
      return
    }

    this.props.navigator.goBack()
  }

  getLeftIcon = () => {
    if (!this.props.showLeftIcon) {
      return
    }

    if (this.props.initial) {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.onMenuPress}
                            underlayColor={Colors.primary}>
          <Icon name={this.state.menuIcon} style={{fontSize: 25}} color="#fff"/>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.back}
                            underlayColor={Colors.primary}>
          <Icon name="chevron-left" size={25} color="#fff"/>
        </TouchableHighlight>
      )
    }
  }

  getRightIcon = () => {
    if (!this.props.showRightIcon) {
      return
    }

    let icon    = (<Icon name="map-marker-multiple" size={23} color="#fff"/>)
    let onPress = this.navigateToMap

    if (this.props.rightIcon !== null) {
      icon    = this.props.rightIcon
      onPress = this.props.onRightPress
    }

    return (
      <TouchableHighlight style={style.touchable}
                          underlayColor={Colors.primary}
                          onPress={onPress}>
        {icon}
      </TouchableHighlight>
    )
  }

  navigateToMap = () => {
    this.props.navigator.navigate('Map')
  }

  onMenuPress = () => {
    this.props.onMenuPress()
  }

  render() {
    return (
      <View style={[style.wrapper, {...new Elevation(this.props.elevation)}]}
            ref="header">
        {this.getLeftIcon()}

        <View
          style={[style.titleContainer, {alignItems: this.props.showLeftIcon ? 'flex-start' : 'center'}]}>
          <Text style={[style.text, style.title]}>{this.props.title}</Text>
        </View>

        {this.getRightIcon()}
      </View>
    )
  }
}

Header.propTypes = {
  title        : PropTypes.string.isRequired,
  navigator    : PropTypes.object.isRequired,
  initial      : PropTypes.bool,
  onMenuPress  : PropTypes.func,
  elevation    : PropTypes.number,
  showLeftIcon : PropTypes.bool,
  showRightIcon: PropTypes.bool,
  onBackPress  : PropTypes.func,
  rightIcon    : PropTypes.object,
  onRightPress : PropTypes.func
}

Header.defaultProps = {
  initial      : false,
  onMenuPress  : () => {

  },
  onBackPress() {
    return true
  },
  onRightPress() {

  },
  elevation    : 3,
  showLeftIcon : true,
  showRightIcon: true,
  rightIcon    : null
}

function getVerticalPadding() {
  if (Platform.OS === 'android') {
    return 0
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 15
  }
}

const style = StyleSheet.create({
  wrapper: {
    paddingTop     : getVerticalPadding(),
    flex           : 0,
    flexDirection  : 'row',
    backgroundColor: Colors.primary,
    zIndex         : 1000,
    alignItems     : 'center',
    justifyContent : 'center'
  },

  titleContainer: {
    flex: 1
  },

  title: {
    flex           : 0,
    paddingVertical: 15
  },

  text: {
    color     : Colors.primaryText,
    fontSize  : 18,
    fontWeight: '600'
  },

  right: {
    textAlign: 'right'
  },

  touchable: {
    flex             : 0,
    paddingHorizontal: 20,
    paddingVertical  : 15,
    marginTop        : 3
  }
})
