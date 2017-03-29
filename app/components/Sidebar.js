import React, {Component, PropTypes} from 'react'
import {
  Animated,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  DeviceEventEmitter,
  PanResponder
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'
import {MKRipple} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open    : false,
      position: new Animated.Value(-250),
      routes  : []
    }
  }

  componentDidMount() {
    this.setState({routes: this.props.routes})
  }

  componentWillReceiveProps(props) {
    this.setState({routes: props.routes})
  }

  toggleMenu() {
    if (this.state.open) {
      setTimeout(() => {
        this.refs['container'].setNativeProps({
          style: {width: 0}
        })
      }, 200)
      Animated.timing(
        this.state.position,
        {
          toValue : -250,
          duration: 200
        }
      ).start()
    }
    else {
      this.refs['container'].setNativeProps({
        style: {width: 7000}
      })
      Animated.timing(
        this.state.position,
        {
          toValue : 0,
          duration: 200
        }
      ).start()
    }

    this.setState({open: !this.state.open})

    this.broadcast()
  }

  render() {
    return (
      <View ref="container" style={style.container}>
        <TouchableOpacity onPress={this.toggleMenu.bind(this)} style={{
             flex: 1,
             backgroundColor: 'transparent',
             width: undefined,
             zIndex: 800
        }} activeOpacity={1}>
        </TouchableOpacity>
        <Animated.ScrollView style={[style.sidebar, {left: this.state.position}]} ref="sidebar">
          {this.state.routes.map((route, index) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {this.goTo.call(this, route)}}>
                <MKRipple
                  style={style.touchable}
                  rippleColor={"rgba(0,0,0,0.1)"}>
                  <Icon name={route.icon} size={20} style={style.icon}/>
                  <Text style={style.text}>
                    {route.title}
                  </Text>
                </MKRipple>
              </TouchableWithoutFeedback>
            )
          })}
        </Animated.ScrollView>
      </View>
    )
  }

  goTo(route) {
    this.toggleMenu()

    if(typeof route.onPress == 'function') {
      route.onPress()
      return
    }

    this.props.navigator.push(route)
  }

  broadcast() {
    DeviceEventEmitter.emit('sidebarToggled')
  }
}

Sidebar.propTypes = {
  navigator: PropTypes.object.isRequired,
  routes   : PropTypes.array.isRequired
}

function getVerticalMargin() {
  if (Platform.OS == 'android')
    return 60
  else
    return 76
}

const style = StyleSheet.create({
  container: {
    width          : 0,
    flex           : 0,
    position       : 'absolute',
    left           : 0,
    right          : 0,
    top            : getVerticalMargin(),
    bottom         : 0,
    zIndex         : 900,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },

  sidebar: {
    ...(new Elevation(5)),
    flex           : 0,
    elevation      : 5,
    backgroundColor: Colors.sidebarBackground,
    zIndex         : 1000,
    position       : 'absolute',
    top            : 0,
    bottom         : 0,
    width          : 250
  },

  text: {
    color          : Colors.sidebarText,
    fontWeight     : 'bold',
    paddingVertical: 12,
    paddingRight   : 10,
    paddingLeft    : 20,
    width          : undefined,
    fontSize       : 16
  },

  icon: {
    color          : Colors.sidebarText,
    paddingVertical: 12,
    paddingLeft    : 10,
    color          : Colors.primary
  },

  right: {
    textAlign: 'right'
  },

  touchable: {
    flex             : 0,
    borderTopWidth   : 1,
    borderTopColor   : '#f6f6f6',
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    borderStyle      : 'solid',
    flexDirection    : 'row',
    justifyContent   : 'flex-start',
    alignItems       : 'center'
  }
})
