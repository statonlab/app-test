import React from 'react'
import Screen from './Screen'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  DeviceEventEmitter,
  Alert,
  Platform,
  TouchableOpacity,
  BackHandler,
  Share
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import DCP from '../resources/FormElements.js'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import SnackBarNotice from '../components/SnackBarNotice'
import axios from '../helpers/Axios'
import Icon from 'react-native-vector-icons/Ionicons'
import File from '../helpers/File'
import Elevation from '../helpers/Elevation'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Errors from '../helpers/Errors'
import ImageModal from '../components/ImageModal'
import ShareLinkModal from '../components/ShareLinkModal'
import Analytics from '../helpers/Analytics'
import AdvancedSettingsModal from '../components/AdvancedSettingsModal'

const android = Platform.OS === 'android'

export default class ObservationScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    this.state = {
      synced        : false,
      isLoggedIn    : false,
      needs_update  : false,
      noticeText    : '',
      entry         : null,
      images        : [],
      showShareModal: false,
      shareURL      : ''
    }

    this.user = realm.objects('User')[0]
    this.fs   = new File()

    this.events = []
  }

  /**
   * Set the synced and updated status.
   */
  componentDidMount() {
    this.analytics.visitScreen('ObservationScreen')
    this._isLoggedIn()

    this.events.push(BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    }))
    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this)))
    this.events.push(DeviceEventEmitter.addListener('editSubmission', this._reloadEntry.bind(this)))

    let entry  = this.params.plant
    let parsed = JSON.parse(entry.images)
    let images = []
    Object.keys(parsed).map(key => {
      parsed[key].map(image => {
        images.push(this.fs.image(image))
      })
    })

    this.setState({
      entry,
      images,
      synced      : entry.synced,
      needs_update: entry.needs_update
    })
  }

  _generatePages(observation) {
    let pages  = 0
    let images = JSON.parse(observation.images)
    Object.keys(images).map((key) => {
      if (Array.isArray(images[key])) {
        pages += images[key].length
      }
    })

    return pages
  }

  /**
   * Call onUnmount property.
   */
  componentWillUnmount() {
    this.events.map(event => event.remove())
    this.params.onUnmount()
  }

  /**
   * Listed to editing event and reload the entry from Realm.
   *
   * @private
   */
  _reloadEntry() {
    let observation = realm.objects('Submission').filtered(`id == ${this.state.entry.id}`)[0]
    this.setState({
      entry       : observation,
      needs_update: true,
      pages       : this._generatePages(observation)
    })
  }

  /**
   * Check if user is logged in.
   *
   * @private
   */
  _isLoggedIn() {
    let isLoggedIn = realm.objects('User').length > 0
    this.setState({isLoggedIn})
  }

  /**
   * Upload entry to server.
   *
   * @param entry
   */
  async upload(entry) {
    let total = Observation.countImages(entry.images)
    let step  = 0
    this.refs.spinner.setTitle('Uploading Images')
      .setProgressTotal(total)
      .setProgress(step)
      .open()
    try {
      await Observation.upload(entry, () => {
        step++
        this.refs.spinner.setProgress(step)
      })
      this.refs.spinner.close()
      this.setState({
        synced      : true,
        needs_update: false,
        noticeText  : 'Entry synced successfully!'
      })
      this.refs.snackbar.showBar()
      DeviceEventEmitter.emit('observationUploaded')
    } catch (error) {
      const errors = new Errors(error)

      let message
      if (errors.has('general')) {
        message = errors.first('general')
      } else {
        let field = Object.keys(errors.all())[0]
        message   = errors.first(field)
      }

      this.refs.spinner.close()
      this.setState({noticeText: message})
      this.refs.snackbar.showBar()
    }
  }

  /**
   * Update existing entry with server.
   *
   * @param entry
   */
  async update(entry) {
    if (this.state.synced) {
      let total = Observation.countImages(entry.images)
      let step  = 0
      this.refs.spinner.setTitle('Uploading Images')
        .setProgressTotal(total)
        .setProgress(step)
        .open()
      try {
        await Observation.update(entry, () => {
          step++
          this.refs.spinner.setProgress(step)
        })
        let submission = realm.objects('Submission').filtered(`id == ${entry.id}`)
        if (submission.length > 0) {
          this.refs.spinner.close()
          this.setState({
            synced      : true,
            needs_update: false,
            noticeText  : 'Entry synced successfully!'
          })
          this.refs.snackbar.showBar()
        }
      } catch (error) {
        const errors = new Errors(error)

        let message
        if (errors.has('general')) {
          message = errors.first('general')
        } else {
          let field = Object.keys(errors.all())[0]
          message   = errors.first(field)
        }

        this.refs.spinner.close()
        this.setState({noticeText: message})
        this.refs.snackbar.showBar()
      }
    }
  }

  /**
   * Render meta data as list items.
   *
   * @param {object} entry
   * @returns {*}
   * @private
   */
  _renderMetaData = (entry) => {
    let data = entry.meta_data
    if (typeof data === 'string' && data !== '') {
      data = JSON.parse(data)
    }

    if (data === '') {
      return null
    }

    return Object.keys(data).sort().map((key, index) => {
      let label_key = key.replace('_confidence', '')
      let text      = data[key]
      let label     = DCP[label_key] ? DCP[label_key].label : key

      if (key.indexOf('_units') > -1 || key.indexOf('_confidence', '') > -1) {
        return null
      }

      if (typeof text === 'object') {
        if (typeof text.value === 'undefined') {
          return null
        }

        text = text.value
      }

      // If it is an array, convert it to text
      if (/^\[.*\]$/g.test(text)) {
        let array = JSON.parse(text)
        text      = array.toString().replace(',', ', ')
      }

      if (typeof text !== 'string' || text === '' || text === null) {
        return null
      }

      if (key === 'comment') {
        return (
          <View key={key + '_' + index}>
            <View style={[styles.field, {borderBottomWidth: 0}]}>
              <Text style={styles.label}>Comment</Text>
              <Text style={styles.dataText}>{text}</Text>
            </View>
            <View style={[styles.field, {flexDirection: 'row'}]}>
              <Text style={{paddingLeft: 10}}>
                {entry.has_private_comments ?
                  <Icon name={'md-lock'} size={14} color={'#666'}/>
                  :
                  <Icon name={'md-globe'} size={14} color={'#666'}/>
                }
              </Text>
              <Text style={[styles.dataText, {flex: 1, fontSize: 12, paddingLeft: 5}]}>
                {entry.has_private_comments ?
                  'Only visible to you'
                  : 'Visible publicly'}
              </Text>
            </View>
          </View>
        )
      }

      if (typeof data[`${key}_units`] !== 'undefined') {
        text += ' ' + data[`${key}_units`]
      }

      if (typeof data[`${key}_confidence`] !== 'undefined') {
        text += ' ' + data[`${key}_confidence`]
      }

      return (
        <View style={styles.field} key={key + '_' + index}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.dataText}>{text}</Text>
        </View>
      )
    })
  }

  /**
   * Render the sync button or login button if user is not logged in.
   *
   * @param entry
   * @returns {{XML}}
   * @private
   */
  _renderUploadButton(entry) {
    if ((!this.state.synced && !this.state.isLoggedIn) || (this.state.needs_update && !this.state.isLoggedIn)) {
      return (
        <View style={styles.field}>
          <TouchableOpacity style={styles.button}
                            onPress={() => this.navigator.navigate('Login')}>
            <Text style={styles.buttonText}>Login to Sync</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!this.state.synced || this.state.needs_update) {
      return (
        <View style={styles.field}>
          <TouchableOpacity style={styles.button}
                            onPress={this.state.needs_update && this.state.synced ? () => this.update.call(this, entry) : () => this.upload.call(this, entry)}>
            <Text style={styles.buttonText}>Sync With Server</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  /**
   * Delete this entry.
   *
   * @param entry
   */
  deleteEntry(entry) {
    if (this.state.synced && !this.state.isLoggedIn) {
      alert('Warning: This observation has already been synced to the server.  Please log in to delete.')
      return
    }

    this.refs.spinner.open()

    if (this.state.synced) {
      axios.delete(`observation/${entry.serverID}?api_token=${this.user.api_token}`)
        .then(response => {
          // Delete locally
          this.refs.spinner.close()
          this.deleteLocally()
        })
        .catch(error => {
          this.refs.spinner.close()
          if (error.response && error.response.status === 404) {
            // Observation does not exist on the server so delete locally
            this.deleteLocally()
            return
          }
          console.log(error)
          alert('Unable to delete at this time.  Please check your internet connection and try again.')
        })
    } else {
      this.deleteLocally()
      this.refs.spinner.close()
    }
  }

  /**
   * Delete entry from realm.
   */
  deleteLocally() {
    let entry = this.params.plant

    // Delete locally
    let deleteTarget = realm.objects('Submission').filtered(`id == ${entry.id}`)
    if (deleteTarget.length > 0) {
      let observation = deleteTarget[0]

      // === Delete images ===
      // Deep clone the images object so that we don't create a state conflict
      // after deleting the realm entry
      let images = JSON.parse(JSON.stringify(observation.images))
      this.fs.delete(images)

      realm.write(() => {
        realm.delete(observation)
      })
    }

    DeviceEventEmitter.emit('ObservationDeleted')

    this.navigator.goBack()
  }

  /**
   * Edit this entry in the form Scene, passing along relevant info
   * @param entry
   */
  editEntry(entry) {
    this.navigator.navigate('Tree', {
      title    : entry.name,
      entryInfo: entry,
      edit     : true
    })
  }

  /**
   * Method for Delete button. Change scene, alert user about losing data.
   */
  deleteAlert(entry) {
    if (this.state.synced && !this.state.isLoggedIn) {
      Alert.alert('Log In to Delete',
        'This observation is already uploaded.  Please log in to delete.', [
          {
            text   : 'OK',
            onPress: () => {
              this.navigator.navigate('Login')
            }
          },
          {
            text   : 'Back',
            onPress: () => {
              // On cancel do nothing.
            },
            style  : 'cancel'
          }
        ])
      return
    }

    Alert.alert('Delete Observation',
      'Data will be permanently lost if you delete. Are you sure?', [
        {
          text   : 'Yes',
          onPress: () => {
            this.deleteEntry(entry)
          }
        },
        {
          text   : 'Cancel',
          onPress: () => {
          },
          style  : 'cancel'
        }
      ])
  }

  /**
   * Get the share button
   * @private
   */
  _renderShareButton() {
    const observation = this.state.entry
    if (!observation.synced || observation.needs_update) {
      return null
    }

    if (this.state.images.length < 1) {
      return null
    }

    const imageHeight = 200
    const width       = 60
    const height      = 60

    return (
      <TouchableOpacity
        activeOpacity={.8}
        onPress={() => this.setState({showShareModal: true})}
        style={{
          position       : 'absolute',
          alignItems     : 'center',
          justifyContent : 'center',
          top            : imageHeight - (width / 2),
          right          : 10,
          width,
          height,
          borderRadius   : width / 2,
          backgroundColor: Colors.warning,
          ...(new Elevation(5)),
          zIndex         : 99000
        }}>
        <Icon name={android ? 'md-share' : 'ios-share'} size={22} color={Colors.warningText}/>
        <Text style={{fontSize: 9, color: Colors.warningText, textAlign: 'center'}}>Share</Text>
      </TouchableOpacity>

    )
  }

  _renderShareModal() {
    return (
      <ShareLinkModal onRequestClose={() => this.setState({showShareModal: false})}
                      onChange={values => {
                        this.setState({
                          shareURL: values.shareURL
                        }, () => {
                          this.share()
                        })
                      }}
                      visible={this.state.showShareModal}
                      entry={this.state.entry}
      />
    )
  }

  /**
   * Check whether a string begins with a vowel.
   *
   * @param str
   * @return {boolean}
   * @private
   */
  _beginsWithVowel(str) {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(str.trim().charAt(0).toLowerCase()) > -1
  }

  /**
   * Perform the share request.
   */
  share() {
    const observation = this.state.entry
    const meta        = JSON.parse(observation.meta_data)
    const title       = observation.name === 'Other' ? meta.otherLabel : observation.name
    const url         = this.state.shareURL // `https://treesnap.org/observation/${observation.serverID}`
    const prefix      = this._beginsWithVowel(title) ? 'an' : 'a'
    if (!url) {
      return
    }

    let message = `I shared ${prefix} ${title} observation with science partners using @TreeSnapApp!`
    if (android) {
      message += ` ${url}`
    }

    Share.share({title, message}, {url}).then(share => {
      if (share.action && share.action === Share.sharedAction) {
        const analytics = new Analytics()
        analytics.shared(observation)
      }
    }).catch(error => {
      console.log('share error', error)
    })
  }

  renderField(label, data) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.dataText}>{data}</Text>
      </View>
    )
  }

  /**
   * Render Scene.
   *
   * @returns {{XML}}
   */
  render() {
    const entry = this.state.entry

    if (entry === null) {
      return null
    }

    const meta  = JSON.parse(entry.meta_data)
    const trash = (<Icon name={android ? 'md-trash' : 'ios-trash'} size={24} color="#fff"/>)
    const width = Dimensions.get('window').width

    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <SnackBarNotice ref="snackbar" noticeText={this.state.noticeText}/>

        <Header navigator={this.navigator}
                title={typeof meta.otherLabel !== 'undefined' ? `${entry.name} (${meta.otherLabel.trim()})` : entry.name}
                rightIcon={trash}
                onRightPress={() => {
                  this.deleteAlert.call(this, entry)
                }}/>

        <ScrollView style={styles.contentContainer} bounces={false}>
          <View style={{position: 'relative'}}>
            {this.state.images.length > 0 ?
              <ImageModal images={this.state.images} style={{flexDirection: 'row'}}>
                {this.state.images.map((image, i) => {
                  return <View key={i}
                               style={{
                                 flex  : 1,
                                 height: 200,
                                 ...(i > 0 ? {
                                   borderLeftWidth: 1,
                                   borderLeftColor: '#eee'
                                 } : null)
                               }}>
                    <Image style={{width: width / this.state.images.length, height: 200, resizeMode: 'cover'}}
                           source={{uri: image}}/>
                  </View>
                })}
              </ImageModal>
              : null}

            {this._renderShareButton()}
            <View style={styles.card}>
              {this._renderUploadButton(entry)}
              {entry.custom_id ? this.renderField('Custom Tree Identifier', entry.custom_id) : null}
              {this.renderField('Unique ID', entry.id)}
              {this.renderField('Date collected', entry.date)}
              {this._renderMetaData(entry)}
            </View>
          </View>
        </ScrollView>
        <View style={styles.multiButtonField}>
          <TouchableOpacity style={styles.button} onPress={() => this.editEntry(entry)}>
            <Text style={styles.buttonText}>Edit Entry</Text>
          </TouchableOpacity>
        </View>
        {this._renderShareModal()}
      </View>
    )
  }
}


