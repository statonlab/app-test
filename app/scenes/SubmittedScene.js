import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import Header from '../components/Header'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import realm from '../db/Schema'
import MarkersMap from '../components/MarkersMap'


export default class SubmittedScene extends Component {
  constructor(props) {
    super(props)

    let data     = this.props.plant
    this.marker  = {
      id : data.id,
      title      : data.title,
      image      : data.images[0],
      description: `${data.location.latitude}, ${data.location.longitude}`,
      coordinates: {
        latitude : data.location.latitude,
        longitude: data.location.longitude
      }
    }
  }



  componentDidMount() {
    // this.goToMarker({
    //   latitude : this.marker.coordinates.latitude,
    //   longitude: this.marker.coordinates.longitude
    // })

  }

  renderMap() {
    let submissions = realm.objects('Submission')
    let markers     = []

    submissions.map((submission, index) => {

      let marker = {
        title      : submission.name,
        image      : JSON.parse(submission.images)[0],
        description: 'What should we put here?',
        coord      : {
          longitude: submission.location.longitude,
          latitude : submission.location.latitude
        },
        pinColor : Colors.primary

      }

      if (submission.id == this.marker.id) {
        marker.pinColor = Colors.info
      }

      markers.push(marker)

    })

    return <MarkersMap markers={markers}
    />
  }

zoomToMarker = ()=>  {
  setTimeout(() => this.refs.map.animateToRegion({
    latitude      : submission.location.latitude,
    longitude     : submission.location.longitude,
    latitudeDelta : 0.0922,
    longitudeDelta: 0.0421
  }, 1000), 500)
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
  },
})
