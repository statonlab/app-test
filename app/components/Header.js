import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  DeviceEventEmitter
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
    this.listener = DeviceEventEmitter.addListener('sidebarToggled', () => {
      this.setState({menuIcon: this.state.menuIcon == 'menu' ? 'backburger' : 'menu'})
    })
  }

  componentWillUnmount() {
    this.listener.remove()
  }

  back = () => {
    let routes = this.props.navigator.getCurrentRoutes()
    if (routes.length > 1) {
      this.props.navigator.pop()
    }
  }

  getLeftIcon = () => {
    if (!this.props.showLeftIcon) {
      return
    }

    if (this.props.initial) {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.onMenuPress} underlayColor={Colors.primary}>
          <Icon name={this.state.menuIcon} style={{fontSize: 25}} color="#fff"/>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight style={style.touchable} onPress={this.back} underlayColor={Colors.primary}>
          <Icon name="chevron-left" size={25} color="#fff"/>
        </TouchableHighlight>
      )
    }
  }

  getRightIcon = () => {
    if (!this.props.showRightIcon) {
      return
    }

    return (
      <TouchableHighlight style={style.touchable}
        underlayColor={Colors.primary}
        onPress={this.navigateToMap}>
        <Icon name="map-marker-multiple" size={23} color="#fff"/>
      </TouchableHighlight>
    )
  }

  navigateToMap = () => {
    let routes = this.props.navigator.getCurrentRoutes()
    let route  = routes[routes.length - 1]
    if (route.index != 1) {
      this.props.navigator.push({title: 'Map', label: 'MapScene'})
    }
  }

  onMenuPress = () => {
    this.props.onMenuPress()
  }

  render() {
    return (
      <View style={[style.wrapper, {...(new Elevation(this.props.elevation))}]} ref="header">
        {this.getLeftIcon()}

        <View style={[style.titleContainer, {alignItems: this.props.showLeftIcon ? 'flex-start' : 'center'}]}>
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
  sidebar      : PropTypes.object
}

Header.defaultProps = {
  initial      : false,
  onMenuPress  : function () {

  },
  elevation    : 3,
  showLeftIcon : true,
  showRightIcon: true
}

function getVerticalPadding() {
  if (Platform.OS == 'android')
    return 0;
  else
    return 15;
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
    flex      : 0,
    paddingVertical: 15
  },

  text: {
    color     : Colors.primaryText,
    fontSize  : 18,
    fontWeight: '600',
  },

  right: {
    textAlign: 'right'
  },

  touchable: {
    flex             : 0,
    paddingHorizontal: 20,
    paddingVertical  : 15,
    marginTop: 3
  }
})
