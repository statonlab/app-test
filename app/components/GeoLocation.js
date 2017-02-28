import React, {Component, PropTypes} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import MapView from 'react-native-maps'

const markers = [
  {
    title      : 'Dogwood',
    description: '>100 ft2',
    coord      : {
      latitude : 35.921918,
      longitude: -84.028698
    }
  },
  {
    title      : 'Hydrangea',
    description: '>1000 ft2',
    coord      : {
      latitude : 32.950287,
      longitude: -88.844245
    }
  }]


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
      markers        : [{
        coords: {
          latitude : 35.921918,
          longitude: -84.028698
        }
      }]
    }

    this.circles = [
      {
        radius: 7000,
        center: {
          latitude : 36.830540,
          longitude: -84.390603
        }
      }
    ]

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
        showsUserLocation={true}
        followUserLocation={true}
        ref="map">
        {markers.map((marker, index) => {
          if (typeof marker == "undefined") return;

          return (
            <MapView.Marker
              onPress={() => this.onPressMarker(marker.coord)}
              onSelect={() => this.onPressMarker(marker.coord)}
              key={index}
              coordinate={marker.coord}
              description={marker.description}
              title={marker.title}
            />
          )
        })}
        {this.circles.map((circle, index) => {
          <MapView.Circle
            key={index}
            center={circle.center}
            radius={circle.radius}
            fillColor={"#000"}
            onPress={() => this.onPressMarker(marker.coord)}
          />
        })}
      </MapView>
    )
  }

  onPressMarker(marker) {
    this.refs.map.animateToRegion({
      latitude      : parseFloat(marker.latitude),
      longitude     : parseFloat(marker.longitude),
      latitudeDelta : 0.0922,
      longitudeDelta: 0.0421
    }, 1000);
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
