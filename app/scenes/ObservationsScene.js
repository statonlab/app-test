import React, {Component, PropTypes} from 'react'
import {
  View,
  ListView,
  StyleSheet,
  Text,
  Image,
  DeviceEventEmitter
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import moment from 'moment'
import {MKButton} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'

export default class ObservationsScene extends Component {
  constructor(props) {
    super(props)

    this.dataSource  = new ListView.DataSource({
      rowHasChanged          : (r1, r2) => r1.id !== r2.id,
      sectionHeaderHasChanged: () => {
      }
    })
    this.submissions = realm.objects('Submission')

    this.state = {
      hasData    : (this.submissions.length > 0),
      submissions: this.dataSource.cloneWithRowsAndSections(this._createMap(this.submissions)),
      isLoggedIn : false
    }

    this.events = []
  }

  /**
   * Listen to logged in event
   */
  componentDidMount() {
    this._isLoggedIn()

    this.loggedEvent = DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this))
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
   * @param submissions
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
        ...list,
        'Needs Updating': toUpdate
      }
    }

    return list
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
    let images = JSON.parse(submission.images)
    let key = Object.keys(images)[0]
    console.log(key)

    return (
      <MKButton style={styles.row} key={submission.id} rippleColor="rgba(10,10,10,.1)" onPress={() => this._goToEntryScene(submission)}>
        {images[key].length > 0 ?
         <Image source={{uri: images[key][0]}} style={styles.image}/>
          : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{submission.name}</Text>
          <Text style={styles.body}>{moment(submission.date, 'MM-DD-YYYY HH:mm:ss').format('MMMM Do YYYY')}</Text>
          <Text style={styles.body}>Near {submission.location.latitude.toFixed(4)}, {submission.location.longitude.toFixed(4)}</Text>
        </View>
        <MKButton style={[styles.textContainer, styles.rightElement]}>
          <Icon name="md-more" size={30} color="#aaa"/>
        </MKButton>
      </MKButton>
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
        <View style={[styles.headerContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
          <Text style={styles.headerText}>{id}</Text>
          {this.state.isLoggedIn ?
            <MKButton style={styles.warningButton}
              onPress={this._uploadAll.bind(this)}>
              <Text style={[styles.headerText, {color: Colors.warningText}]}>Sync All</Text>
            </MKButton> :
            <MKButton style={styles.warningButton}
              onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
              <Text style={[styles.headerText, {color: Colors.warningText}]}>Login to Sync</Text>
            </MKButton>
          }
        </View>
      )
    }

    if (id == 'Needs Updating') {
      return (
        <View style={[styles.headerContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
          <Text style={styles.headerText}>{id}</Text>
          {this.state.isLoggedIn ?
            <MKButton style={styles.warningButton}
              onPress={this._uploadAll.bind(this)}>
              <Text style={[styles.headerText, {color: Colors.warningText}]}>Sync All</Text>
            </MKButton> :
            <MKButton style={styles.warningButton}
              onPress={() => this.props.navigator.push({label: 'LoginScene'})}>
              <Text style={[styles.headerText, {color: Colors.warningText}]}>Login to Sync</Text>
            </MKButton>
          }
        </View>
      )

    }
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{id} ({realm.objects('Submission').filtered('synced == true && needs_update == false').length})</Text>
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
      <ListView
        dataSource={this.state.submissions}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        enableEmptySections={true}
      />
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
    this.props.navigator.push({
      label    : 'ObservationScene',
      onUnmount: this._resetDataSource.bind(this),
      plant
    })
  }

  /**
   * Upload all entries.
   *
   * @private
   */
  _uploadAll() {
    let observations = realm.objects('Submission').filtered('synced == false')

    if (observations.length > 0) {
      this.refs.spinner.open()

      observations.forEach(observation => {
        Observation.upload(observation).then(response => {
          // TODO: Add snackbar notification
          // console.log(response)
          realm.write(() => {
            observation.synced         = true
            observation.observation_id = response.data.data.observation_id
            this._resetDataSource()
            this.refs.spinner.close()
          })
        }).catch(error => {
          // TODO: Handle Error!
          console.log(error)
        })
      })
    }

    let toSync = realm.objects('Submission').filtered('needs_update == true')

    if (toSync.length > 0) {
      this.refs.spinner.open()

      toSync.forEach(observation => {
        Observation.update(observation).then(response => {
          console.log("OBS:", response)
          // TODO: Add snackbar notification
          realm.write(() => {
            observation.needs_update = false
            this._resetDataSource()
            this.refs.spinner.close()
          })
        }).catch(error => {
          // TODO: Handle Error!
          console.log(error)
        })
      })
    }
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
        <Header navigator={this.props.navigator} title="Your Entries"/>
        {this.state.hasData ? this._renderList() : this._renderEmpty()}
      </View>
    )
  }
}

ObservationsScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7'
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
    borderBottomColor: '#eee'
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