import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, Text} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'

export default class AboutScene extends Component {


  render() {
    return (
      <View style={styles.container}>
        <Header title="About Us" navigator={this.props.navigator} elevation={2}/>
        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Treesnap</Text>
            <Text style={styles.textBody}>App version: 0.1</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>The Treesnap Project</Text>
            <Text style={styles.textBody}> Help our nation’s trees!</Text>
            <Text style={styles.textBody}> Invasive diseases and pests threaten the health of America’s forests.
              Scientists are working to understand what allows some individual trees to survive, but they need to find healthy, resilient trees in the forest to study.
              That’s where concerned foresters, landowners, and citizens (you!) can help.</Text>
            <Text style={styles.textBody}>
              Tag trees you find in your community, on your property, or out in the wild to help us understand Forest health!
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>The Treesnap Team</Text>
            <Text style={styles.textBody}>Treesnap is developed as a collaboration between Scientists at the University of Kentucky, the University of Tennessee Knoxville. </Text>
          </View>

        </ScrollView>
      </View>
    )
  }
}

AboutScene.PropTypes = {
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
