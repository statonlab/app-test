import React, {Component, PropTypes} from 'react'
import {ScrollView, View, Text, TouchableHighlight, StyleSheet, Platform} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKRipple} from 'react-native-material-kit'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
  }

  toggleMenu() {
    console.log(this.refs.sidebar)/*
    if (this.refs.sidebar.style.left < 0) {
      this.refs.sidebar.style.left = 0
    }
    else {
      this.refs.sidebar.style.left = -250
    }*/
  }

  render() {
    return (
      <ScrollView style={style.container} ref="sidebar">
        <MKRipple
          onTouch={() => console.log("test")}
          style={style.touchable}
          rippleColor={"rgba(0,0,0,0.1)"}>
          <Text style={style.text}>Link</Text>
        </MKRipple>
        <MKRipple
          onTouch={() => console.log("test")}
          style={style.touchable}
          rippleColor={"rgba(0,0,0,0.1)"}>
          <Text style={style.text}>Link</Text>
        </MKRipple>
        <MKRipple
          onTouch={() => console.log("test")}
          style={style.touchable}
          rippleColor={"rgba(0,0,0,0.1)"}>
          <Text style={style.text}>Link</Text>
        </MKRipple>
        <MKRipple
          onTouch={() => console.log("test")}
          style={style.touchable}
          rippleColor={"rgba(0,0,0,0.1)"}>
          <Text style={style.text}>Text</Text>
        </MKRipple>
      </ScrollView>
    )
  }
}

Sidebar.propTypes = {
  navigator: PropTypes.object.isRequired,
  routes   : PropTypes.array.isRequired
}

function getVerticalPadding() {
  if (Platform.OS == 'android')
    return 70.5;
  else
    return 70.5;
}

const elevationStyle = new Elevation(5)

const style = StyleSheet.create({
  container: {
    flex           : 0,
    ...elevationStyle,
    shadowOffset   : {
      height: 5,
      width : 7
    },
    backgroundColor: Colors.sidebarBackground,
    zIndex         : 1000,
    position       : 'absolute',
    top            : getVerticalPadding(),
    left           : -250,
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
