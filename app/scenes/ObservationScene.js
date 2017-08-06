import React, {Component, PropTypes} from 'react'
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
  BackAndroid
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import DCP from '../resources/config.js'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import SnackBarNotice from '../components/SnackBarNotice'
import axios from '../helpers/Axios'
import Icon from 'react-native-vector-icons/Ionicons'
import File from '../helpers/File'
import Elevation from '../helpers/Elevation'
import ImageZoom from 'react-native-image-pan-zoom'

const trash   = (<Icon name="ios-trash" size={24} color="#fff"/>)
const android = Platform.OS === 'android'

export default class ObservationScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex    : 0,
      synced        : false,
      isLoggedIn    : false,
      needs_update  : false,
      selectedCircle: 0,
      pages         : 0,
      noticeText    : '',
      entry         : null
    }

    this.user = realm.objects('User')[0]
    this.fs   = new File()
  }

  componentWillMount() {
    this.backEvent = BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.navigator.pop()
      return true
    })

    this.setState({entry: this.props.plant})
  }

  /**
   * Set the synced and updated status.
   */
  componentDidMount() {
    this._isLoggedIn()

    this.loggedEvent = DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this))
    this.editedEvent = DeviceEventEmitter.addListener('editSubmission', this._reloadEntry.bind(this))

    let pages  = 0
    let images = JSON.parse(this.props.plant.images)
    Object.keys(images).map((key) => {
      if (Array.isArray(images[key])) {
        images[key].map(() => {
          pages++
        })
      }
    })

    this.setState({
      synced      : this.props.plant.synced,
      needs_update: this.props.plant.needs_update,
      pages       : pages
    })
  }

  /**
   * Call onUnmount property.
   */
  componentWillUnmount() {
    this.loggedEvent.remove()
    this.editedEvent.remove()
    this.backEvent.remove()
    this.props.onUnmount()
  }

  /**
   * Listed to editing event and reload the entry from Realm.
   *
   * @private
   */
  _reloadEntry() {
    this.setState({
      entry       : realm.objects('Submission').filtered(`id == ${this.state.entry.id}`)[0],
      needs_update: true
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
  upload(entry) {
    this.refs.spinner.open()
    Observation.upload(entry).then(response => {
      let data   = response.data.data
      submission = realm.objects('Submission').filtered(`id == ${entry.id}`)
      if (submission.length > 0) {
        let observation = submission[0]
        realm.write(() => {
          observation.serverID = data.observation_id
          observation.synced   = true
        })
        this.refs.spinner.close()
        this.setState({
          synced    : true,
          noticeText: 'Entry synced successfully!'
        })
        this.refs.snackbar.showBar()
      }
    }).catch(error => {
      console.log(error)
      this.refs.spinner.close()
      this.setState({noticeText: 'Network error. Please try again later.'})
      this.refs.snackbar.showBar()
    })
  }

  /**
   * Update existing entry with server.
   *
   * @param entry
   */
  update(entry) {
    if (this.state.synced) {
      this.refs.spinner.open()
      Observation.update(entry).then(response => {
        submission = realm.objects('Submission').filtered(`id == ${entry.id}`)
        if (submission.length > 0) {
          let observation = submission[0]
          realm.write(() => {
            observation.needs_update = false
          })
          this.refs.spinner.close()
          this.setState({
            needs_update: false,
            noticeText  : 'Entry synced successfully!'
          })
          this.refs.snackbar.showBar()
        }
      }).catch(error => {
        console.log(error)
        this.refs.spinner.close()
        this.setState({noticeText: 'Network error. Please try again later.'})
        this.refs.snackbar.showBar()
      })
    }
  }


  /**
   * Render meta data as list items.
   *
   * @param data
   * @returns {*}
   * @private
   */
  _renderMetaData = (data) => {
    if (typeof data === 'string' && data !== '') {
      data = JSON.parse(data)
    }

    if (data === '') {
      return null
    }

    return Object.keys(data).sort().map((key) => {
      let text  = data[key]
      let label = DCP[key] ? DCP[key].label : key

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

      return (
        <View style={styles.field} key={key}>
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
   * @returns {XML}
   * @private
   */
  _renderUploadButton(entry) {
    if ((!this.state.synced && !this.state.isLoggedIn) || (this.state.needs_update && !this.state.isLoggedIn)) {
      return (
        <View style={styles.field}>
          <TouchableOpacity style={styles.button}
                            onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
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
          this.deleteLocally()
        })
        .catch(error => {
          this.refs.spinner.close()
          if (error.response && error.response.status === 404) {
            // Observation does not exist on the server so delete locally
            this.deleteLocally()
            return
          }

          alert('Unable to delete at this time.  Please check your internet connection and try again.')
        })
        .then(() => {
          this.refs.spinner.close()
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
    let entry = this.props.plant

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

    this.props.navigator.pop()
  }

  /**
   * Edit this entry in the form Scene, passing along relevant info
   * @param entry
   */
  editEntry(entry) {
    this.props.navigator.push({
      label    : 'TreeScene',
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
              this.props.navigator.push({label: 'LoginScene'})
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

  _renderCircles() {
    if (this.state.pages <= 1) {
      return
    }

    // Flatten images
    let all = []
    for (let i = 0; i < this.state.pages; i++) {
      all.push(i)
    }

    return (
      <View style={styles.circlesContainer}>
        {all.map((image, index) => {
          return <TouchableOpacity key={index}
                                   style={[styles.circle, this.state.selectedCircle === index ? styles.selectedCircle : {}]}/>
        })}
      </View>
    )
  }

  /**
   * Scroll handler.
   *
   * @param event
   * @private
   */
  _handleScroll(event) {
    let width = Dimensions.get('window').width
    let x     = event.nativeEvent.contentOffset.x
    let pages = []

    for (let i = 0; i < this.state.pages; i++) {
      pages.push(i)
    }

    let page = pages.indexOf(x / width)

    this.setState({
      selectedCircle: page > -1 ? page : this.state.selectedCircle
    })
  }

  /**
   * Render Scene.
   *
   * @returns {XML}
   */
  render() {
    let entry = this.state.entry

    if (entry === null) {
      return null
    }

    let images = JSON.parse(entry.images)
    let width  = Dimensions.get('window').width
    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <SnackBarNotice ref="snackbar" noticeText={this.state.noticeText}/>

        <Header navigator={this.props.navigator} title={entry.name} rightIcon={trash}
                onRightPress={() => {
                  this.deleteAlert.call(this, entry)
                }}/>

        <ScrollView style={styles.contentContainer} bounces={false}>
          <View style={{position: 'relative'}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={true}
              pagingEnabled={true}
              onScroll={this._handleScroll.bind(this)}
              scrollEventThrottle={16}
            >
              {Object.keys(images).map((key) => {
                if (!Array.isArray(images[key])) {
                  return
                }

                return images[key].map((image, index) => {
                  if (android) {
                    return (
                      <View style={{flex: 0, height: 250, width}} key={index}>
                        <Image source={{uri: this.fs.image(image)}} style={styles.image}/>
                      </View>
                    )
                  }

                  return (
                    <ImageZoom
                      cropHeight={250}
                      cropWidth={width}
                      imageHeight={250}
                      imageWidth={width}
                      key={index}
                    >
                      <Image source={{uri: this.fs.image(image)}} style={styles.image}/>
                    </ImageZoom>
                  )
                })
              })}
            </ScrollView>
            {this._renderCircles()}
          </View>
          <View style={styles.card}>
            {this._renderUploadButton(entry)}
            <View style={styles.field}>
              <Text style={styles.label}>Unique ID</Text>
              <Text style={styles.dataText}>{entry.id}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Date Collected</Text>
              <Text style={styles.dataText}>{entry.date}</Text>
            </View>
            {this._renderMetaData(entry.meta_data)}
          </View>
        </ScrollView>
        <View style={styles.multiButtonField}>
          <TouchableOpacity style={styles.button} onPress={() => this.editEntry(entry)}>
            <Text style={styles.buttonText}>Edit Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


ObservationScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  plant    : PropTypes.object.isRequired,
  onUnmount: PropTypes.func
}

ObservationScene.defaultProps = {
  onUnmount: () => {
  }
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7'
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
    color        : '#777',
    paddingLeft  : 20,
    paddingRight : 10,
    paddingBottom: 10
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