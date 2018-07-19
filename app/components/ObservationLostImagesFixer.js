import React, {Component} from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import realm from '../db/Schema'
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
      observations  : [],
      updateMessage : '',
      fixing        : false,
      done          : false
    }

    this.fs = new File()
  }

  /**
   * Find broken observations
   */
  componentDidMount() {
    this.api_token = User.loggedIn() ? User.user().api_token : null

    this.getBrokenObservations()
  }

  /**
   * The user doesn't want to see this modal again.
   * Set the app state to never show this again.
   *
   * @return {Promise<void>}
   */
  async neverShowAgain() {
    await AsyncStorage.setItem('@appState:shouldFixObservations', 'no')

    this.setState({show: false})
  }

  /**
   * Get all synced observations that have not been previously inspected
   * and check if they have missing images.
   *
   * @return {Promise<void>}
   */
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

      let all    = realm.objects('Submission').filtered('imagesFixed = false AND serverID > 0')
      let length = all.length
      for (let i = 0; i < length; i++) {
        let observation = all[i]

        if (typeof observation !== 'object') {
          continue
        }

        let needsFixing = await this.needsFixing(observation)
        if (!needsFixing) {
          realm.write(() => {
            //observation.imagesFixed = true
          })
          continue
        }
        observations.push(observation)
      }

      if (observations.length > 0) {
        this.setState({observations, show: true})
      }
    } catch (e) {
      console.error('Unable to detect if observation needs fixing', e)
    }
  }

  /**
   * Check if an observation needs fixing.
   * An observation needs to be fixed if one or more images
   * are missing for the disk.
   *
   * @param {Object} observation
   * @return {Promise<boolean>}
   */
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
        if (image.indexOf('http') === 0) {
          continue
        }

        let exists = await this.fs.exists(image)
        if (!exists) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Run through the state observations and start fixing them.
   *
   * @return {Promise<void>}
   */
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
        console.error('Unable to download', e)
      }
    }

    this.setState({done: true, fixing: false})
  }

  /**
   * Fix an individual observation by getting
   * its images from the server.
   *
   * @param observation
   * @return {Promise<void>}
   */
  async fix(observation) {
    try {
      let response          = await axios.get(`/observation/${observation.serverID}?api_token=${this.api_token}`)
      let data              = response.data.data
      let images            = data.images
      let observationImages = JSON.parse(observation.images)
      let downloadedImages  = await this.downloadImages(images)
      await this.deleteImages(observationImages, downloadedImages)
      realm.write(() => {
        observation.images      = JSON.stringify(downloadedImages)
        observation.imagesFixed = true
      })
    } catch (e) {
      console.error('HERE Unable to fix this observation', e, e.response)
    }
  }

  /**
   * Do the downloading of an image.
   *
   * @param {Object} images
   * @return {Promise<void>}
   */
  async downloadImages(images) {
    let downloadedImages = {}

    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      downloadedImages[i] = []
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
        }
      }
    }

    return downloadedImages
  }

  /**
   * Recursively flatten an object.
   *
   * @param {Object|Array} o
   * @returns {Array}
   */
  flattenObject(o) {
    let results = []
    Object.keys(o).map(key => {
      let o2 = o[key]
      if (typeof o2 === 'object' && !Array.isArray(o2)) {
        o2 = this.flattenObject(o2)
      }
      if (Array.isArray(o2)) {
        o2.map(item => {
          results.push(this.fs.image(item))
        })
      }
    })
    return results
  }

  /**
   * Delete a list of images
   *
   * @param {Object<Object>} images
   * @param {Object<Object>} except
   * @return {Promise<void>}
   */
  async deleteImages(images, except) {
    except = this.flattenObject(except)

    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      for (let j in images[i]) {
        if (!images[i].hasOwnProperty(j)) {
          continue
        }

        let image = images[i][j]

        if (except.indexOf(image) > -1) {
          continue
        }

        if (await this.fs.exists(image)) {
          await this.fs.deleteAsync(image)
        }

        image = this.fs.image(image)
        if (await this.fs.exists(image)) {
          await this.fs.deleteAsync(image)
        }

        let thumbnail = this.fs.thumbnail(image)
        if (await this.fs.exists(thumbnail)) {
          await this.fs.deleteAsync(thumbnail)
        }
      }
    }
  }

  /**
   * Show the message that tells the user we found issues.
   *
   * @return {*}
   */
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
          We found an issue with {this.state.observations.length} observations!
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

  /**
   * Show the progress.
   *
   * @return {*}
   */
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

  /**
   * Render the three options footer.
   *
   * @return {*}
   */
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

  /**
   * Render the run in background button.
   *
   * @return {*}
   */
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

  /**
   * Render all views.
   *
   * @return {*}
   */
  renderFixViews() {
    if (this.state.done) {
      return (
        <View style={{
          flex          : 1,
          justifyContent: 'center',
          alignItems    : 'center',
          padding       : 10
        }}>
          <Text style={{
            fontSize: 14,
            color   : '#222'
          }}>
            All observations have been fixed successfully.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding        : 10,
              marginTop      : 20,
              borderRadius   : 2
            }}
            onPress={() => {
              this.setState({show: false})
            }}>
            <Text style={{
              fontSize  : 14,
              color     : Colors.primaryText,
              fontWeight: 'bold'
            }}>
              Done
            </Text>
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

  /**
   * Create the modal.
   *
   * @return {*}
   */
  render() {
    return (
      <Modal
        animationType={'slide'}
        visible={this.state.show}
        onRequestClose={() => {
          this.setState({show: false})
        }}
      >
        {this.renderFixViews()}
      </Modal>
    )
  }
}
