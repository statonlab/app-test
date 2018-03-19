import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Alert,
  BackHandler,
  Text
} from 'react-native'
import MarkersMap from '../components/MarkersMap'
import Header from '../components/Header'
import realm from '../db/Schema'
import moment from 'moment'
import File from '../helpers/File'
import Colors from '../helpers/Colors'
import Guide from '../components/Guide'

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
      shouldNavigate: true,
      markers: []
    }
  }

  componentDidMount() {
    this.analytics.visitScreen('MapScreen')

    let submissions = realm.objects('Submission')
    let markers     = []

    submissions.map(submission => {
      let image = JSON.parse(submission.images)
      if (Array.isArray(image.images)) {
        image = this.fs.thumbnail(image.images[0])
      } else {
        image = ''
      }

      markers.push({
        id         : submission.id,
        title      : submission.name,
        image      : image,
        description: moment(submission.date, 'MM-DD-YYYY HH:mm:ss').fromNow(),
        coord      : {
          latitude : submission.location.latitude,
          longitude: submission.location.longitude
        }
      })
    })

    this.setState({markers})

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  renderGuideMessage() {
    return (
      [<View>
        <Text style={Guide.style.headerText}>
          Your Observations Map
        </Text>
        <Text style={Guide.style.bodyText}>
          This map displays all of your observed trees, whether they have been submitted to the server or not.
          Tap the markers on the map to view or edit an observation.
        </Text>
      </View>,
        <View>
          <Text style={Guide.style.headerText}>
            Privacy
          </Text>
          <Text style={Guide.style.bodyText}>
            This is your personal map, and does not show other users' observations. It also displays the exact location: these locations are protected on the TreeSnap website.
          </Text>
        </View>]
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Map"
                navigator={this.navigator}
                rightIcon="help"
                onRightPress={() => this.guide.show()}
                initial={true}
                onMenuPress={() => this.navigator.navigate('DrawerToggle')}/>
        <Guide
          ref={ref => this.guide = ref}
          screen={'MapScreen'}
          version={1}
          message={this.renderGuideMessage()}
        />
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
        markers={this.state.markers}
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
