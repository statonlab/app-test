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
import {isIphoneX} from 'react-native-iphone-x-helper'
import {ACFCollection} from '../resources/descriptions'
import Spinner from '../components/Spinner'
import User from '../db/User'
import Errors from '../helpers/Errors'
import realm from '../db/Schema'

export default class SubmittedScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    this.state   = {
      uploaded: false
    }
    this.id      = this.params.plant.id
    this.fs      = new File()
    this.android = Platform.OS === 'android'
  }

  componentDidMount() {
    this.analytics.visitScreen('SubmittedScreen')

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.navigate('Home')
      return true
    })
  }

  componentWillUnmount() {
    this.backEvent.remove()
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

  /**
   * Check whether we can upload using the current connection.
   *
   * @param observation
   */
  upload(observation) {
    this.spinner.open()

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
              this.spinner.close()
            },
            style  : 'cancel'
          }
        ])

        return
      }

      this.doUpload(observation)
    })
  }

  doUpload(observationParam) {
    let observation = realm.objects('Submission').filtered(`id == ${observationParam.id}`)
    if (observation.length <= 0) {
      Alert.alert('Error', 'An error occurred while uploading your observation. Please try again later.')
      return
    }
    observation = observation[0]

    let total = Observation.countImages(observation.images)
    let step  = 0

    this.spinner.setTitle('Uploading Images')
      .setProgressTotal(total)
      .setProgress(step)
      .open()

    Observation.upload(observation, () => {
      step++
      this.spinner.setProgress(step)
    }).then(response => {
      this.setState({
        uploaded: true
      })
      this.spinner.close()
      DeviceEventEmitter.emit('observationUploaded')
    }).catch(error => {
      this.spinner.close()
      const errors = new Errors(error)
      if (errors.has('general')) {
        Alert.alert('Error', errors.first('general'))
        return
      }

      let field = Object.keys(errors.all())[0]
      Alert.alert('Error', errors.first(field))
    })
  }

  renderButtons(observation) {
    if (!User.loggedIn()) {
      return (
        <View style={[styles.row, styles.bottomRow]}>
          <TouchableOpacity style={{padding: 10}}
                            onPress={() => {
                              this.navigator.popToTop()
                            }}>
            <Text style={{color: '#fff'}}>Upload Later</Text>
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
          <View style={[styles.row, styles.bottomRow]}>
            <TouchableOpacity style={{padding: 10}}
                              onPress={() => {
                                this.navigator.popToTop()
                              }}>
              <Text style={{color: '#fff'}}>Upload Later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton}
                              onPress={() => this.upload(observation)}>
              <Text style={styles.uploadText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.uploaded ?
          <View style={[styles.row, styles.bottomRow]}>
            <Text style={{color: Colors.primary}}>Observation Uploaded Successfully!</Text>
            <TouchableOpacity style={[styles.uploadButton, {
              backgroundColor: Colors.primary,
              borderColor    : Colors.primary
            }]} onPress={() => this.navigator.popToTop()}>
              <Text style={[styles.uploadText, {color: Colors.primaryText}]}>Continue</Text>
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
          <View style={[styles.card, {marginTop: 10}]}>
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
                Unique ID for mailing this submission: {observation.id}
              </Text>
            </View>
            : null}

          <View style={[styles.card, {marginBottom: observation.name === 'American Chestnut' ? 10 : undefined}]}>
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
          </View>

          {this.renderSampleMailingInstructions(observation)}
        </ScrollView>
        <View style={styles.mainFooter}>
          {this.renderButtons(observation)}
        </View>
        <Spinner ref={ref => this.spinner = ref}/>
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
    marginBottom    : 10,
    marginHorizontal: 5,
    borderRadius    : 5,
    padding         : 10,
    ...(new Elevation(1))
  },

  mainFooter: {
    backgroundColor: '#212121',
    padding        : 5,
    paddingBottom  : 10
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

  bottomRow: {
    paddingBottom: isIphoneX() ? 15 : 0
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
    borderRadius     : 30,
    backgroundColor  : Colors.primary,
    ...(new Elevation(1))
  },

  uploadText: {
    color: Colors.primaryText
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
