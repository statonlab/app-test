import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import MapView from 'react-native-maps'
import Colors from '../helpers/Colors'

export default class MarkersMap extends Component {
  componentDidMount() {
    if (this.props.startingMarker !== null) {
      this.zoomToMarker(this.props.startingMarker)
    }
  }

  zoomToMarker(marker) {
    setTimeout(() => {
      this.refs.map.animateToRegion({
        latitude      : marker.coord.latitude,
        longitude     : marker.coord.longitude,
        latitudeDelta : 0.0322,
        longitudeDelta: 0.0321
      }, 1000)
    }, 500)

    setTimeout(() => {
      this.refs.startingMarker.showCallout()
    }, 1500)
  }

  render() {
    return (
      <MapView
        style={styles.map}
        ref="map"
      >
        {this.props.markers.map(this.renderMarker)}
        {this.props.startingMarker !== null ? this.renderStartingMarker(this.props.startingMarker) : null}
      </MapView>
    )
  }

  renderCallout(marker) {
    return (
      <MapView.Callout style={{width: 165}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Image source={{uri: marker.image}} style={{width: 45, height: 45}}/>
          <View style={{flex: 1, marginLeft: 5, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <Text style={[styles.calloutText, {flex: 1, fontWeight: '500'}]}>{marker.title}</Text>
            <Text style={[styles.calloutText, {color: '#666'}]}>{marker.description}</Text>
          </View>
        </View>
      </MapView.Callout>
    )
  }

  renderMarker(marker, index) {
    return (
      <MapView.Marker
        key={index}
        coordinate={marker.coord}
        pinColor={marker.pinColor}
      >
        {this.renderCallout(marker)}
      </MapView.Marker>
    )
  }

  renderStartingMarker(marker) {
    return (
      <MapView.Marker
        key="1010"
        ref="startingMarker"
        coordinate={marker.coord}
        pinColor={marker.pinColor}
      >
        {this.renderCallout(marker)}
      </MapView.Marker>
    )
  }
}

MarkersMap.propTypes = {
  ...MapView.propTypes,
  markers       : PropTypes.array,
  startingMarker: PropTypes.object
}

MarkersMap.defaultProps = {
  markers       : [],
  startingMarker: null
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    width: undefined,
    flex : 1
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
