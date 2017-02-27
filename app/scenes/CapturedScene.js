import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image
} from 'react-native'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../helpers/Colors'

export default class CameraScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Confirm" navigator={this.props.navigator}/>
        <Image source={}/>
      </View>
    );
  }
}

CameraScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container     : {
    flex: 1
  },
  preview       : {
    flex          : 1,
    justifyContent: 'flex-end',
    alignItems    : 'center',
    height        : undefined,
    width         : undefined
  },
  toolsContainer: {
    flex          : 0,
    width         : Dimensions.get('window').width,
    height        : 70,
    justifyContent: 'center',
    alignItems    : 'center',
    backgroundColor: Colors.transparentDark
  },
  capture       : {
    flex           : 0,
    color          : '#000',
    padding        : 10,
  }
});
