import React from 'react'
import Screen from './Screen'
import {
  View,
  StyleSheet,
  Text,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  BackHandler,
  SectionList,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import moment from 'moment'
import Elevation from '../helpers/Elevation'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import File from '../helpers/File'
import SnackBar from '../components/SnackBarNotice'
import {ifIphoneX} from 'react-native-iphone-x-helper'
import Guide from '../components/Guide'
import Errors from '../helpers/Errors'

export default class ObservationsScreen extends Screen {
  static navigationOptions = {
    tabBarOnPress: ({scene, jumpToIndex}) => {
      DeviceEventEmitter.emit('observationsScreenRequested')
      jumpToIndex(scene.index)
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      hasData    : realm.objects('Submission').length > 0,
      submissions: [],
      isLoggedIn : false,
      noticeText : '',
      search     : '',
      searchFocused: false
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
    this._resetDataSource()


    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this)))
    this.events.push(DeviceEventEmitter.addListener('observationsScreenRequested', () => {
      this._resetDataSource()
    }))

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  /**
   * Remove events.
   */
  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  /**
   * Create data source map.
   *
   * @returns {{}}
   * @private
   */
  _createMap(search = '') {
    let synced   = []
    let unsynced = []
    let toUpdate = []
    let list     = []

    let submissions
    if (search.length === 0) {
      submissions = realm.objects('Submission').sorted('id', true)
    } else {
      submissions = realm
        .objects('Submission')
        .filtered(`name CONTAINS "${search}" OR meta_data CONTAINS "${search}"`)
        .sorted('id', true)
    }

    submissions.map(submission => {
      if (submission.needs_update) {
        toUpdate.push(submission)
      }
      else if (submission.synced) {
        synced.push(submission)
      } else {
        unsynced.push(submission)
      }
    })

    if (toUpdate.length > 0) {
      list.push({
        title: 'Needs Updating',
        data : toUpdate
      })
    }

    if (unsynced.length > 0) {
      list.push({
        title: 'Needs Uploading',
        data : unsynced
      })
    }

    if (synced.length > 0) {
      list.push({
        title: 'Uploaded',
        data : synced
      })
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
   * @returns {{XML}}
   * @private
   */
  _renderRow = ({item}) => {
    let images    = JSON.parse(item.images)
    let meta_data = JSON.parse(item.meta_data)
    let key       = Object.keys(images)[0]
    let thumbnail = null
    let category  = item.name === 'Other' ? `${item.name} (${meta_data.otherLabel})` : item.name

    if (key) {
      thumbnail = this.fs.thumbnail(images[key][0])
    }

    return (
      <TouchableOpacity style={styles.row} key={item.id}
                        onPress={() => this._goToEntryScene(item)}>
        {thumbnail ?
          <Image source={{uri: thumbnail}} style={styles.image}/>
          : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.body}>{moment(item.date, 'MM-DD-YYYY HH:mm:ss')
            .format('MMMM Do YYYY')}</Text>
          <Text
            style={styles.body}>Near {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}</Text>
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
   * @returns {{XML}}
   * @private
   */
  _renderSectionHeader = ({section}) => {
    if (section.title === 'Needs Uploading') {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{section.title}</Text>
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

    if (section.title === 'Needs Updating') {
      return (
        <View style={styles.headerContainer}>
          <View
            style={styles.headerRow}>
            <Text style={styles.headerText}>{section.title}</Text>
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
          {section.title} ({count})
        </Text>
      </View>
    )
  }

  /**
   * Render the whole list.
   *
   * @returns {{XML}}
   * @private
   */
  _renderList = () => {
    return (
      <View style={{flex: 1}}>
        <SectionList
          renderItem={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          sections={this.state.submissions}
          ListEmptyComponent={this._renderEmpty}
          keyExtractor={item => {
            return item.id
          }}
        />
      </View>
    )
  }

  _renderSearchBox = () => {
    if (!this.state.hasData) {
      return null
    }

    return (
      <View style={{
        backgroundColor  : '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height           : 50,
        padding          : 7
      }}>
        <TextInput
          style={{
            flex             : 1,
            backgroundColor  : this.state.searchFocused ? '#fff' : '#eee',
            paddingHorizontal: 10,
            borderRadius     : 15,
            borderWidth: 1,
            borderColor: '#ececec',
            color: '#444'
          }}
          value={this.state.search}
          onChangeText={search => {
            this._resetDataSource(search)
            this.setState({search})
          }}
          onFocus={() => {
            this.setState({searchFocused: true})
          }}
          onBlur={() => {
            this.setState({searchFocused: false})
          }}
          placeholder={'Search'}
          placeholderColor={'#888'}
          underlineColorAndroid={'transparent'}
        />
      </View>
    )
  }

  /**
   * In case the list is empty.
   *
   * @returns {{XML}}
   * @private
   */
  _renderEmpty = () => {
    if (this.state.hasData && this.state.search.length > 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyListText}>
            No results found for "{this.state.search}"
          </Text>
        </View>
      )
    }

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

  /**
   * Upload new observations.
   *
   * @return {Promise<void>}
   * @private
   */
  async _uploadUnsynced() {
    let observations = realm.objects('Submission').filtered('synced == false')
    let unsynced     = observations.length
    if (unsynced > 0) {
      this.refs.spinner.open()

      for (let i in observations) {
        let observation = observations[i]

        try {
          await Observation.upload(observation)
          DeviceEventEmitter.emit('observationUploaded')
          this._resetDataSource()
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
          this.snackbar.showBar()

          break
        }
      }
    }
  }

  /**
   * Upload edited observations.
   *
   * @return {Promise<void>}
   * @private
   */
  async _uploadUpdated() {
    let toSync  = realm.objects('Submission').filtered('needs_update == true')
    let updated = toSync.length
    if (updated > 0) {
      this.refs.spinner.open()

      for (let i in toSync) {
        let observation = toSync[i]
        try {
          await Observation.update(observation)
          realm.write(() => {
            observation.needs_update = false
            this._resetDataSource()
            this.refs.spinner.close()
            DeviceEventEmitter.emit('observationUploaded')
          })
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
          this.snackbar.showBar()

          return
        }
      }
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
  _resetDataSource(search) {
    this.setState({
      submissions: this._createMap(search)
    })
  }

  /**
   * Get the guide.
   *
   * @return {*[]}
   */
  renderGuideMessage() {
    return (
      [<View>
        <Text style={Guide.style.headerText}>
          Browse Your Observations
        </Text>
        <Text style={Guide.style.bodyText}>
          Your observations list will be shown here.
        </Text>
        <Text style={[Guide.style.bodyText, {marginBottom: 0}]}>
          Tap an observation to view more information, edit, or delete it.
        </Text>
      </View>,
        <View>
          <Text style={Guide.style.headerText}>
            Submit Your Observations to TreeSnap
          </Text>
          <Text style={Guide.style.bodyText}>
            Observations listed under "Needs Uploading" are stored on your phone, but have not been submitted to TreeSnap.
          </Text>
          <Text style={Guide.style.bodyText}>
            You can tap the "Sync All" button to submit all observations, or submit individual observations by tapping on that observation.
          </Text>
        </View>]
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigator={this.navigator}
                title="My Observations"
                rightIcon="help"
                onRightPress={() => this.guide.show()}
                initial={true}
                onMenuPress={() => this.navigator.navigate('DrawerToggle')}/>
        <Guide
          ref={ref => this.guide = ref}
          screen="ObservationsScreen"
          message={this.renderGuideMessage()}
          version={1}
          icon="ios-leaf-outline"
          marginBottom={10}
        />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.os === 'android' ? 'height' : 'padding'}>
          {this._renderSearchBox()}
          {this._renderList()}
        </KeyboardAvoidingView>
        <SnackBar ref={ref => this.snackbar = ref} noticeText={this.state.noticeText}/>
        <Spinner ref="spinner"/>
      </View>
    )
  }
}

// ObservationsScreen.propTypes = {
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
