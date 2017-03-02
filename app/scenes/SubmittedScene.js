import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  AsyncStorage
} from 'react-native'
import Header from '../components/Header'
import MapView from 'react-native-maps'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

export default class SubmittedScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      markers: []
    }

    try {
      AsyncStorage.getItem('@WildType:savedForm').then((savedData) => {
        let data    = JSON.parse(savedData)
        let markers = [
          {
            title      : data.title,
            image      : data.image,
            description: `${data.treeStandNumber} trees`,
            coord      : {
              latitude : data.location.latitude,
              longitude: data.location.longitude
            }
          }
        ]
        this.setState({markers: markers})
        this.goToMarker({latitude: markers[0].coord.latitude, longitude: markers[0].coord.longitude})
      })
    } catch (error) {
      console.log(error)
    }

  }

  goToMarker(marker) {
    this.onPressMarker(marker)
    this.marker.showCallout()
  }

  onPressMarker(marker) {
    this.refs.map.animateToRegion({
      latitude      : parseFloat(marker.latitude),
      longitude     : parseFloat(marker.longitude),
      latitudeDelta : 0.0922,
      longitudeDelta: 0.0421
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={"Submission Aerial View"} navigator={this.props.navigator}/>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          ref="map">
          {this.state.markers.map((marker, index) => {
            if (typeof marker == "undefined") return;

            return (
              <MapView.Marker
                ref={ref => { this.marker = ref; }}
                key={index}
                coordinate={marker.coord}>
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
            )
          })}
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
    color: '#444'
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
