import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableHighlight
} from 'react-native'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'

export default class CapturedScene extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.image.path}} style={styles.preview}/>
        <View style={styles.toolsContainer}>
          <TouchableHighlight onPress={this._back.bind(this)} style={styles.choice}>
            <Text style={styles.text}>Retake</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._back.bind(this)} style={styles.choice}>
            <Text style={[styles.text, {textAlign:'right'}]}>Use</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _back() {
    let routes = this.props.navigator.getCurrentRoutes()
    if (routes.length > 1) {
      this.props.navigator.pop();
    }
  }

  _use() {
    this.props.navigator.push({
      image: this.props.image,
      index: 5
    })
  }
}

CapturedScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  image    : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container     : {
    flex: 1
  },
  preview       : {
    flex      : 1,
    height    : undefined,
    width     : undefined,
    resizeMode: 'contain'
  },
  toolsContainer: {
    flex           : 0,
    flexDirection  : 'row',
    justifyContent : 'space-between',
    width          : undefined,
    height         : 70,
    alignItems     : 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    position       : 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  text          : {
    color  : "#fff",
    padding: 20
  },
  choice        : {
    flex : 1,
    width: 50
  }
});
