import React, {Component, PropTypes} from 'react'
import {
  Animated,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKRipple} from 'react-native-material-kit'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open    : false,
      position: new Animated.Value(-250)
    }
  }

  toggleMenu() {
    if (this.state.open) {
      setTimeout(() => {
        this.refs['container'].setNativeProps({
          style: {width: 0}
        })
      }, 500)
      Animated.timing(
        this.state.position,
        {
          toValue: -250,
          duration: 500
        }
      ).start();
    }
    else {
      this.refs['container'].setNativeProps({
        style: {width: 7000}
      })
      Animated.timing(
        this.state.position,
        {
          toValue: 0,
          duration: 500
        }
      ).start();
    }

    this.setState({open: !this.state.open})
  }

  render() {
    return (
      <View ref="container" style={style.container}>
        <Animated.ScrollView style={[style.sidebar, {left: this.state.position}]} ref="sidebar">
          {this.props.routes.map((route, index) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {this.goTo.call(this, route)}}>
                <MKRipple
                  style={style.touchable}
                  rippleColor={"rgba(0,0,0,0.1)"}>
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
    this.props.navigator.push(route)
  }
}

Sidebar.propTypes = {
  navigator: PropTypes.object.isRequired,
  routes   : PropTypes.array.isRequired
}

function getVerticalMargin() {
  if (Platform.OS == 'android')
    return 54;
  else
    return 70.5;
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
    zIndex         : 1000,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  sidebar  : {
    flex           : 0,
    elevation      : 5,
    backgroundColor: Colors.sidebarBackground,
    zIndex         : 1000,
    position       : 'absolute',
    top            : 0,
    bottom         : 0,
    width          : 250
  },
  text     : {
    color            : Colors.sidebarText,
    fontWeight       : "bold",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    width            : 250
  },
  right    : {
    textAlign: 'right'
  },
  touchable: {
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    borderStyle      : 'solid'
  }
})
