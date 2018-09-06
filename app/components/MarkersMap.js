import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native'
import MapView from 'react-native-maps'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/Ionicons'

export default class MarkersMap extends Component {
  constructor(props) {
    super(props)
    this.fitted = false

    this.state = {
      type          : 'standard',
      types         : {
        'standard': 'Map',
        'hybrid'  : 'Satellite',
        ...Platform.select({
          ios    : {},
          android: {
            'terrain': 'Topographic'
          }
        })
      },
      typeDimensions: {}
    }
  }

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
   * @returns {{XML}}
   */
  render() {
    const types = this.state.types
    const width = Dimensions.get('window').width
    const lastItemStyle = {
      borderTopRightRadius   : 20,
      borderBottomRightRadius: 20,
      borderRightWidth       : 0
    }
    return (
      <View style={{flex: 1}}>
        <MapView
          {...this.props}
          mapType={this.state.type}
          style={styles.map}
          ref="map"
          onMapReady={() => {
            if (this.props.markers.length && !this.fitted) {
              this.fitted = true
              this.refs.map.fitToElements(true)
            }
          }}
        >
          {this.props.markers.map(this.renderMarker.bind(this))}
          {this.props.startingMarker !== null ? this.renderStartingMarker(this.props.startingMarker) : null}
        </MapView>
        <View style={{
          position       : 'absolute',
          backgroundColor: '#f7f7f7',
          flexDirection  : 'row',
          bottom         : 10,
          right          : 60,
          width          : Platform.select({ios: 200, android: 250}),
          borderRadius   : 20,
          ...(new Elevation(5))
        }}>
          {Object.keys(types).map((key, i) => {
            return (
              <TouchableOpacity
                style={{
                  flex            : 1,
                  backgroundColor : '#fff',
                  height          : 40,
                  justifyContent  : 'center',
                  alignItems      : 'center',
                  borderRightWidth: 1,
                  borderColor     : '#eee',
                  ...(i === 0 ? {
                    borderTopLeftRadius   : 20,
                    borderBottomLeftRadius: 20
                  } : null),
                  ...Platform.select({
                    ios    : i === 1 ? lastItemStyle : null,
                    android: i === 2 ? lastItemStyle: null
                  })
                }}
                key={key}
                onPress={() => {
                  this.setState({type: key})
                }}>
                <Text style={{
                  fontSize: 12,
                  color   : '#444',
                  ...(this.state.type === key ? {color: Colors.primary, fontWeight: 'bold'} : {})
                }}>{types[key]}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity
          onPress={() => {
            navigator.geolocation.getCurrentPosition(
              ({coords}) => {
                if (this.refs.map) {
                  this.refs.map.animateToRegion({
                    latitude      : coords.latitude,
                    longitude     : coords.longitude,
                    latitudeDelta : 0.059,
                    longitudeDelta: 0.059
                  })
                }
              },
              (error) => Alert.alert('Location Error', 'Are location services on?'),
              {enableHighAccuracy: true}
            )
          }}
          style={{
            position       : 'absolute',
            bottom         : 10,
            right          : 10,
            backgroundColor: '#fff',
            borderRadius   : 20,
            height         : 40,
            width          : 40,
            alignItems     : 'center',
            justifyContent : 'center',
            ...(new Elevation(5))
          }}>
          <Icon name={Platform.select({ios: 'ios-locate-outline', android: 'md-locate'})}
                color={'#222'}
                size={24}
                style={{
                  marginTop: Platform.select({ios: 2, android: 0}),
                  ...(new Elevation(2))
                }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  pressEvent(marker) {
    this.props.onCalloutPress(marker)
  }

  /**
   * Render the callout for a marker.
   *
   * @param marker
   * @returns {{XML}}
   */
  renderCallout(marker) {
    return (
      <MapView.Callout
        style={{width: 165}}
        onPress={() => this.pressEvent(marker)}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          {!marker.image ? null :
            <Image source={{uri: marker.image}} style={{width: 45, height: 45, resizeMode: 'cover'}}/>
          }
          <View style={{flex: 1, marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={[styles.calloutText, {flex: 0, fontWeight: '500'}]}>{marker.title}</Text>
            <Text style={[styles.calloutText, {color: '#666'}]}>{marker.description}</Text>
            <Text style={[styles.calloutText, {color: '#666'}]}>Tap to view</Text>
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
   * @returns {{XML}}
   */
  renderMarker(marker, index) {
    return (
      <MapView.Marker
        key={index}
        coordinate={marker.coord}
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
   * @returns {{XML}}
   */
  renderStartingMarker(marker) {
    return (
      <MapView.Marker
        key="startingMarker-451010"
        ref="startingMarker"
        coordinate={marker.coord}
        pinColor={marker.pinColor}
      >
        {this.renderCallout(marker)}
      </MapView.Marker>
    )
  }

  componentWillUnmount() {
    this.props.onUnmount()
  }
}

MarkersMap.propTypes = {
  ...MapView.propTypes,
  markers       : PropTypes.array,
  startingMarker: PropTypes.object,
  zoom          : PropTypes.bool,
  onCalloutPress: PropTypes.func,
  onUnmount     : PropTypes.func
}

MarkersMap.defaultProps = {
  markers       : [],
  startingMarker: null,
  zoom          : false,
  onCalloutPress: () => {
  },
  onUnmount     : () => {
  }
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
