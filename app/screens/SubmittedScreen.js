import React from 'react'
import Screen from './Screen'
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  Platform,
  Alert,
  NetInfo,
  DeviceEventEmitter
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import File from '../helpers/File'
import moment from 'moment'
import Observation from '../helpers/Observation'
import MapView from 'react-native-maps'
import {ACFCollection} from '../resources/descriptions'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import User from '../db/User'

export default class SubmittedScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    this.state   = {
      loading : false,
      uploaded: false
    }
    this.id      = this.params.plant.id
    this.fs      = new File()
    this.android = Platform.OS === 'android'
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.reset()
      return true
    })
  }

  renderImage(observation, android) {
    let images = JSON.parse(observation.images)
    let keys   = Object.keys(images)

    if (keys.length <= 0) {
      return null
    }

    let image = this.fs.image(images[keys[0]][0])
    return (
      <Image source={{uri: image}} style={android ? styles.androidImage : styles.image}/>
    )
  }

  renderCallout(observation) {
    return (
      <MapView.Callout>
        {this.renderImage(observation, true)}
      </MapView.Callout>
    )
  }

  renderMap(observation) {
    return (
      <MapView
        style={{height: 250, width: undefined}}
        initialRegion={{
          latitude      : observation.location.latitude,
          longitude     : observation.location.longitude,
          latitudeDelta : 0.0075,
          longitudeDelta: 0.0045
        }}
        mapType="hybrid"
      >
        <MapView.Marker
          coordinate={{
            latitude : observation.location.latitude,
            longitude: observation.location.longitude
          }}
          flat={false}
        >
          {this.android ? this.renderCallout(observation) : this.renderImage(observation)}
        </MapView.Marker>
      </MapView>
    )
  }

  renderSampleMailingInstructions(observation) {
    if (observation.name !== 'American Chestnut') {
      return null
    }

    return (
      <View style={[styles.card, {marginBottom: 22}]}>
        <Text style={styles.title}>
          Sample Collection Instructions
        </Text>
        {ACFCollection.map((item, index) => {
          return (
            <View key={index}>
              {item}
            </View>
          )
        })}
      </View>
    )
  }

  upload(observation) {
    this.setState({loading: true})

    NetInfo.getConnectionInfo().then(info => {
      let type = info.type.toLowerCase()
      if (type !== 'wifi' && type !== 'unknown') {
        Alert.alert('No WiFi Detected', 'Are you sure you want to upload without WiFi?', [
          {
            text   : 'Upload Now',
            onPress: () => {
              this.doUpload(observation)
            }
          },
          {
            text   : 'Cancel',
            onPress: () => {
              this.setState({loading: false})
            },
            style  : 'cancel'
          }
        ])

        return
      }

      this.doUpload(observation)
    })
  }

  doUpload(observation) {
    Observation.upload(observation).then(response => {
      this.setState({
        uploaded: true,
        loading : false
      })

      observation = realm.objects('Submission').filtered(`id == ${observation.id}`)[0]
      realm.write(() => {
        let data = response.data.data

        observation.serverID = data.observation_id
        observation.synced   = true
      })

      DeviceEventEmitter.emit('observationUploaded')
    }).catch(error => {
      this.setState({loading: false})

      if (!error.response) {
        Alert.alert('Connection Error', 'Please try uploading again later')
      }
    })
  }

  renderButtons(observation) {
    if (!User.loggedIn()) {
      return (
        <View style={[styles.row]}>
          <TouchableOpacity style={{padding: 10}}
                            onPress={() => {
                              this.navigator.reset()
                            }}>
            <Text style={{color: Colors.danger}}>Upload Later</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton}
                            onPress={() => this.navigator.navigate('Login')}>
            <Text style={styles.uploadText}>Login to Upload</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View>
        {this.state.uploaded ? null :
          <View style={styles.row}>
            <TouchableOpacity style={{padding: 10}}
                              onPress={() => {
                                this.navigator.reset()
                              }}>
              <Text style={{color: Colors.danger}}>Upload Later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton}
                              onPress={() => this.upload(observation)}>
              <Text style={styles.uploadText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.uploaded ?
          <View style={styles.row}>
            <Text style={{color: Colors.success}}>Observation Uploaded Successfully!</Text>
            <TouchableOpacity style={[styles.uploadButton, {
              backgroundColor: Colors.success,
              borderColor    : Colors.success
            }]}
                              onPress={() => this.navigator.reset()}>
              <Text style={[styles.uploadText, {color: Colors.successText}]}>Continue</Text>
            </TouchableOpacity>
          </View>
          : null}
      </View>
    )
  }

  render() {
    let observation = this.params.plant
    let data        = JSON.parse(observation.meta_data)
    return (
      <View style={styles.container}>
        <Header title="Observation Created"
                navigator={this.navigator}
                showLeftIcon={false}
                showRightIcon={false}
        />
        <ScrollView style={styles.container}>
          <View style={[styles.card]}>
            <Text style={{color: '#444'}}>
              You may upload your observation to the TreeSnap server now or choose to upload it later.
              It is best to upload observations when a WiFi connection is available.
            </Text>
          </View>

          {observation.name === 'American Chestnut' ?
            <View style={[styles.card]}>
              <Text style={[styles.text, {marginBottom: 5}]}>
                The American Chestnut Foundation requires a mailed twig and leaf sample to use your data. Scroll down for sample collection instructions.
              </Text>
              <Text style={[styles.text]}>
               Unique ID for mailing this submission:   {observation.id}
              </Text>
            </View>
            : null}

          <View style={[styles.card, {marginBottom: observation.name === 'American Chestnut' ? 0 : undefined}]}>
            {this.renderMap(observation)}
            <Text style={styles.title}>
              {observation.name === 'Other' ? `${observation.name} (${data.otherLabel})` : observation.name}
            </Text>
            <Text style={styles.textLight}>
              {moment(observation.date, 'MM-DD-YYYY HH:mm:ss').format('LLL')}
            </Text>
            <Text style={styles.textLight}>
              {observation.location.latitude}, {observation.location.longitude}
            </Text>

            {this.renderButtons(observation)}
          </View>

          {this.renderSampleMailingInstructions(observation)}
        </ScrollView>
        <Spinner show={this.state.loading}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  card: {
    backgroundColor : '#ffffff',
    marginTop       : 10,
    marginHorizontal: 5,
    borderRadius    : 5,
    padding         : 10,
    ...(new Elevation(1))
  },

  image: {
    resizeMode  : 'cover',
    height      : 95,
    width       : 95,
    borderRadius: 95 / 2,
    borderWidth : 5,
    borderColor : 'rgba(0,0,0,.25)'
  },

  title: {
    color       : '#444',
    fontSize    : 16,
    fontWeight  : '600',
    marginBottom: 5,
    marginTop   : 10
  },

  row: {
    flex          : 0,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    marginTop     : 10
  },

  text: {
    color     : '#444',
    fontWeight: '600'
  },

  textLight: {
    color       : '#777',
    marginBottom: 5
  },

  footer: {
    paddingHorizontal: 10,
    marginTop        : 5,
    justifyContent   : 'space-between',
    flexDirection    : 'row',
    backgroundColor  : '#f7f7f7',
    borderTopWidth   : 1,
    borderTopColor   : '#dddddd'
  },

  footerButton: {
    paddingHorizontal: 10,
    paddingVertical  : 15
  },

  footerButtonText: {
    color     : Colors.success,
    fontWeight: '500'
  },

  uploadButton: {
    paddingVertical  : 10,
    paddingHorizontal: 15,
    ...(Platform.select({
      ios    : {borderWidth: 1},
      android: null
    })),
    borderColor      : '#ddd',
    borderRadius     : 30,
    ...(new Elevation(1))
  },

  uploadText: {
    color: Colors.primary
  },

  androidImage: {
    resizeMode: 'cover',
    width     : 95,
    height    : 95
  },

  warningCard: {
    borderColor    : Colors.warning,
    backgroundColor: Colors.warning
  },

  warningText: {
    color     : Colors.warningText,
    fontWeight: 'normal'
  }
})
