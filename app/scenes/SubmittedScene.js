import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import Header from '../components/Header'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import realm from '../db/Schema'
import MarkersMap from '../components/MarkersMap'
import File from '../helpers/File'

export default class SubmittedScene extends Component {
  constructor(props) {
    super(props)

    this.state  = {
      shouldNavigate: true
    }
    this.id     = this.props.plant.id
    this.marker = {}
    this.fs     = new File()
  }


  navigateCallout = (marker) => {
    console.log(marker)
    if (this.state.shouldNavigate) {
      let plant = realm.objects('Submission').filtered(`id == ${marker.plant.id}`)
      this.props.navigator.push({
        label: 'ObservationScene',
        plant: marker.plant
      })
    }
    this.setState({shouldNavigate: false})
  }

  renderMap() {
    let submissions = realm.objects('Submission')
    let markers     = []

    submissions.map(submission => {
      let image = JSON.parse(submission.images)
      if (Array.isArray(image['images'])) {
        image = image['images'][0]
      }

      let marker = {
        title      : submission.name,
        image      : this.fs.thumbnail(image),
        description: `${submission.location.latitude.toFixed(4)}, ${submission.location.longitude.toFixed(4)}`,
        coord      : {
          latitude : submission.location.latitude,
          longitude: submission.location.longitude
        },
        pinColor   : Colors.primary,
        plant      : submission
      }

      if (submission.id === this.id) {
        marker.pinColor = Colors.info
        this.marker     = marker
      }

      markers.push(marker)
    })

    return (
      <MarkersMap
        markers={markers}
        initialRegion={{
          ...this.marker.coord,
          latitudeDelta : 0.0322,
          longitudeDelta: 0.0321
        }}
        startingMarker={this.marker}
        onCalloutPress={this.navigateCallout}

      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Submission Aerial View" navigator={this.props.navigator} showLeftIcon={false} showRightIcon={false}/>
        {this.renderMap()}

        <View style={styles.footer}>
          <Text style={styles.text}>Your entry has been saved!</Text>
          <MKButton
            style={styles.button}
            onPress={() => this.props.navigator.popToTop()}>
            <Text style={styles.buttonText}>Continue</Text>
          </MKButton>
        </View>
      </View>
    )
  }
}

SubmittedScene.propTypes = {
  navigator: PropTypes.object.isRequired,
  plant    : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    flex  : 1,
    width : undefined,
    height: undefined
  },

  calloutText: {
    fontSize: 12,
    color   : '#444'
  },

  footer: {
    flex           : 0,
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
    padding        : 10,
    backgroundColor: '#24292e'
  },

  button: {
    ...(new Elevation(2)),
    backgroundColor  : Colors.warning,
    paddingVertical  : 10,
    paddingHorizontal: 15,
    borderRadius     : 2,
    marginLeft       : 15
  },

  buttonText: {
    color    : Colors.warningText,
    textAlign: 'center'
  },

  text: {
    color     : '#eee',
    fontWeight: '500'
  }
})
