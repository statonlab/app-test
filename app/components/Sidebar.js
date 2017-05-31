import React, {Component, PropTypes} from 'react'
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  DeviceEventEmitter,
  PanResponder,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'
import {MKRipple} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'

const window       = Dimensions.get('window')
const sidebarWidth = window.width - 60 > 300 ? window.width - 60 : 300

export default class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open    : false,
      position: null,
      routes  : [],
      opacity : new Animated.Value(0),
      dragging: false
    }
  }

  /**
   * Setup responder.
   */
  componentWillMount() {
    this.state.position = new Animated.Value(-sidebarWidth)
    this._value         = -sidebarWidth
    this.state.position.addListener(e => {
      this._value = e.value

      let position = this.state.position._value + this.state.position._offset
      let opacity  = Math.min(1 - Math.abs(position / sidebarWidth), 0.7)
      this.state.opacity.setValue(opacity < 0 ? 0 : opacity)
      this.forceUpdate()
    })

    let grant = (e, gesture) => {
      // Accept horizontal movements only
      let position = this.state.position._value + this.state.position._offset
      return Math.abs(gesture.dy) < Math.abs(gesture.dx)
    }

    this._pan = PanResponder.create({
      // Ask to be the responder:
      onMoveShouldSetPanResponder       : grant,
      onMoveShouldSetPanResponderCapture: grant,

      onPanResponderGrant: () => {
        this.state.position.setOffset(this._value)
        this.state.position.setValue(0)
        this.setState({dragging: true})
      },

      onPanResponderMove: (e, gesture) => {
        let position = this.state.position._value + this.state.position._offset

        // Allow moving only if the sidebar is not fully open OR allow left swipe only when the sidebar is fully open
        if (position < 0 || (position >= 0 && gesture.dx <= 0)) {
          Animated.event([null, {dx: this.state.position}])(e, gesture)
        }

        this.setState({open: position > -sidebarWidth})
      },

      onPanResponderRelease: (e, {dx, vx}) => {
        this.state.position.flattenOffset()

        if (dx > 60 || vx > 0.05) {
          this.open()
        } else {
          this.close()
        }

        this.setState({dragging: false})
      }
    })
  }

  componentWillUnmount() {
    this.state.position.removeAllListeners()
  }

  /**
   * Set the routes.
   */
  componentDidMount() {
    this.setState({routes: this.props.routes})
  }

  /**
   * Update routes if they change.
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    if (this.state.routes !== props.routes) {
      this.setState({routes: props.routes})
    }
  }

  /**
   * Open or close menu.
   */
  toggleMenu() {
    if (this.state.open) {
      this.close()
    }
    else {
      this.open()
    }
  }

  close() {

    Animated.timing(this.state.position, {
      toValue : -sidebarWidth,
      duration: 300
    }).start(() => {
      this.setState({open: false})
      this.broadcast(false)
    })
  }

  open() {

    this.setState({open: true})

    Animated.timing(this.state.position, {
      toValue : 0,
      duration: 300
    }).start(() => {
      this.broadcast(true)
    })
  }

  render() {
    let containerWidth = this.state.open ? window.width : 0

    return (
      <Animated.View ref="container" style={[style.container, {width: containerWidth, backgroundColor: `rgba(0,0,0,${this.state.opacity._value})`}]}>
        <TouchableOpacity onPress={this.toggleMenu.bind(this)} style={{
          flex           : 1,
          backgroundColor: 'transparent',
          width          : undefined,
          zIndex         : 800
        }} activeOpacity={1}>
        </TouchableOpacity>
        <Animated.ScrollView style={[style.sidebar, {transform: [{translateX: this.state.position}]}]} ref="sidebar">
          {this.state.routes.map((route, index) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  this.goTo.call(this, route)
                }}>
                <MKRipple
                  style={style.touchable}
                  rippleColor={'rgba(0,0,0,0.1)'}>
                  <Icon name={route.icon} size={20} style={style.icon}/>
                  <Text style={style.text}>
                    {route.title}
                  </Text>
                </MKRipple>
              </TouchableWithoutFeedback>
            )
          })}
        </Animated.ScrollView>
      </Animated.View>
    )
  }

  /**
   * Navigate to a route.
   *
   * @param route
   */
  goTo(route) {
    this.toggleMenu()

    if (typeof route.onPress === 'function') {
      route.onPress()
      return
    }

    this.props.navigator.push(route)
  }

  getPan() {
    return this._pan.panHandlers
  }

  broadcast(open) {
    if (open) {
      DeviceEventEmitter.emit('sidebarOpened')
    } else {
      DeviceEventEmitter.emit('sidebarClosed')
    }
  }
}

Sidebar.propTypes = {
  navigator: PropTypes.object.isRequired,
  routes   : PropTypes.array.isRequired,
  left     : PropTypes.number
}

Sidebar.defaultProps = {
  left: -sidebarWidth
}

function getVerticalMargin() {
  if (Platform.OS === 'android')
    return 60
  else
    return 75
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
    width          : sidebarWidth
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
