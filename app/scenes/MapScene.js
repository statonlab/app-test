import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Alert
} from 'react-native'
import MarkersMap from '../components/MarkersMap'
import Header from '../components/Header'
import realm from '../db/Schema'

export default class MapScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title={this.props.title} navigator={this.props.navigator}/>
        {this.renderMap()}
      </View>
    )
  }

  renderMap() {
    let submissions = realm.objects('Submission')
    let markers     = []

    if (submissions.length < 1) {
      Alert.alert('You have not submitted any entries. Once you do, they will show on this map.')
    }

    submissions.map((submission, index) => {
      markers.push({
        title      : submission.name,
        image      : submission.image,
        description: 'What should we put here?',
        coord      : {
          longitude: submission.location.longitude,
          latitude : submission.location.latitude
        }
      })
    })

    return <MarkersMap markers={markers}/>
  }
}

MapScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
});
