import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {View, ScrollView, StyleSheet, Text, BackHandler} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Atext from '../components/Atext'

export default class AboutScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="About Us"
          navigator={this.navigator}
          elevation={2}
          initial={true}
          onMenuPress={() => this.navigator.navigate('DrawerToggle')}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>TreeSnap</Text>
            <Text style={styles.textBody}>App version: 1.0.5</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>The TreeSnap Project</Text>
            <Text style={styles.textBody}>Help our nation’s trees!</Text>
            <Text style={styles.textBody}>TreeSnap.org</Text>
            <Text style={styles.textBody}>Invasive diseases and pests threaten the health of
              America’s forests.
              Scientists are working to understand what allows some individual trees to survive, but
              they need to find healthy, resilient trees in the forest to study.
              That’s where concerned foresters, landowners, and citizens (you!) can help.</Text>
            <Text style={styles.textBody}>Tag trees you find in your community, on your property, or
              out in the wild to help us understand Forest health! To learn more, visit our website
              at <Atext url="treeSnap.org">treeSnap.org</Atext>
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>The TreeSnap Team</Text>
            <Text style={styles.textBody}>TreeSnap is developed as a collaboration between
              scientists at the University of Tennessee Knoxville and the Forest Health Research
              Center at the University of Kentucky. TreeSnap was funded by the <Atext
                url="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1444573"> NSF Plant Genome
                Research Program, award 1444573</Atext>.</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

AboutScreen.PropTypes = {
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
