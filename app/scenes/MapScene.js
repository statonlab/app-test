import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import GeoLocation from '../components/GeoLocation'
import Header from '../components/Header'

export default class LandingScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title={this.props.title} navigator={this.props.navigator}/>
        <GeoLocation/>
      </View>
    )
  }
}

LandingScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    flexDirection: 'column'
  },
});
