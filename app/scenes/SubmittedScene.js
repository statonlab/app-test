import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native'
import GeoLocation from '../components/GeoLocation'
import Header from '../components/Header'
import MapView from 'react-native-maps'

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
            description: `${data.treeStandNumber} Trees`,
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
    this.refs.markers.showCallout()
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
        <Header title={"Submission View"} navigator={this.props.navigator}/>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          ref="map">
          {this.state.markers.map((marker, index) => {
            if (typeof marker == "undefined") return;

            return (
              <MapView.Marker
                ref="markers"
                onPress={() => this.onPressMarker(marker.coord)}
                onSelect={() => this.onPressMarker(marker.coord)}
                key={index}
                coordinate={marker.coord}
                description={marker.description}
                title={marker.title}
              />
            )
          })}
        </MapView>
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
})
