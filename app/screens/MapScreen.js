import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Alert,
  BackHandler
} from 'react-native'
import MarkersMap from '../components/MarkersMap'
import Header from '../components/Header'
import realm from '../db/Schema'
import moment from 'moment'
import File from '../helpers/File'
import Colors from '../helpers/Colors'

export default class MapScreen extends Screen {
  static navigationOptions = {
    tabBarOptions: {
      activeTintColor: Colors.primary
    }
  }

  constructor(props) {
    super(props)

    this.fs = new File()

    this.state = {
      shouldNavigate: true
    }
  }

  componentWillMount() {
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
        id         : submission.id,
        title      : submission.name,
        image      : this.fs.thumbnail(image),
        description: moment(submission.date, 'MM-DD-YYYY HH:mm:ss').fromNow(),
        coord      : {
          longitude: submission.location.longitude,
          latitude : submission.location.latitude
        }
      })
    })

    this.markers = markers

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Header title="Map"
                navigator={this.navigator}
                showRightIcon={false}
                initial={true}
                onMenuPress={() => this.navigator.navigate('DrawerToggle')}/>
        {this.renderMap()}
      </View>
    )
  }

  /**
   * The navigation function to be passed to the Marker callout. To prevent against bubble effect, we use shouldNavigate in the state.
   *
   * @param marker
   */
  navigateCallout(marker) {
    if (this.state.shouldNavigate) {
      if (marker.id === undefined) {
        return
      }
      let plant = realm.objects('Submission').filtered(`id == "${marker.id}"`)[0]
      this.navigator.navigate('Observation', {
        plant    : JSON.parse(JSON.stringify(plant)),
        onUnmount: () => {
          this.setState({shouldNavigate: true})
        }
      })

      this.setState({shouldNavigate: false})
    }
  }


  renderMap() {
    return (
      <MarkersMap
        initialRegion={{
          latitude      : 40.354388,
          longitude     : -95.998237,
          latitudeDelta : 60.0922,
          longitudeDelta: 60.0922
        }}
        markers={this.markers}
        onCalloutPress={this.navigateCallout.bind(this)}

      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  }
})
