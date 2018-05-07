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
  KeyboardAvoidingView,
  Share,
  Modal
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
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper'
import Guide from '../components/Guide'
import Errors from '../helpers/Errors'
import Popover, {PopoverItem} from '../components/Popover'
import Analytics from '../helpers/Analytics'
import geolib from 'geolib'

const android = Platform.OS === 'android'

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
      hasData            : realm.objects('Submission').length > 0,
      submissions        : [],
      isLoggedIn         : false,
      noticeText         : '',
      search             : '',
      searchFocused      : false,
      popoverVisible     : false,
      buttonRect         : {},
      selectedObservation: {},
      refreshing         : true,
      location           : {
        latitude : false,
        longitude: false
      },
      sort               : {
        field  : 'id',
        reverse: true
      },
      showSortModal      : false
    }

    this.events              = []
    this.snackbar            = {}
    this.buttons             = {}
    this.showedLocationError = false

    this.fs = new File()
  }

  /**
   * Listen to logged in event
   */
  componentDidMount() {
    this.analytics.visitScreen('ObservationsScreen')

    this._isLoggedIn()
    this._resetDataSource(this.state.search)

    this.events.push(DeviceEventEmitter.addListener('userLoggedIn', this._isLoggedIn.bind(this)))
    this.events.push(DeviceEventEmitter.addListener('observationsScreenRequested', () => {
      this._resetDataSource(this.state.search)
    }))
    this.events.push(DeviceEventEmitter.addListener('observations.location.changed', () => {
      this._resetDataSource(this.state.search)
    }))

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
    this.getLocation()
  }

  /**
   * Remove events.
   */
  componentWillUnmount() {
    this.events.map(event => event.remove())
  }

  getLocation() {
    this.setState({refreshing: true})
    navigator.geolocation.getCurrentPosition(this.updateLocation.bind(this), this.handleLocationError.bind(this), {
      enableHighAccuracy: !this.showedLocationError,
      timeout           : 20000,
      maximumAge        : 1000
    })
  }

  /**
   *
   * @param position
   */
  updateLocation(position) {
    let location = position.coords

    this.setState({location})
    setTimeout(() => {
      DeviceEventEmitter.emit('observations.location.changed', location)
    }, 100)
  }

  /**
   * Handle getting location errors.
   *
   * @param error
   */
  handleLocationError(error) {
    this.setState({refreshing: false})
    if (this.showedLocationError) {
      return
    }

    if (error.message) {
      alert(error.message + '. Sort by distance is not available.')
    } else {
      alert('Could not obtain location. Sort by distance is not available.')
    }
    this.showedLocationError = true
  }

  /**
   * Compute distance from location 1 to location 2
   *
   * @param latitude
   * @param longitude
   * @return {number} meters
   */
  distance(latitude, longitude) {
    return geolib.getDistance({
      longitude: this.state.location.longitude,
      latitude : this.state.location.latitude
    }, {longitude, latitude})
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
      submissions = realm.objects('Submission')
    } else {
      submissions = realm
        .objects('Submission')
        .filtered(`name CONTAINS "${search}" OR meta_data CONTAINS "${search}"`)
    }

    if (this.state.sort.field === 'distance') {
      submissions = this._attachDistance(submissions)
      submissions = submissions.sort((a, b) => {
        if (this.state.sort.reverse) {
          return b.distance - a.distance
        } else {
          return a.distance - b.distance
        }
      })
    } else {
      submissions = submissions.sorted('id', this.state.sort.reverse)
      submissions = this._attachDistance(submissions)
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

  _attachDistance(observations) {
    return observations.map(observation => {
      if (this.state.location.latitude !== false) {
        observation.distance = this.distance(observation.location.latitude, observation.location.longitude)
      } else {
        observation.distance = false
      }
      return observation
    })
  }

  /**
   * Format distance
   *
   * @param distance
   * @return {string}
   * @private
   */
  _formatDistance(distance) {
    return Math.round(distance * 100) / 100 + ' Meters away'
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
      <View style={{
        flexDirection    : 'row',
        backgroundColor  : '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
      }}>
        <TouchableOpacity style={[styles.row, {flex: 1}]} key={item.id}
                          onPress={() => this._goToEntryScene(item)}>
          {thumbnail ?
            <Image source={{uri: thumbnail}} style={styles.image}/>
            : null}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{category}</Text>
            <Text style={styles.body}>
              {moment(item.date, 'MM-DD-YYYY HH:mm:ss').format('MMMM Do YYYY')}
            </Text>
            {item.distance !== false ?
              <Text
                style={styles.body}>
                {this._formatDistance(item.distance)}
              </Text>
              :
              <Text
                style={styles.body}>
                Near {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
              </Text>
            }
          </View>
        </TouchableOpacity>
        <View style={{position: 'relative'}}>
          <TouchableOpacity ref={ref => this.buttons[item.id] = ref} onPress={() => this.showPopover(item)}
                            style={[styles.textContainer, styles.rightElement, {
                              flex           : 1,
                              backgroundColor: this.state.selectedObservation.id === item.id ? '#eee' : 'transparent'
                            }]}>
            <Icon name="md-more" size={30} color="#aaa"/>
          </TouchableOpacity>
        </View>
      </View>
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
          onRefresh={() => {
            this.setState({refreshing: true})
            this.getLocation()
          }}
          refreshing={this.state.refreshing}
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
        backgroundColor  : Colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingRight     : 10,
        paddingLeft      : 10,
        paddingBottom    : 7,
        flexDirection    : 'row'
      }}>
        <View style={{
          position    : 'relative',
          flex        : 1,
          paddingRight: 10
        }}>
          <Icon
            style={{
              position : 'absolute',
              left     : 10,
              top      : 9,
              zIndex   : 99999,
              elevation: 5
            }}
            name={'md-search'}
            size={25}
            color={this.state.searchFocused ? Colors.primary : '#999'}/>
          <TextInput
            style={{
              flex             : 1,
              backgroundColor  : '#fff',
              paddingHorizontal: 10,
              borderRadius     : 4,
              paddingLeft      : 37,
              color            : '#444',
              ...(new Elevation(this.state.searchFocused ? 3 : 1))
            }}
            autoCorrect={false}
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
            placeholderTextColor={'#666'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <TouchableOpacity style={{
          height        : 50 - 7,
          alignItems    : 'center',
          justifyContent: 'center',
          flexDirection : 'column'
        }} onPress={() => {
          this.setState({showSortModal: true})
        }}>
          <Icon name={'md-funnel'} size={25} color={'#fff'}/>
          <Text style={{
            fontSize      : 12,
            borderRadius  : 4,
            color         : '#fff',
            fontWeight    : 'bold',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'center'
          }}>
            Sort
          </Text>
        </TouchableOpacity>
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
      onUnmount: () => this._resetDataSource(this.state.search),
      plant
    })
  }

  /**
   * Upload new or edited observations.
   *
   * @return {Promise<void>}
   * @private
   */
  async _uploadAll() {
    let observations = realm.objects('Submission').filtered('synced == false OR needs_update == true')
    observations     = JSON.parse(JSON.stringify(observations))
    let total        = 0
    Object.keys(observations).forEach(key => {
      total += Observation.countImages(observations[key].images)
    })
    if (total > 0) {
      let step = 0
      this.spinner
        .setTitle('Uploading Images')
        .setProgressTotal(total)
        .setProgress(step)
        .open()

      for (let i in observations) {
        if (!observations.hasOwnProperty(i)) {
          continue
        }

        let observation = observations[i]
        try {
          if (observation.needs_update) {
            await Observation.update(observation, () => {
              step++
              this.spinner.setProgress(step)
            })
            let realmObservation = realm.objects('Submission').filtered(`id = ${observation.id}`)[0]
            realm.write(() => {
              realmObservation.needs_update = false
            })
          } else {
            await Observation.upload(observation, () => {
              step++
              this.spinner.setProgress(step)
            })
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

          this.spinner.close()
          this.setState({noticeText: message})
          this.snackbar.showBar()

          break
        }
      }

      DeviceEventEmitter.emit('observationUploaded')
      this._resetDataSource(this.state.search)
      this.spinner.close()
      this.setState({noticeText: 'Observations uploaded successfully!'})
      this.snackbar.showBar()
    }
  }

  /**
   * Reset data source with latest data.
   * @private
   */
  _resetDataSource(search) {
    console.log('HERE', this.state.sort)
    this.setState({
      submissions: this._createMap(search),
      refreshing : false
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

  /**
   * Show the popover dropdown.
   * @param observation
   */
  showPopover(observation) {
    if (!this.buttons[observation.id]) {
      return
    }

    this.buttons[observation.id].measure((ox, oy, width, height, px, py) => {
      this.setState({
        selectedObservation: observation,
        popoverVisible     : true,
        buttonRect         : {x: px, y: py, width: width, height: height}
      })
    })
  }

  /**
   * Close the popover dropdown.
   */
  closePopover() {
    this.setState({popoverVisible: false})
    setTimeout(() => {
      this.setState({selectedObservation: {}})
    }, 250)
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
   * Share an observation.
   */
  share() {
    this.closePopover()

    const observation = this.state.selectedObservation
    const meta        = JSON.parse(observation.meta_data)
    const title       = observation.name === 'Other' ? meta.otherLabel : observation.name
    const url         = `https://treesnap.org/observation/${observation.serverID}`
    const prefix      = this._beginsWithVowel(title) ? 'an' : 'a'

    let message = `I shared ${prefix} ${title} observation with science partners on TreeSnap!`
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

  /**
   * Navigate to the observation screen.
   */
  viewObservation() {
    this.closePopover()
    this._goToEntryScene(this.state.selectedObservation)
  }

  getVerticalPadding() {
    if (Platform.OS === 'android') {
      return 0
    } else {
      if (isIphoneX()) {
        return 30
      }
      return 15
    }
  }

  _renderSelectedSortRowIcon(field, reverse) {
    const {sort} = this.state
    if (sort.field === field && sort.reverse === reverse) {
      return (
        <View style={{paddingHorizontal: 10}}>
          <Icon name={'md-checkmark'} color={Colors.primary} size={24}/>
        </View>
      )
    }

    return null
  }

  _renderSortModal() {
    return (
      <View style={{flex: 1}}>
        <View style={{
          paddingVertical: this.getVerticalPadding(),
          ...(Platform.OS === 'android' ? {paddingBottom: 15} : {}),
          justifyContent : 'flex-start',
          alignItems     : 'flex-end',
          backgroundColor: Colors.primary
        }}>
          <View style={{
            paddingTop    : 15,
            flexDirection : 'row',
            justifyContent: 'center',
            alignItems    : 'center'
          }}>
            <TouchableOpacity
              style={{
                width         : 40,
                alignItems    : 'flex-start',
                justifyContent: 'flex-end',
                paddingLeft   : 10
              }}
              onPress={() => {
                this.setState({showSortModal: false})
              }}>
              <Icon name={'md-close'} size={22} color={Colors.primaryText} style={{marginTop: 3}}/>
            </TouchableOpacity>
            <Text style={{
              color     : Colors.primaryText,
              fontSize  : 18,
              fontWeight: '600',
              flex      : 1
            }}>
              Sort By
            </Text>
          </View>
        </View>
        <View style={{
          flex           : 1,
          backgroundColor: '#eee'
        }}>
          <TouchableOpacity style={styles.sortRow} onPress={() => this.sortBy('id', true)}>
            <View style={styles.sortRowInnerWrapper}>
              <Text style={styles.sortRowText}>
                Date Descending
              </Text>
              <Text style={styles.sortRowDescription}>Newer observations first</Text>
            </View>
            {this._renderSelectedSortRowIcon('id', true)}
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortRow} onPress={() => this.sortBy('id', false)}>
            <View style={styles.sortRowInnerWrapper}>
              <Text style={styles.sortRowText}>
                Date Ascending
              </Text>
              <Text style={styles.sortRowDescription}>Older observations first</Text>
            </View>
            {this._renderSelectedSortRowIcon('id', false)}
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortRow} onPress={() => {
            if (this.state.location.latitude === false) {
              return
            }

            this.sortBy('distance', false)
          }}>
            <View style={styles.sortRowInnerWrapper}>
              <Text style={styles.sortRowText}>
                Distance Ascending
              </Text>
              <Text style={styles.sortRowDescription}>Closer to my current location first</Text>
              {this.state.location.latitude === false ?
                <Text style={[styles.sortRowDescription, {color: Colors.danger}]}>Not Available</Text>
                : null}
            </View>
            {this._renderSelectedSortRowIcon('distance', false)}
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortRow} onPress={() => {
            if (this.state.location.latitude === false) {
              return
            }
            this.sortBy('distance', true)
          }}>
            <View style={styles.sortRowInnerWrapper}>
              <Text style={styles.sortRowText}>
                Distance Descending
              </Text>
              <Text style={styles.sortRowDescription}>Farther from my current location first</Text>
              {this.state.location.latitude === false ?
                <Text style={[styles.sortRowDescription, {color: Colors.danger}]}>Not Available</Text>
                : null}
            </View>
            {this._renderSelectedSortRowIcon('distance', true)}
          </TouchableOpacity>
          <Text style={[styles.sortRowDescription, {padding: 10}]}>
            Please note that distance is approximated. Distance accuracy depends greatly
            on your device's GPS capabilities.
          </Text>
        </View>
      </View>
    )
  }

  sortBy(field, reverse) {
    this.setState({
      showSortModal: false,
      sort         : {
        field,
        reverse
      },
      refreshing   : true
    })

    setTimeout(() => {
      this._resetDataSource(this.state.search)
    }, 150)
  }

  /**
   * Render the screen.
   *
   * @return {*}
   */
  render() {
    return (
      <View style={styles.container}>
        <Header navigator={this.navigator}
                elevation={0}
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
          behavior={android ? 'height' : 'padding'}>
          {this._renderSearchBox()}
          {this._renderList()}
        </KeyboardAvoidingView>
        <SnackBar ref={ref => this.snackbar = ref} noticeText={this.state.noticeText}/>
        <Spinner ref={spinner => this.spinner = spinner}/>
        <Popover
          onCloseRequest={this.closePopover.bind(this)}
          visible={this.state.popoverVisible}
          triggerMeasurements={this.state.buttonRect}>
          <PopoverItem onPress={this.viewObservation.bind(this)}
                       style={styles.popoverItem}>
            <Icon name={android ? 'md-eye' : 'ios-eye'}
                  size={15}
                  color={Colors.warningText}
                  style={{width: 20}}/>
            <Text style={styles.popoverText}>View</Text>
          </PopoverItem>
          {this.state.selectedObservation.synced ?
            <PopoverItem onPress={this.share.bind(this)}
                         style={styles.popoverItem}>
              <Icon name={android ? 'md-share' : 'ios-share-outline'}
                    size={15}
                    color={Colors.warningText}
                    style={{width: 20}}/>
              <Text style={styles.popoverText}>Share</Text>
            </PopoverItem>
            : null}
        </Popover>
        <Modal
          animationType="slide"
          visible={this.state.showSortModal}
          onRequestClose={() => {
            this.setState({showSortModal: false})
          }}>
          {this._renderSortModal()}
        </Modal>
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

  sortRow: {
    paddingVertical  : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    backgroundColor  : '#fff'
  },

  sortRowInnerWrapper: {
    paddingHorizontal: 10
  },

  sortRowText: {
    color   : '#444',
    fontSize: 14
  },

  sortRowDescription: {
    color    : '#777',
    marginTop: 5,
    fontSize : 12
  },

  popoverText: {
    color   : '#444',
    fontSize: 14
  },

  popoverItem: {
    flexDirection: 'row',
    alignItems   : 'center'
  },

  row: {
    flexDirection  : 'row',
    alignItems     : 'center',
    backgroundColor: '#fff',
    padding        : 10
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
    width         : 60,
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
  },

  dropdownItem: {
    padding          : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})
