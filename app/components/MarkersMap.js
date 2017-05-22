import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import MapView from 'react-native-maps'
import Colors from '../helpers/Colors'

export default class MarkersMap extends Component {
  /**
   * Call zoom to marker if a starting marker is specified.
   */
  componentDidMount() {
    if (this.props.startingMarker !== null) {
      if (this.props.zoom) {
        this.zoomToMarker(this.props.startingMarker)
      } else {
        this.showStartingMarkerCallout()
      }
    }
  }

  showStartingMarkerCallout() {
    let time = () => {
      setTimeout(() => {
        if (this.refs.startingMarker) {
          if (typeof this.refs.startingMarker.showCallout === 'function') {
            this.refs.startingMarker.showCallout()
          } else {
            time()
          }
        } else {
          time()
        }
      }, 500)
    }
    time()
  }

  /**
   * Zooms to the given marker and shows the callout of the starting marker.
   *
   * @param marker
   */
  zoomToMarker(marker) {
    setTimeout(() => {
      this.refs.map.animateToRegion({
        latitude      : marker.coord.latitude,
        longitude     : marker.coord.longitude,
        latitudeDelta : 0.0322,
        longitudeDelta: 0.0321
      }, 1000)
    }, 500)

    this.showStartingMarkerCallout()
  }

  /**
   * Render Scene.
   *
   * @returns {XML}
   */
  render() {
    return (
      <MapView
        {...this.props}
        style={styles.map}
        ref="map"
      >
        {this.props.markers.map(this.renderMarker.bind(this))}
        {this.props.startingMarker !== null ? this.renderStartingMarker(this.props.startingMarker) : null}
      </MapView>
    )
  }

  /**
   * Render the callout for a marker.
   *
   * @param marker
   * @returns {XML}
   */
  renderCallout(marker) {
    return (
      <MapView.Callout style={{width: 165}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          {!marker.image ? null :
            <Image source={{uri: marker.image}} style={{width: 45, height: 45}}/>
          }
          <View style={{flex: 1, marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={[styles.calloutText, {flex: 0, fontWeight: '500'}]}>{marker.title}</Text>
            <Text style={[styles.calloutText, {color: '#666'}]}>{marker.description}</Text>
          </View>
        </View>
      </MapView.Callout>
    )
  }

  /**
   * Render the marker on the map.
   *
   * @param marker
   * @param index
   * @returns {XML}
   */
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

  /**
   * Render the starting marker. This is a separate method because we
   * need to assign a ref to the marker.
   *
   * @param marker
   * @returns {XML}
   */
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
  startingMarker: PropTypes.object,
  zoom          : PropTypes.bool
}

MarkersMap.defaultProps = {
  markers       : [],
  startingMarker: null,
  zoom          : false
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
