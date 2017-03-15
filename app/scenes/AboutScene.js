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
            <Text style={styles.title}>Organization</Text>
            <Text style={styles.textBody}>University of Tennessee at Knoxville</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.textBody}>Paragraph field</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Card With Two Paragraphs</Text>
            <Text style={styles.textBody}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Text>
            <Text style={styles.textBody}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Text>
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
    flex: 1,
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
    color       : '#222',
    fontWeight  : '500',
    fontSize    : 16
  },

  textBody: {
    color      : '#444',
    fontSize   : 14,
    lineHeight: 16,
    marginTop: 10
  }
})
