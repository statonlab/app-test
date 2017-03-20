import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import Header from '../components/Header'
import MapView from 'react-native-maps'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

export default class SubmittedScene extends Component {
  constructor(props) {
    super(props)

    let data    = this.props.plant
    this.marker = {
      title      : data.title,
      image      : data.image,
      description: `${data.numberOfTrees} trees`,
      coordinates: {
        latitude : data.location.latitude,
        longitude: data.location.longitude
      }
    }
  }

  componentDidMount() {
    this.goToMarker({
      latitude : this.marker.coordinates.latitude,
      longitude: this.marker.coordinates.longitude
    })
  }

  goToMarker(marker) {
    this.refs.map.animateToRegion({
      latitude      : marker.latitude,
      longitude     : marker.longitude,
      latitudeDelta : 0.0922,
      longitudeDelta: 0.0421
    }, 1000);
  }

  render() {
    let marker = this.marker
    return (
      <View style={styles.container}>
        <Header title="Submission Aerial View" navigator={this.props.navigator} showLeftIcon={false} showRightIcon={false}/>
        <MapView
          style={styles.map}
          ref="map"
          onRegionChangeComplete={() => {this.refs.marker.showCallout()}}>
          <MapView.Marker
            ref="marker"
            coordinate={marker.coordinates}
            pinColor={Colors.primary}>
            <MapView.Callout style={{width: 165}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Image source={{uri: marker.image}} style={{width: 45, height: 45}}/>
                <View style={{flex: 1, marginLeft: 5, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <Text style={[styles.calloutText, {flex: 1, fontWeight: '500'}]}>{marker.title}</Text>
                  <Text style={[styles.calloutText, {color: '#666'}]}>{marker.description} found in this area</Text>
                </View>
              </View>
            </MapView.Callout>
          </MapView.Marker>
        </MapView>

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
    flex : 1,
    width: undefined,
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
