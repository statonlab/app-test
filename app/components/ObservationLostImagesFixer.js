import React, {Component} from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import Observation from '../helpers/Observation'
import realm from '../db/Schema'
import Diagnostics from '../helpers/Diagnostics'
import File from '../helpers/File'
import Colors from '../helpers/Colors'
import {isIphoneX} from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Ionicons'
import User from '../db/User'
import axios from '../helpers/Axios'
import {MKSpinner} from 'react-native-material-kit'

export default class ObservationLostImagesFixer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show          : false,
      doInBackground: false,
      fixedAll      : false,
      observations  : [],
      updateMessage : '',
      fixing        : false,
      done          : false
    }

    this.fs = new File()
  }

  componentDidMount() {
    this.api_token = User.loggedIn() ? User.user().api_token : null

    this.getBrokenObservations()
  }

  async neverShowAgain() {
    await AsyncStorage.setItem('@appState:shouldFixObservations', 'no')

    this.setState({show: false})
  }

  async getBrokenObservations() {
    if (!User.loggedIn()) {
      return
    }

    try {
      let shouldFix = await AsyncStorage.getItem('@appState:shouldFixObservations')
      if (shouldFix === 'no') {
        return
      }

      let observations = []

      let all = realm.objects('Submission').filtered('synced == true && imagesFixed == false && serverID != -1')
      for (let i in all) {
        if (!all.hasOwnProperty(i)) {
          continue
        }

        let observation = all[i]

        if (typeof observation !== 'object') {
          continue
        }

        if (!await this.needsFixing(observation)) {
          realm.write(() => {
            observation.imagesFixed = true
          })
          continue
        }

        observations.push(observation)
      }

      if (observations.length === 0) {
        this.setState({fixedAll: true})
      } else {
        this.setState({observations, show: true})
      }
    } catch (e) {
      console.log('HERE Observation Could Not Get Fixed', e)
    }
  }

  async needsFixing(observation) {
    let images = JSON.parse(observation.images)
    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      for (let j in images[i]) {
        if (!images[i].hasOwnProperty(j)) {
          continue
        }

        let image = this.fs.image(images[i][j])

        let exists = await this.fs.exists(image)
        if (!exists) {
          return true
        }
      }
    }

    return false
  }

  async fixAll() {
    let i            = 1
    let total        = this.state.observations.length
    let observations = this.state.observations
    this.setState({fixing: true})

    while (observations.length > 0) {
      this.setState({updateMessage: `Fixing ${i} out of ${total} observations`})
      let observation = observations.pop()
      try {
        await this.fix(observation)
        i++
      } catch (e) {
        console.log('HERE 2 Unable to download', e)
      }
    }

    this.setState({done: true})
  }

  async fix(observation) {
    try {
      let response         = await axios.get(`/observation/${observation.serverID}?api_token=${this.api_token}`)
      let data             = response.data.data
      let images           = data.images
      let downloadedImages = await this.downloadImages(images)
      await this.deleteImages(JSON.parse(observation.images))
      realm.write(() => {
        observation.images      = JSON.stringify(downloadedImages)
        observation.imagesFixed = true
      })
    } catch (e) {
      console.log('HERE Unable to fix this observation', e, e.response)
    }
  }

  async downloadImages(images) {
    let downloadedImages = {}

    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      for (let j in images[i]) {
        if (!images[i].hasOwnProperty(j)) {
          continue
        }

        let image = images[i][j]

        try {
          let path = await this.fs.downloadImage(image)

          downloadedImages[i][j] = this.fs._moveImage(path, image)
        } catch (error) {
          downloadedImages[i][j] = image
          console.log('Download error: ', error, image)
        }
      }
    }

    return downloadedImages
  }

  async deleteImages(images) {
    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      for (let j in images[i]) {
        if (!images[i].hasOwnProperty(j)) {
          continue
        }
        let image = images[i][j]
        if (await this.fs.exists(image)) {
          await this.fs.deleteAsync(image)
        }

        image = this.fs.image(image)
        if (await this.fs.exists(image)) {
          await this.fs.deleteAsync(image)
        }
      }
    }
  }

  renderInitialMessage() {
    return (
      <View style={{
        flex             : 1,
        alignItems       : 'center',
        justifyContent   : 'center',
        backgroundColor  : '#f7f7f7',
        paddingHorizontal: 10
      }}>
        <Icon name={'ios-bug-outline'} size={70} color={'#777'} style={{marginBottom: 10}}/>
        <Text style={{
          color       : '#222',
          fontSize    : 14,
          fontWeight  : 'bold',
          marginBottom: 5
        }}>
          We found an issue with your observations!
        </Text>
        <Text style={{
          color       : '#222',
          fontSize    : 14,
          marginBottom: 5
        }}>
          It looks like some observation pictures are missing. They were either accidentally deleted due
          to a previous bug or removed by your operating system to clear space.
        </Text>
        <Text style={{
          color   : '#222',
          fontSize: 14
        }}>
          By clicking fix now, you can restore missing pictures by downloading synced images from the TreeSnap server.
        </Text>
      </View>
    )
  }

  renderFixingProgress() {
    return (
      <View style={{
        flex             : 1,
        alignItems       : 'center',
        justifyContent   : 'center',
        backgroundColor  : '#f7f7f7',
        paddingHorizontal: 10
      }}>
        <MKSpinner style={{marginBottom: 15}}/>
        <Text style={{
          color       : '#222',
          fontSize    : 14,
          fontWeight  : 'bold',
          marginBottom: 5
        }}>
          {this.state.updateMessage}
        </Text>
      </View>
    )
  }

  renderOptionsFooter() {
    return (
      <View style={{height: 40, backgroundColor: '#222', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            flex           : 1,
            backgroundColor: '#eee',
            justifyContent : 'center',
            alignItems     : 'center'
          }}
          onPress={this.neverShowAgain.bind(this)}>
          <Text style={{
            color   : '#222',
            fontSize: 14
          }}>Never Ask Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex           : 1,
            backgroundColor: '#222',
            justifyContent : 'center',
            alignItems     : 'center'
          }}
          onPress={() => {
            this.setState({show: false})
          }}>
          <Text style={{
            color   : Colors.primaryText,
            fontSize: 14
          }}>Later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex           : 1,
            backgroundColor: Colors.primary,
            justifyContent : 'center',
            alignItems     : 'center'
          }}
          onPress={() => {
            this.fixAll()
          }}>
          <Text style={{
            color     : Colors.primaryText,
            fontSize  : 14,
            fontWeight: '500'
          }}>Fix Now</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFixingFooter() {
    return (
      <View style={{height: 40, backgroundColor: '#222', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            flex           : 1,
            backgroundColor: '#222',
            justifyContent : 'center',
            alignItems     : 'center'
          }}
          onPress={() => {
            this.setState({show: false})
          }}>
          <Text style={{
            color   : Colors.primaryText,
            fontSize: 14
          }}>Continue in Background</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFixViews() {
    if(this.state.done) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}>
          <TouchableOpacity onPress={() => {
            this.setState({show: false})
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{
        flex: 1
      }}>
        {this.state.fixing ? this.renderFixingProgress() : this.renderInitialMessage()}
        {this.state.fixing ? this.renderFixingFooter() : this.renderOptionsFooter()}
        {isIphoneX() ? <View style={{backgroundColor: '#f7f7f7', height: 20}}/> : null}
      </View>
    )
  }

  render() {
    return (
      <Modal visible={this.state.show}
             onRequestClose={() => {
               this.setState({show: false})
             }}
      >
        {this.renderFixViews()}
      </Modal>
    )
  }
}