// ObservationScreen.propTypes = {
//   navigator: PropTypes.object.isRequired,
//   plant    : PropTypes.object.isRequired,
//   onUnmount: PropTypes.func
// }

// ObservationScreen.defaultProps = {
//   onUnmount: () => {
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7',
    ...ifIphoneX({
      paddingBottom: 20
    })
  },

  contentContainer: {
    flex: 1
  },

  card: {
    flex           : 0,
    backgroundColor: '#fff'
  },

  field: {
    flex             : 0,
    flexDirection    : 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  multiButtonField: {
    flex         : 0,
    flexDirection: 'row'
  },

  label: {
    fontWeight       : 'bold',
    paddingVertical  : 10,
    paddingHorizontal: 10,
    color            : '#444'
  },

  dataText: {
    color            : '#555',
    paddingHorizontal: 10,
    paddingBottom    : 10
  },

  image: {
    flex      : 1,
    width     : Dimensions.get('window').width,
    height    : 250,
    resizeMode: 'cover'
  },

  button: {
    flex             : 1,
    paddingVertical  : 15,
    paddingHorizontal: 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2,
    marginHorizontal : 5,
    marginVertical   : 5
  },

  deleteButton: {
    backgroundColor: Colors.danger
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: 'bold',
    textAlign : 'center'
  },

  circlesContainer: {
    height        : 8,
    position      : 'absolute',
    bottom        : 5,
    flexDirection : 'row',
    justifyContent: 'center',
    alignItems    : 'center',
    width         : Dimensions.get('window').width
  },

  selectedCircle: {
    backgroundColor: '#444'
  },

  circle: {
    margin         : 3,
    width          : 8,
    height         : 8,
    borderRadius   : 8 / 2,
    backgroundColor: '#eee',
    opacity        : 0.9,
    ...(new Elevation(1)),
    shadowColor    : 'rgba(255, 255, 255, .8)'
  }
})
