import React, {Component, PropTypes} from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  DeviceEventEmitter,
  Alert
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'
import DCP from '../resources/config.js'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import SnackBarNotice from '../components/SnackBarNotice'
import axios from '../helpers/Axios'
import Plants from '../resources/descriptions'


export default class ObservationScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex  : 0,
      synced      : false,
      isLoggedIn  : false,
      needs_update: false
    }
    this.user  = realm.objects('User')[0]

  }

  /**
   * Set the synced and updated status.
   */
  componentDidMount() {
    this._isLoggedIn()

    this.loggedEvent = DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this))
    this.setState({synced: this.props.plant.synced})
    this.setState({needs_update: this.props.plant.needs_update})
  }

  /**
   * Call onUnmount property.
   */
  componentWillUnmount() {
    this.loggedEvent.remove()
    this.props.onUnmount()
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
    console.log(this.entry)
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
        this.setState({synced: true})
        this.refs.snackbar.showBar()
      }
    }).catch(error => {
      console.log(error)
      this.refs.spinner.close()
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
        let data   = response.data.data
        submission = realm.objects('Submission').filtered(`id == ${entry.id}`)
        if (submission.length > 0) {
          let observation = submission[0]
          console.log("OBS:", observation)
          realm.write(() => {
            observation.needs_update = false
          })
          this.refs.spinner.close()
          this.setState({needs_update: false})
          this.refs.snackbar.showBar()
          return
        }
      }).catch(error => {
        console.log(error)
        this.refs.spinner.close()
        return
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

      // If it is an array, convert it to text
      if (/^\[.*\]$/g.test(text)) {
        let array = JSON.parse(text)
        text      = array.toString().replace(',', ', ')
      }

      if (text === '' || text === null) {
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

  _renderUploadButton(entry) {
    if ((!this.state.synced && !this.state.isLoggedIn) || (this.state.needs_update && !this.state.isLoggedIn)) {
      return (
        <View style={styles.field}>
          <MKButton style={styles.button} onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
            <Text style={styles.buttonText}>Login to Sync</Text>
          </MKButton>
        </View>
      )
    }

    if (!this.state.synced || this.state.needs_update) {
      return (
        <View style={styles.field}>
          <MKButton style={styles.button}
            onPress={this.state.needs_update && this.state.synced ? () => this.update.call(this, entry) : () => this.upload.call(this, entry)}>
            <Text style={styles.buttonText}>Sync With Server</Text>
          </MKButton>
        </View>
      )
    }
  }

  deleteEntry(entry) {
    if (this.state.synced && !this.state.isLoggedIn) {
      alert("Warning: This observation has already been synced to the server.  Please log in to delete.")
      return false
    }
    this.refs.spinner.open()

    if (this.state.synced && this.state.isLoggedIn) {
      axios.delete(`observation/${entry.serverID}?api_token=${this.user.api_token}`, {
        params: {api_token: this.user.api_token}
      }).then(response => {
      }).catch(error => {
        console.log("ERR:", error)
        this.refs.spinner.close()
        alert("Unable to delete at this time.  Please check your internet connection and try again.")
        return false
      })
    }

// Delete locally
    let deleteTarget = realm.objects('Submission').filtered(`id == ${entry.id}`)
    if (deleteTarget.length > 0) {
      let observation = deleteTarget[0]
      realm.write(() => {
        realm.delete(observation)
      })
    }
    // DeviceEventEmitter.emit('ObservationDeleted')

    this.refs.spinner.close()

    this.props.navigator.popToTop()
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
      edit     : true,
    })
  }

  /**
   * deleteAlert
   * -------------------------------------------------
   * Method for Delete button.  Change scene, alert user about losing data.
   * @returns {boolean}
   */
  deleteAlert = (entry) => {

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
      return false
    }

    Alert.alert('Delete Observation',
      'Data will be permanently lost if you cancel. Are you sure?', [
        {
          text   : 'Yes',
          onPress: () => {
            this.deleteEntry(entry)
          }
        },
        {
          text   : 'Back',
          onPress: () => {
          },
          style  : 'cancel'
        }
      ])

    return false
  }


  /**
   * Render Scene.
   *
   * @returns {XML}
   */
  render() {
    let entry  = this.props.plant
    let images = JSON.parse(entry.images)




    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <SnackBarNotice ref="snackbar" noticeText="Entry synced successfully!"/>

        <Header navigator={this.props.navigator} title={entry.name}/>
        <ScrollView style={styles.contentContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={true}
            pagingEnabled={true}
          >
            {Object.keys(images).map((key) => {
        return images[key].map((image, index) => {
                return (
                  <Image key={index} source={{uri: image}} style={styles.image}/>
                )
              })
            })
            }
          </ScrollView>
          <View style={styles.card}>
            {this._renderUploadButton(entry)}
            <View style={styles.field}>
              <Text style={styles.label}>Date Collected</Text>
              <Text style={styles.dataText}>{entry.date}</Text>
            </View>
            {this._renderMetaData(entry.meta_data)}
          </View>
          <View style={styles.multiButtonField}>
            <MKButton style={styles.button } onPress={() => this.editEntry(entry)}>
              <Text style={styles.buttonText}>Edit Entry</Text>
            </MKButton>
            <MKButton style={[styles.button, styles.deleteButton]} onPress={() => this.deleteAlert(entry)}>
              <Text style={[styles.buttonText,   {color : '#FFF'}]}>Delete Entry</Text>
            </MKButton>
          </View>
        </ScrollView>
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

  field           : {
    flex             : 0,
    flexDirection    : 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  multiButtonField: {
    flex         : 1,
    flexDirection: 'row',

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
    flex      : 0,
    width     : Dimensions.get('window').width,
    height    : 190,
    resizeMode: 'cover'
  },
  button: {
    flex             : 1,
    paddingVertical  : 15,
    paddingHorizontal: 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2,
    marginHorizontal : 10,
    marginVertical   : 5
  },

  deleteButton: {
    backgroundColor: Colors.danger
  },
  buttonText  : {
    color     : Colors.warningText,
    fontWeight: 'bold',
    textAlign : 'center'
  },
})