import React, {Component, PropTypes} from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'

export default class HealthSafetyScene extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Header title="Health and Safety" navigator={this.props.navigator} elevation={2}/>
        <ScrollView style={styles.scrollView}>


          <View style={styles.card}>
            <Text style={styles.title}>Health and Safety Policy</Text>
            <Text style={styles.textBody}>Navigating any environment, whether hiking through forests or exploring urban areas, involves some level of risk. To minimize this risk, please be careful while using the TreeSource app and ensure your personal safety.
            </Text>
            <Text style={styles.textBody}>
              While we do not anticipate that use of this app will increase your level of risk, be aware of your surroundings while sampling trees and take all necessary steps to ensure your safety. TreeSource is not responsible for any injuries sustained while using the TreeSource app.
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

HealthSafetyScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({

  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  scrollView: {
    flex           : 1,
    paddingVertical: 5
  },

  card: {
    ...(new Elevation(2)),
    backgroundColor: '#fff',
    padding        : 10,
    margin         : 5,
    borderRadius   : 2
  },

  title: {
    color     : '#222',
    fontWeight: '500',
    fontSize  : 16
  },

  textBody: {
    color     : '#444',
    fontSize  : 14,
    lineHeight: 16,
    marginTop : 10
  }
})