import React, {Component, PropTypes} from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Alert, Navigator, Platform} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Sidebar from './Sidebar'

const menuIcon      = (<Icon name="menu" size={20} color="#fff"/>)
const secondaryIcon = (<Icon name="map-marker-multiple" size={23} color="#fff"/>)
const backIcon      = (<Icon name="chevron-left" size={20} color="#fff"/>)

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  back() {
    let routes = this.props.navigator.getCurrentRoutes()
    if (routes.length > 1) {
      this.props.navigator.pop()
    }
  }

  getLeftIcon() {
    if (this.props.initial) {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.props.onMenuPress} underlayColor={Colors.primary}>
          {menuIcon}
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.back.bind(this)} underlayColor={Colors.primary}>
          {backIcon}
        </TouchableHighlight>
      )
    }
  }

  navigateToMap() {
    let routes = this.props.navigator.getCurrentRoutes()
    let route  = routes[routes.length - 1]
    if (route.index != 1) {
      this.props.navigator.push({title: 'Map', index: 1})
    }
  }

  render() {
    return (
      <View style={style.wrapper}>
        {this.getLeftIcon()}

        <View style={{flex: 1}}>
          <Text style={[style.text, style.title]}>{this.props.title}</Text>
        </View>

        <TouchableHighlight style={style.touchable}
          underlayColor={Colors.primary}
          onPress={this.navigateToMap.bind(this)}>
          {secondaryIcon}
        </TouchableHighlight>
      </View>
    )
  }
}

Header.propTypes = {
  title      : PropTypes.string.isRequired,
  navigator  : PropTypes.object.isRequired,
  initial    : PropTypes.bool,
  onMenuPress: PropTypes.func
}

function getVerticalPadding() {
  if (Platform.OS == 'android')
    return 0;
  else
    return 15;
}

const elevationStyle = new Elevation(5)

const style = StyleSheet.create({
  wrapper  : {
    ...elevationStyle,
    paddingTop     : getVerticalPadding(),
    flex           : 0,
    flexDirection  : 'row',
    backgroundColor: Colors.primary,
    zIndex         : 1000,
    alignItems     : 'center',
    justifyContent : 'center'
  },
  title    : {
    fontSize       : 16,
    flex           : 1,
    paddingVertical: 17
  },
  text     : {
    color     : Colors.primaryText,
    fontSize  : 16,
    fontWeight: '500',
  },
  right    : {
    textAlign: 'right'
  },
  touchable: {
    flex             : 0,
    paddingHorizontal: 15,
    paddingVertical  : 15
  }
})
