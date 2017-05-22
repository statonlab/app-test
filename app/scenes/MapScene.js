import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Alert
} from 'react-native'
import MarkersMap from '../components/MarkersMap'
import Header from '../components/Header'
import realm from '../db/Schema'
import moment from 'moment'
import File from '../helpers/File'

export default class MapScene extends Component {
  constructor(props) {
    super(props)

    this.fs = new File()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={this.props.title} navigator={this.props.navigator} showRightIcon={false}/>
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
      let image = JSON.parse(submission.images)
      if (Array.isArray(image['images'])) {
        image = image['images'][0]
      }

      markers.push({
        title      : submission.name,
        image      : this.fs.thumbnail(image),
        description: moment(submission.date, 'MM-DD-YYYY HH:mm:ss').fromNow(),
        coord      : {
          longitude: submission.location.longitude,
          latitude : submission.location.latitude
        }
      })
    })

    return (
      <MarkersMap
        initialRegion={{
          latitude      : 40.354388,
          longitude     : -95.998237,
          latitudeDelta : 60.0922,
          longitudeDelta: 60.0922
        }}
        markers={markers}
      />
    )
  }
}

MapScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  }
})
