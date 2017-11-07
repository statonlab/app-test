import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Text,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import {ListView} from 'realm/react-native'
import moment from 'moment'
import Elevation from '../helpers/Elevation'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import File from '../helpers/File'
import SnackBar from '../components/SnackBarNotice'
import {ifIphoneX} from 'react-native-iphone-x-helper'

export default class ObservationsScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    this.dataSource = new ListView.DataSource({
      rowHasChanged          : (r1, r2) => r1.id !== r2.id,
      sectionHeaderHasChanged: () => {
      }
    })

    this.submissions = realm.objects('Submission')

    this.state = {
      hasData    : (this.submissions.length > 0),
      submissions: this.dataSource.cloneWithRowsAndSections(this._createMap(this.submissions)),
      isLoggedIn : false,
      noticeText : ''
    }

    this.events   = []
    this.snackbar = {}

    this.fs = new File()
  }

  /**
   * Listen to logged in event
   */
  componentDidMount() {
    this._isLoggedIn()

    this.loggedEvent = DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this))
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  /**
   * Remove events.
   */
  componentWillUnmount() {
    this.loggedEvent.remove()
  }

  /**
   * Create data source map.
   *
   * @returns {{}}
   * @private
   */
  _createMap() {
    let synced   = []
    let unsynced = []
    let toUpdate = []
    let list     = {}

    this.submissions.map(submission => {
      if (submission.needs_update) {
        toUpdate.push(submission)
      }
      else if (submission.synced) {
        synced.push(submission)
      } else {
        unsynced.push(submission)
      }
    })

    if (unsynced.length > 0) {
      list = {
        'Needs Uploading': unsynced
      }
    }

    if (synced.length > 0) {
      list = {
        ...list,
        'Uploaded': synced
      }
    }

    if (toUpdate.length > 0) {
      list = {
        'Needs Updating': toUpdate,
        ...list
      }
    }

    return JSON.parse(JSON.stringify(list))
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
   * Render single row.
   *
   * @param submission
   * @returns {XML}
   * @private
   */

  _renderRow = (submission) => {
    let images    = JSON.parse(submission.images)
    let key       = Object.keys(images)[0]
    let thumbnail = null

    if (key) {
      thumbnail = this.fs.thumbnail(images[key][0])
    }

    return (
      <TouchableOpacity style={styles.row} key={submission.id}
                        onPress={() => this._goToEntryScene(submission)}>
        {thumbnail ?
          <Image source={{uri: thumbnail}} style={styles.image}/>
          : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{submission.name}</Text>
          <Text style={styles.body}>{moment(submission.date, 'MM-DD-YYYY HH:mm:ss')
            .format('MMMM Do YYYY')}</Text>
          <Text
            style={styles.body}>Near {submission.location.latitude.toFixed(4)}, {submission.location.longitude.toFixed(4)}</Text>
        </View>
        <Text style={[styles.textContainer, styles.rightElement]}>
          <Icon name="md-more" size={30} color="#aaa"/>
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * Render section header.
   *
   * @param data
   * @param id
   * @returns {XML}
   * @private
   */
  _renderSectionHeader = (data, id) => {
    if (id === 'Needs Uploading') {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{id}</Text>
            {this.state.isLoggedIn ?
              <TouchableOpacity style={styles.warningButton}
                                onPress={this._uploadAll.bind(this)}>
                <Text style={[styles.headerText, {color: Colors.warningText}]}>
                  Sync All
                </Text>
              </TouchableOpacity> :
              <TouchableOpacity style={styles.warningButton}
                                onPress={() => this.navigator.navigate('Login')}>
                <Text style={[styles.headerText, {color: Colors.warningText}]}>
                  Login to Sync
                </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
    }

    if (id === 'Needs Updating') {
      return (
        <View style={styles.headerContainer}>
          <View
            style={styles.headerRow}>
            <Text style={styles.headerText}>{id}</Text>
            {this.state.isLoggedIn ?
              <TouchableOpacity style={styles.warningButton}
                                onPress={this._uploadAll.bind(this)}>
                <Text style={[styles.headerText, {color: Colors.warningText}]}>
                  Sync All
                </Text>
              </TouchableOpacity> :
              <TouchableOpacity style={styles.warningButton}
                                onPress={() => this.navigator.navigate('Login')}>
                <Text style={[styles.headerText, {color: Colors.warningText}]}>
                  Login to Sync
                </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
    }

    let count = realm
      .objects('Submission')
      .filtered('synced == true && needs_update == false')
      .length
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {id} ({count})
        </Text>
      </View>
    )
  }

  /**
   * Render the whole list.
   *
   * @returns {XML}
   * @private
   */
  _renderList = () => {
    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.submissions}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          enableEmptySections={true}
        />
      </View>
    )
  }

  /**
   * In case the list is empty.
   *
   * @returns {XML}
   * @private
   */
  _renderEmpty = () => {
    return (
      <View style={styles.centerContainer}>
        <Icon name="ios-albums-outline" size={120} style={styles.emptyListIcon}/>
        <Text style={styles.emptyListText}>
          You have not submitted any entries yet. You can
          start by going back and selecting a plant.
        </Text>
      </View>
    )
  }

  /**
   * Navigate to single observation scene.
   *
   * @param plant
   * @private
   */
  _goToEntryScene = (plant) => {
    this.navigator.navigate('Observation', {
      onUnmount: this._resetDataSource.bind(this),
      plant
    })
  }

  _uploadUnsynced() {
    let observations   = realm.objects('Submission').filtered('synced == false')
    let unsynced       = observations.length
    let unsynced_count = 0
    if (unsynced > 0) {
      this.refs.spinner.open()

      observations.forEach(observation => {
        Observation.upload(observation).then(response => {
          realm.write(() => {
            observation.synced         = true
            observation.observation_id = response.data.data.observation_id
            this._resetDataSource()
          })
          unsynced_count++
          DeviceEventEmitter.emit('ObservationUploaded')
        }).catch(error => {
          console.log(error)
          unsynced_count++
          if (unsynced === unsynced_count) {
            this.refs.spinner.close()
            this.setState({noticeText: 'Network error. Please try again later.'})
            this.snackbar.showBar()
          }
        })
      })
    }
  }

  _uploadUpdated() {
    let toSync        = realm.objects('Submission').filtered('needs_update == true')
    let updated       = toSync.length
    let updated_count = 0
    if (updated > 0) {
      this.refs.spinner.open()

      toSync.forEach(observation => {
        Observation.update(observation).then(response => {
          realm.write(() => {
            observation.needs_update = false
            this._resetDataSource()
            this.refs.spinner.close()
            DeviceEventEmitter.emit('ObservationUploaded')
          })
          updated_count++
        }).catch(error => {
          updated_count++
          console.log(error)
          if (updated === updated_count) {
            this.refs.spinner.close()
            this.setState({noticeText: 'Network error. Please try again later.'})
            this.snackbar.showBar()
          }
        })
      })
    }
  }

  /**
   * Upload all entries.
   *
   * @private
   */
  _uploadAll() {
    this._uploadUnsynced()
    this._uploadUpdated()
  }

  /**
   * Reset data source with latest data.
   * @private
   */
  _resetDataSource() {
    this.setState({
      submissions: this.dataSource.cloneWithRowsAndSections(this._createMap())
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <Header navigator={this.navigator}
                title="My Observations"
                initial={true}
                onMenuPress={() => this.navigator.navigate('DrawerToggle')}/>
        {this.state.hasData ? this._renderList() : this._renderEmpty()}
        <SnackBar ref={(snackbar) => this.snackbar = snackbar} noticeText={this.state.noticeText}/>
      </View>
    )
  }
}

// ObservationsScreen.PropTypes = {
//   navigator: PropTypes.object.isRequired
// }

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7',
    ...ifIphoneX({
      paddingBottom: 20
    })
  },

  row: {
    flexDirection    : 'row',
    alignItems       : 'center',
    backgroundColor  : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding          : 10
  },

  image: {
    flex      : 0,
    width     : 50,
    height    : 50,
    resizeMode: 'cover'
  },

  textContainer: {
    flex             : 1,
    paddingHorizontal: 10,
    justifyContent   : 'space-between'
  },

  title: {
    color     : '#222',
    fontWeight: '500'
  },

  body: {
    color: '#666'
  },

  actionButton: {
    backgroundColor  : Colors.danger,
    borderRadius     : 2,
    paddingHorizontal: 5,
    paddingVertical  : 10
  },

  rightElement: {
    flex          : 0,
    width         : 50,
    alignItems    : 'center',
    justifyContent: 'center'
  },

  centerContainer: {
    ...(new Elevation(1)),
    flex           : 0,
    justifyContent : 'flex-start',
    alignItems     : 'center',
    padding        : 10,
    backgroundColor: '#fff',
    margin         : 10
  },

  emptyListText: {
    fontSize  : 16,
    fontWeight: '500',
    color     : '#222'
  },

  emptyListIcon: {
    marginBottom: 20,
    color       : '#444'
  },

  headerContainer: {
    padding          : 10,
    backgroundColor  : '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    flex             : 0
  },

  headerRow: {
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'space-between',
    flex          : 1
  },

  headerText: {
    color     : '#111',
    fontWeight: '500'
  },

  warningButton: {
    ...(new Elevation(2)),
    backgroundColor  : Colors.warning,
    paddingVertical  : 10,
    paddingHorizontal: 15,
    borderRadius     : 2
  }
})