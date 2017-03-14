import React, {Component, PropTypes} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import MapView from 'react-native-maps'

export default class MarkersMap extends Component {

  componentDidMount() {
    console.log(this.props.markers)
  }

  render() {
    return (
      <MapView
        style={styles.map}
        ref="map">
        {this.props.markers.map((marker, index) => {
          <MapView.Marker
            onPress={() => this.onPressMarker(marker.coord)}
            onSelect={() => this.onPressMarker(marker.coord)}
            key={index}
            coordinate={marker.coord}
            description={marker.description}
            title={marker.title}
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

MarkersMap.propTypes = {
  ...MapView.propTypes,
  markers: PropTypes.array
}

MarkersMap.defaultProps = {
  markers: []
}


const styles = StyleSheet.create({
  map: {
    width: undefined,
    flex : 1
  },
})
