import React, {Component, PropTypes} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import MapView from 'react-native-maps'

export default class GeoLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: {
        latitude      : 35.921918,
        longitude     : -84.028698,
        latitudeDelta : 0.015,
        longitudeDelta: 0.0121,
      },
      initialPosition: 'unknown',
      lastPosition   : 'unknown',
      markers        : []
    }
  }

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000}
    )
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position)
      let markers      = [
        ...this.state.markers,
        lastPosition.coords
      ]
      this.setState({lastPosition})
      this.setState({markers})
    })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  onRegionChange(region) {
    this.setState({currentLocation: region})
  }

  render() {
    return (
      <MapView
        style={styles.map}
        region={this.state.currentLocation}
        onRegionChange={this.onRegionChange.bind(this)}
        showsUserLocation={true}
        showsCompass={true}
        showsMyLocationButton={true}
        followUserLocation={true}
        zoomEnabled={true}>
        {this.state.markers.map((marker, index) => {
          if (typeof marker == "undefined") return;

          <MapView.Marker key="index"
            coordinate={marker.coords}
          />
        })}
      </MapView>
    )
  }
}

GeoLocation.propTypes = {
  ...MapView.propTypes
}

const styles = StyleSheet.create({
  map: {
    width: undefined,
    flex : 1
  },
})
