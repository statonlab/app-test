import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  Alert,
  Platform,
  TouchableOpacity,
  BackHandler,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import realm from '../db/Schema'
import t from 'tcomb-validation'
import PickerModal from '../components/PickerModal'
import DCP from '../resources/FormElements.js'
import Location from '../components/Location'
import File from '../helpers/File'
import Spinner from '../components/Spinner'
import AutoComplete from '../components/AutoComplete'
import { ACFCollection } from '../resources/Descriptions'
import ValidationRules from '../resources/ValidationRules'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import Analytics from '../helpers/Analytics'
import AdvancedSettingsModal from './AdvancedSettingsModal'
import CustomIDModal from './CustomIDModal'
import User from '../db/User'
import Images from '../helpers/Images'
import TreeNames from '../resources/TreeLatinNames.js'

const isAndroid  = Platform.OS === 'android'
const Coordinate = t.refinement(t.Number, (n) => n !== 0, 'Coordinate')
const LocationT  = t.dict(t.String, Coordinate)

export default class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPrivate                : false,
      images                   : {},
      title                    : this.props.title,
      units                    : 'US',
      location                 : {
        latitude : 0,
        longitude: 0,
        accuracy : -1,
      },
      metadata                 : {},
      id                       : '',
      warnings                 : {},
      bottomMargin             : new Animated.Value(0),
      deletedImages            : [],
      showCommentsModal        : false,
      hasPrivateComments       : false,
      custom_id                : '',
      showCustomIDModal        : false,
      showAdvancedSettingsModal: false,
      otherIdentifiers         : [],
    }

    this.user       = User.user()
    this.events     = []
    this.fs         = new File()
    this.primaryKey = 0
    this.formProps  = this.props.formProps // read in form items to display

    let formRules = {
      //images  : imageT,
      title   : t.String,
      location: LocationT,
    }

    this.formRulesMeta = this.compileValRules() // build form rules from passed props
    this.formT         = t.struct(formRules, 'formT') // build tcomb validation from rules
    this.formTMeta     = t.struct(this.formRulesMeta, 'formTMeta') // build tcomb validation from rules

    this.timeStarted = moment()
  }

  componentDidMount() {
    this.setUpComponent()

    if (!this.props.edit) {
      this.setDefaultValues()
    }
  }

  setUpComponent() {
    if (this.props.edit) {
      // For every key, set the state
      Object.keys(this.props.entryInfo).map(key => {
        if (key === 'meta_data') {
          this.setState({metadata: JSON.parse(this.props.entryInfo[key])})
          return
        }

        if (key === 'images') {
          this.setState({images: JSON.parse(this.props.entryInfo[key])})
          return
        }

        if (key === 'has_private_comments') {
          this.setState({hasPrivateComments: this.props.entryInfo[key]})
          return
        }

        if (key === 'is_private') {
          this.setState({isPrivate: this.props.entryInfo[key]})
          return
        }

        if (key === 'otherIdentifiers') {
          const observation = realm.objects('Submission').filtered('id = $0', this.props.entryInfo.id)[0]
          this.setState({otherIdentifiers: observation.otherIdentifiers.map(o => o.value)})
          return
        }

        this.setState({[key]: this.props.entryInfo[key]})
      })

      this.primaryKey = this.props.entryInfo.id
    } else {
      try {
        this.primaryKey = this.generatePrimaryKey()
      } catch (e) {
        this.primaryKey = 1
        console.error(e)
      }
    }

    // Get user preferences
    this.setState({
      units: this.user ? this.user.units : 'US',
    })

    // Add image resize event listener
    this.events.push(DeviceEventEmitter.addListener('imagesResized', this._handleResizedImages.bind(this)))

    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.cancel()
      return true
    })
  }

  /**
   * Generate a primary key.
   *
   * @return {number}
   */
  generatePrimaryKey() {
    // Generate a primary key
    let id = parseInt(Date.now().toString().slice(5) + Math.random().toString(10).slice(2, 4))

    while (realm.objects('Submission').filtered(`id = ${id}`).length > 0) {
      id = parseInt(Date.now().toString().slice(5) + Math.random().toString(10).slice(2, 4))
    }

    return id
  }

  /**
   * Finish the submission process
   *
   * @param images
   * @private
   */
  _handleResizedImages(images) {
    this.refs.spinner.close()

    if (this.props.edit) {
      DeviceEventEmitter.emit('editSubmission')
      this.saveEdit()
      return
    }

    this.save()
  }

  /**
   * Compress images once they are ready for processing.
   *
   * @param {{Object}} images
   * @return {Promise<*>}
   */
  async compressImages(images) {
    let Compressor = new Images()
    return await Compressor.compressAll(images)
  }

  /**
   * Store images in state.
   *
   * @param images
   * @param id
   */
  handleImages(images, id) {
    let _images = this.state.images
    _images[id] = images
    this.setState({images: _images})
  }

  /**
   * Handle deleted images event (pass as a prop to camera scene).
   * Set the state to delete all images.
   *
   * @param deletedImages
   */
  handleDeletedImages(deletedImages) {
    this.setState({deletedImages})
  }

  /**
   * Remove deleted images from the state.
   */
  getRemainingImages() {
    let images = this.state.images

    if (this.state.deletedImages.length === 0) {
      return images
    }

    Object.keys(images).map(key => {
      images[key].map(image => {
        let index = this.state.deletedImages.indexOf(image)
        if (index > -1) {
          // Found a deleted image, remove from the images list
          images[key].splice(index, 1)
        }
      })
    })

    return images
  }

  /**
   * Method for Cancel button.  Change scene, alert user about losing data.
   *
   * @returns {boolean}
   */
  cancel() {
    let keys = Object.keys(this.state.metadata)
    // TODO: we complain if there are keys set without values IE if the user clicked something but didnt select.
    // Would be better to test if the keys have values or to have a  value in the state that checks if its OK to cancel.
    if (this.state.images['images'] || keys.length > 0) {
      Alert.alert('Abandon Entry',
        'Data will be permanently lost if you leave. Are you sure?', [
          {
            text   : 'Leave',
            onPress: this.doCancel.bind(this),
            style  : 'destructive',
          },
          {
            text   : 'Stay',
            onPress: () => {
              // On cancel do nothing.
            },
            style  : 'cancel',
          },
        ])
      return false
    }

    this.doCancel()
    return true
  }

  /**
   * Recursively flatten an object.
   *
   * @param o
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
          results.push(item)
        })
      }
    })
    return results
  }

  /**
   *  Do the actual cancellation.
   *  Deals with image deletion.
   */
  doCancel() {
    if (this.props.edit === true) {
      // Extract new images only
      let oldImages = this.flattenObject(JSON.parse(this.props.entryInfo.images))
      let allImages = this.flattenObject(this.state.images)
      let newImages = allImages.filter(image => oldImages.indexOf(image) === -1)

      // Convert to object
      newImages = {images: newImages}

      // Delete only new images
      this.fs.delete(newImages, () => {
        if (typeof this.refs.spinner !== 'undefined') {
          this.refs.spinner.close()
        }
        this.props.navigator.goBack()
      })
      return
    }

    if (typeof this.refs.spinner !== 'undefined') {
      this.refs.spinner.open()
    }

    // Delete all images
    this.fs.delete(this.state.images, () => {
      if (typeof this.refs.spinner !== 'undefined') {
        this.refs.spinner.close()
      }
      this.props.navigator.goBack()
    })
  }

  /**
   * Generate compressed images and thumbnails.
   * Then, finish the submission by saving all new data
   */
  async generateImages() {
    if (this.refs.spinner) {
      this.refs.spinner.open()
    }

    let images = await this.compressImages(this.state.images)
    await this.fs.generateThumbnails(images)

    this.setState({images}, () => {
      if (this.refs.spinner) {
        this.refs.spinner.close()
      }

      if (this.props.edit) {
        DeviceEventEmitter.emit('editSubmission')
        this.saveEdit()
        return
      }

      this.save()
    })

    // this.fs.resizeImages(newImages, this.props.edit ? JSON.parse(this.props.entryInfo.images) : {})
  }

  /**
   * Submit button method.
   * Validate the primary and meta data with tcomb.
   */
  submit() {
    if (!this.state.images.images || !this.validateState().isValid()) {
      this.notifyIncomplete(this.validateMeta())
      return
    }

    if (!this.validateMeta().isValid()) {
      this.notifyIncomplete(this.validateMeta())
      return
    }

    this.generateImages()
  }

  /**
   * Write the observation to Realm, leave the scene.
   */
  save() {
    let observation = {
      id                  : this.primaryKey,
      name                : this.state.title.toString(),
      images              : JSON.stringify(this.getRemainingImages()),
      location            : this.state.location,
      date                : moment().format('MM-DD-YYYY HH:mm:ss').toString(),
      synced              : false,
      meta_data           : JSON.stringify(this.state.metadata),
      has_private_comments: this.state.hasPrivateComments,
      custom_id           : this.state.custom_id,
      is_private          : this.state.isPrivate,
      compressed          : true,
      otherIdentifiers    : this.state.otherIdentifiers.map(value => {
        return {value}
      }),
      collectedAt         : new Date(),
    }

    realm.write(() => {
      realm.create('Submission', observation)
    })

    this.fs.delete({images: this.state.deletedImages}, () => {
      // Tell anyone who cares that there is a new submission
      this.props.navigator.navigate('Submitted', {
        plant: observation,
      })
      DeviceEventEmitter.emit('newSubmission', observation)
    })

    const analytics = new Analytics()
    analytics.submittedObservation(observation, this.timeStarted, moment())
  }

  /**
   * Update observation in realm.
   */
  saveEdit() {
    realm.write(() => {
      // true as 3rd argument updates
      const observation = realm.create('Submission', {
        id                  : this.props.entryInfo.id,
        name                : this.state.title.toString(),
        images              : JSON.stringify(this.getRemainingImages()),
        location            : this.state.location,
        date                : this.props.entryInfo.date,
        synced              : this.props.entryInfo.synced,
        meta_data           : JSON.stringify(this.state.metadata),
        needs_update        : true,
        has_private_comments: this.state.hasPrivateComments,
        custom_id           : this.state.custom_id,
        is_private          : this.state.isPrivate,
        compressed          : true,
        otherIdentifiers    : this.state.otherIdentifiers.map(value => {
          return {value}
        }),
        collectedAt         : this.props.entryInfo.collectedAt,
      }, true)

      DeviceEventEmitter.emit('newSubmission', observation)
    })

    this.fs.delete({images: this.state.deletedImages}, () => {
      this.props.navigator.goBack()
    })
  }

  /**
   * execute tcomb validation method on the state, given the expected parameters formT.
   *
   * @returns {*}
   */
  validateState() {
    return t.validate(this.state, this.formT)
  }

  /**
   * Execute tcomb validation method on the metadata, given the expected parameters formT.
   *
   * @returns {*}
   */
  validateMeta() {
    return t.validate(this.state.metadata, this.formTMeta)
  }

  /**
   * Handle errors generated by tcomb. Update the warnings in the state
   * for changing text formatting.
   *
   * @param validationAttempt
   */
  notifyIncomplete(validationAttempt) {
    let errors    = validationAttempt.errors
    let errorList = []
    let warnings  = {}

    if (!this.state.images['images']) {
      warnings.images = true
      errorList.push('A photo is required')
    }

    errors.map((error) => {
      warnings[error.path[0]] = true
      if (typeof DCP[error.path[0]] !== 'undefined') {
        errorList.push('Required field: ' + DCP[error.path[0]].label)
      }
    })

    // Add error for no location
    if (this.state.location.latitude === 0 && this.state.location.longitude === 0 && this.state.location.accuracy === -1) {
      errorList.push('Cannot get location. Please wait for GPS signal and try again.')
    }

    this.setState({warnings})

    if (errorList) {
      alert(errorList.join('\n'))
    }
  }

  /**
   * Takes the formProps passed to the scene and creates the rules for tcomb.
   *
   * @returns {{}}
   */
  compileValRules() {
    let formBase = {}

    Object.keys(this.formProps).map(propItem => {
      formBase[propItem] = ValidationRules[propItem]
    })
    return formBase
  }

  /**
   * Remove any registered events
   */
  componentWillUnmount() {
    this.backEvent.remove()
    this.events.map(event => {
      event.remove()
    })
  }

  /**
   * Parse JSON to display the selected items in the form field for multicheck items.
   *
   * @param value
   * @param isArray
   * @returns {*}
   */
  getMultiCheckValue(value, isArray) {
    if (typeof value === 'string' && isArray) {
      return JSON.parse(value).toString()
    }
    return value
  }

  /**
   * Extract any conditional items.
   *
   * @param {object} config DCP[key]
   * @return {object} The given object with conditional properties assigned.
   */
  extractConditional(config) {
    if (typeof config.conditional !== 'object') {
      return config
    }

    const tree = this.state.title
    if (typeof config.conditional[tree] === 'undefined') {
      return config
    }

    // Loop through `conditional` instead of `config` since it'll
    // most likely have less items compared to the full config
    const conditional = config.conditional[tree]
    Object.keys(conditional).map(key => {
      config[key] = conditional[key]
    })

    return config
  }

  /**
   * Renders the form item for each key passed via formProps.
   * Form item will default to a picker Modal.
   *
   * @param key
   * @returns {{XML}}
   */
  populateFormItem(key) {
    if (typeof DCP[key] === undefined) {
      return
    }

    if (DCP[key].comment) {
      return
    }

    if (DCP[key].modalFreeText) {
      let value = this.getMultiCheckValue(this.state.metadata[key], DCP[key].multiCheck)
      let defaultList = TreeNames;
      if (this.state.metadata[key] && !(key in TreeNames)) {
        defaultList[this.state.metadata[key]] = [this.state.metadata[key]]
      }
      return (
        <AutoComplete
          style={styles.picker}
          onChange={(option) => {
            this.setState({metadata: {...this.state.metadata, [key]: option}})
          }}
          key={key}
          defaultList={defaultList}
          defaultText={this.state.metadata[key]}
        >
          <View style={styles.formGroup}>
            <View style={styles.picker}>
              <Text
                style={this.state.warnings[key] ? [styles.label, styles.labelWarning] : styles.label}>
                {DCP[key].label}
              </Text>
              <Text style={[styles.textField, value ? {} : styles.placeholder]}>
                {value || DCP[key].placeHolder}
              </Text>
              {dropdownIcon}
            </View>
          </View>
        </AutoComplete>
      )
    }

    if (DCP[key].numeric) {
      let confidenceKey = [key] + '_confidence'
      let unitsKey      = [key] + '_units'
      let userUnit      = this.state.units
      let questionUnit  = null

      if (typeof DCP[key].units !== 'undefined') {
        questionUnit = typeof DCP[key].units === 'string' ? DCP[key].units : DCP[key].units[userUnit]
      }

      let selectedUnit = this.state.metadata[unitsKey] ? this.state.metadata[unitsKey] : questionUnit

      let value = null
      if (this.state.metadata[key]) {
        value = this.state.metadata[key] + ` ${selectedUnit}`
      } else {
        if (typeof DCP[key].initialSelect !== 'undefined') {
          value = DCP[key].initialSelect + ` ${selectedUnit}`
        }
      }

      DCP[key] = this.extractConditional(DCP[key])
      return (
        <View key={key}>
          <View style={styles.formGroup}>
            <PickerModal
              style={styles.picker}
              images={DCP[key].images}
              captions={DCP[key].captions}
              multiCheck={DCP[key].multiCheck}
              initialSelect={DCP[key].initialSelect}
              default={DCP[key].default}
              startingNumeric={[this.state.metadata[key], this.state.metadata[confidenceKey]]}
              numeric={DCP[key].numeric}
              useCircumference={DCP[key].useCircumference}
              units={DCP[key].units}
              selectedUnit={selectedUnit}
              header={DCP[key].description}
              choices={DCP[key].selectChoices}
              numberPlaceHolder={DCP[key].numberPlaceHolder}
              onSelect={(value, confidence, unit) => {
                let metadata  = this.state.metadata
                metadata[key] = value

                if (typeof DCP[key].selectChoices !== 'undefined') {
                  metadata[confidenceKey] = confidence
                }

                if (typeof DCP[key].units !== 'undefined') {
                  metadata[unitsKey] = unit
                }

                this.setState({metadata})
              }}
            >
              <View style={styles.picker}>
                <Text
                  style={this.state.warnings[key] ? [styles.label, styles.labelWarning] : styles.label}>
                  {DCP[key].label}
                </Text>
                <Text style={[styles.textField, value ? {} : styles.placeholder]}>
                  {value || DCP[key].placeHolder}
                </Text>
                {dropdownIcon}
              </View>
            </PickerModal>
          </View>
          {DCP[key].camera && DCP[key].camera.includes(this.state.metadata[key]) ?
            this.renderCameraItem(DCP[key].label, DCP[key].label)
            : null}
        </View>
      )
    }

    let value
    if (!this.state.metadata[key]) {
      value = typeof DCP[key].initialSelect !== 'undefined' ? DCP[key].initialSelect : DCP[key].placeholder
    } else {
      value = this.getMultiCheckValue(this.state.metadata[key], DCP[key].multiCheck)
    }

    DCP[key] = this.extractConditional(DCP[key])
    return (
      <View key={key}>
        <View style={styles.formGroup}>
          <PickerModal
            style={styles.picker}
            images={DCP[key].images}
            captions={DCP[key].captions}
            multiCheck={DCP[key].multiCheck}
            startingString={this.state.metadata[key]}
            numeric={DCP[key].numeric}
            initialSelect={DCP[key].initialSelect}
            useCircumference={DCP[key].useCircumference}
            units={DCP[key].units}
            header={DCP[key].description}
            choices={DCP[key].selectChoices}
            onSelect={(option) => {
              this.setState({metadata: {...this.state.metadata, [key]: option}})
            }}
          >
            <View style={styles.picker}>
              <Text
                style={this.state.warnings[key] ? [styles.label, styles.labelWarning] : styles.label}>
                {DCP[key].label}
              </Text>
              <Text style={[styles.textField, value ? {} : styles.placeholder]}>
                {value || DCP[key].placeHolder}
              </Text>
              {dropdownIcon}
            </View>
          </PickerModal>
        </View>
        {DCP[key].camera && DCP[key].camera.includes(this.state.metadata[key]) ?
          this.renderCameraItem(DCP[key].label, DCP[key].label)
          :
          null
        }
      </View>
    )
  }

  /**
   * Form items with starting values need to be set separately here.
   */
  setDefaultValues() {
    let metadata = {}
    Object.keys(this.props.formProps).map(key => {
      if (DCP[key].startValue) {
        metadata[key] = DCP[key].startValue
      } else if (DCP[key].initialSelect) {
        metadata[key] = DCP[key].initialSelect
      }
    })

    this.setState({metadata})
  }


  /**
   * Goes through the formProps and returns an array of JSX for each form item.
   *
   * @returns {Array}
   */
  renderForm() {
    return Object.keys(this.props.formProps).map(this.populateFormItem.bind(this))
  }

  /**
   * Render mailable submission id with special instruction modal.
   *
   * @returns {{XML}}
   */
  renderBiominder() {
    let header = 'Mailing Samples to the American Chestnut Foundation'
    return (
      <PickerModal
        style={styles.picker}
        header={header}
        specialText={ACFCollection}
      >
        <View style={[styles.formGroup, {justifyContent: 'center'}]}>
          <Text style={[styles.label]}>
            Submission ID
          </Text>
          <Text style={[styles.textField]}>
            {this.primaryKey}
          </Text>
          <Icon name="help-circle" style={[styles.icon, {color: Colors.info}]}/>
        </View>
      </PickerModal>
    )
  }

  /**
   * Render camera fields.
   *
   * @param id
   * @param label
   * @returns {{XML}}
   */
  renderCameraItem(id, label) {
    let description = 'Add photos'
    // if (id === 'images') {
    //   description = 'Add photos'
    // }

    return (
      <View style={[styles.formGroup]}>
        <TouchableOpacity
          style={[styles.buttonLink, {height: this.state.images[id] && this.state.images[id].length > 0 ? 60 : 40}]}
          onPress={() => this._goToCamera(id)}>
          <Text
            style={this.state.warnings[id] ? [styles.label, styles.labelWarning] : styles.label}>{label}</Text>
          {!this.state.images[id] || this.state.images[id].length === 0 ?
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
              <Text style={[styles.buttonLinkText, {color: '#aaa'}]}>{description}</Text>
              <Icon name="camera" style={[styles.icon]}/>
            </View>
            :
            this.renderPhotosField(id)
          }
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Returns the form item describing photos added.
   *
   * @returns {{XML}}
   */
  renderPhotosField(id) {
    if (!this.state.images[id]) {
      return null
    }

    let length = this.state.images[id].length
    let text   = length > 1 ? 'photos' : 'photo'
    let image  = this.state.images[id][length - 1]

    if (this.props.edit) {
      let oldImages = JSON.parse(this.props.entryInfo.images)
      if (typeof oldImages[id] !== 'undefined' && oldImages[id].indexOf(image) > -1) {
        image = this.fs.thumbnail(image)
      }
    }

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', height: 90}}>
        <Text style={[styles.buttonLinkText, {color: '#444'}]}>{length} {text} added</Text>
        <Image source={{uri: image}} style={[styles.thumbnail]}/>
      </View>
    )
  }

  customIDValue() {
    const {custom_id, otherIdentifiers} = this.state

    if (custom_id.length === 0 && otherIdentifiers.length === 0) {
      return 'Optional'
    }

    let id = custom_id

    if (id.length > 0 && otherIdentifiers.length > 0) {
      id += ', ' + otherIdentifiers.join(', ')
    }

    if (id.length === 0 && otherIdentifiers.length > 0) {
      id = otherIdentifiers.join(', ')
    }

    return id
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <ScrollView
          showsVerticalScrollIndicator={true}
          extraScrollHeight={60}
          enableResetScrollToCoords={true}
          keyboardShouldPersistTaps="always">
          <View style={[styles.card]}>
            {this.renderCameraItem('images', 'Images')}
            {this.renderForm()}
            {this.props.title === 'American Chestnut' ? this.renderBiominder() : null}

            <TouchableOpacity style={[styles.formGroup, {flex: 0, alignItems: 'flex-start'}]}
                              onPress={() => {
                                this.setState({showCommentsModal: true})
                              }}>
              <Text style={[styles.label, {paddingTop: 10}]}>Comments</Text>
              <Text style={{
                paddingTop : 10,
                paddingLeft: 5,
                flex       : 1,
                color      : this.state.metadata.comment ? '#444' : '#aaa',
              }}>{this.state.metadata.comment || 'Add comment'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.formGroup]}
                              onPress={() => this.setState({showCustomIDModal: true})}>
              <Text style={[styles.label]}>Tree Identifier</Text>
              <Text style={{
                paddingLeft: 5,
                flex       : 1,
                color      : this.state.custom_id || this.state.otherIdentifiers.length > 0 ? '#444' : '#aaa',
              }}>
                {this.customIDValue()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formGroup, {
                flex          : 0,
                flexDirection : 'row',
                alignItems    : 'center',
                justifyContent: 'space-between',
              }]}
              onPress={() => {
                this.setState({showAdvancedSettingsModal: true})
              }}>
              <Text style={{
                color     : Colors.primary,
                fontWeight: '500',
                fontSize  : 14,
              }}>
                Advanced Options
              </Text>
              <Text style={{
                paddingRight: 10,
              }}>
                <IonIcon name={'ios-apps'} size={20} color={'#777'}/>
              </Text>
            </TouchableOpacity>

            <View style={[styles.formGroup, {flex: 0}]}>
              <Text style={[styles.label, {width: 60}]}>Location</Text>
              {this.props.edit ?
                <Location edit={this.props.edit}
                          coordinates={this.props.entryInfo.location}
                          onChange={(location) => this.setState({location})}/> :
                <Location onChange={(location) => this.setState({location})}/>
              }
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.flex1]}
                            onPress={this.submit.bind(this)}
                            rippleColor="rgba(0,0,0,0.5)">
            <Text style={styles.buttonText}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonAlt, styles.flex1]}
                            onPress={this.cancel.bind(this)}>
            <Text style={styles.buttonAltText}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {this._renderCommentsModal()}
        {this._renderCustomIDModal()}
        {this._renderAdvancedSettingsModal()}
      </View>
    )
  }

  _renderAdvancedSettingsModal() {
    return (
      <AdvancedSettingsModal
        initialValues={{
          hasPrivateComments: this.state.hasPrivateComments,
          isPrivate         : this.state.isPrivate,
        }}
        onChange={values => {
          this.setState({
            hasPrivateComments: values.hasPrivateComments,
            isPrivate         : values.isPrivate,
          })
        }}
        onRequestClose={() => {
          this.setState({showAdvancedSettingsModal: false})
        }}
        visible={this.state.showAdvancedSettingsModal}/>
    )
  }

  _renderCommentsModal() {
    return (
      <Modal
        animationType="slide"
        onRequestClose={() => {
          this.setState({showCommentsModal: false})
        }}
        visible={this.state.showCommentsModal}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Comments</Text>
        </View>
        <KeyboardAvoidingView style={{flex: 1}}
                              {...(isAndroid ? null : {behavior: 'padding'})}>
          <View style={{flex: 1, padding: 10}}>
            <TextInput
              style={[styles.comment]}
              placeholder="Additional Comments"
              placeholderTextColor="#aaa"
              value={this.state.metadata.comment}
              onChangeText={(comment) => this.setState({
                metadata: {
                  ...this.state.metadata,
                  comment: comment,
                },
              })}
              multiline={true}
              numberOfLines={8}
              underlineColorAndroid="transparent"
              onEndEditing={() => this.setState({showCommentsModal: false})}
              autoFocus={true}
            />
          </View>
          <View style={{
            flex          : 0,
            justifyContent: 'flex-end',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            ...ifIphoneX({paddingBottom: 20, backgroundColor: '#eee'}),
          }}>
            <TouchableOpacity style={[{
              backgroundColor  : '#f7f7f7',
              flex             : 0,
              paddingVertical  : 10,
              paddingHorizontal: 15,
            }]}
                              onPress={() => {
                                this.setState({showCommentsModal: false})
                              }}>
              <Text style={{
                color    : Colors.primary,
                fontSize : 14,
                textAlign: 'right',
              }}>DONE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  _renderCustomIDModal() {
    return (
      <CustomIDModal
        customID={this.state.custom_id}
        otherIdentifiers={this.state.otherIdentifiers}
        onChange={(custom_id, otherIdentifiers) => {
          this.setState({custom_id, otherIdentifiers: otherIdentifiers === null ? [] : otherIdentifiers})
        }}
        onRequestClose={() => {
          this.setState({showCustomIDModal: false})
        }}
        visible={this.state.showCustomIDModal}
      />
    )
  }

  /**
   * Takes the form to a mounted camera scene or mounts a new one.
   *
   * @private
   */
  _goToCamera(id) {
    this.props.navigator.navigate('Camera', {
      navigator: this.props.navigator,
      images   : this.state.images[id] ? this.state.images[id] : [],
      onDone   : this.handleImages.bind(this),
      onDelete : this.handleDeletedImages.bind(this),
      id       : id,
    })
  }
}

Form.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
  formProps: PropTypes.object,
  edit     : PropTypes.bool,
  entryInfo: PropTypes.object,
}

function getVerticalPadding() {
  if (Platform.OS === 'android') {
    return 0
  } else {
    if (isIphoneX()) {
      return 30
    }
    return 15
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column',
  },

  modalHeader: {
    backgroundColor: Colors.primary,
    paddingTop     : getVerticalPadding(),
    paddingBottom  : 10,
    ...(new Elevation(2)),
  },

  modalHeaderText: {
    color          : Colors.primaryText,
    textAlign      : 'center',
    fontWeight     : 'normal',
    fontSize       : 16,
    paddingVertical: 5,
  },

  card: {
    backgroundColor: '#fff',
    flex           : 0,
    flexDirection  : 'column',
    marginBottom   : 10,
    borderRadius   : 0,
  },

  thumbnail: {
    height         : 50,
    width          : 50,
    borderRadius   : 3,
    resizeMode     : 'cover',
    backgroundColor: '#fff',
  },

  formGroup: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    minHeight        : 50,
  },

  picker: {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center',
    width        : undefined,
  },

  label: {
    flex      : 0,
    width     : 110,
    color     : '#444',
    fontWeight: 'bold',
  },

  labelWarning: {
    color: Colors.danger,
  },

  touchable: {
    flex          : 1,
    height        : 40,
    justifyContent: 'center',
    alignItems    : 'flex-start',
  },

  touchableText: {
    flex       : 1,
    color      : '#444',
    width      : undefined,
    marginTop  : 10,
    textAlign  : 'left',
    paddingLeft: 15,
  },

  textField: {
    //height           : 40,
    //marginTop        : 10,
    paddingHorizontal: 5,
    color            : '#444',
    fontSize         : 14,
    flex             : 1,
    width            : undefined,
  },

  subHeadText: {
    fontSize: 22,
    flex    : 1,
  },

  button: {
    ...(new Elevation(1)),
    flex             : 1,
    borderRadius     : 2,
    backgroundColor  : Colors.primary,
    paddingHorizontal: 10,
    paddingVertical  : 10,
  },

  flex1: {
    flex: 1,
  },

  buttonAlt: {
    backgroundColor: '#fff',
    marginLeft     : 5,
  },

  buttonBiominder: {
    backgroundColor: Colors.info,
  },

  buttonLink: {
    width          : undefined,
    backgroundColor: 'transparent',
    paddingLeft    : 0,
    height         : 40,
    justifyContent : 'center',
    flex           : 1,
    alignItems     : 'center',
    flexDirection  : 'row',
  },

  buttonText: {
    textAlign : 'center',
    color     : '#fff',
    fontWeight: 'bold',
  },

  buttonAltText: {
    textAlign : 'center',
    color     : '#666',
    fontWeight: 'bold',
  },

  buttonLinkText: {
    color            : '#666',
    flex             : 1,
    paddingHorizontal: 5,
  },

  comment: {
    flex           : 1,
    width          : undefined,
    height         : undefined,
    alignItems     : 'flex-start',
    paddingVertical: 30,
  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : '#aaa',
  },

  image: {
    width     : 50,
    height    : 50,
    resizeMode: 'cover',
  },

  footer: {
    flex             : 0,
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    paddingVertical  : 5,
    paddingHorizontal: 5,
    borderTopWidth   : 1,
    borderTopColor   : '#ddd',
    backgroundColor  : '#f5f5f5',
    ...ifIphoneX({
      paddingBottom    : 25,
      paddingHorizontal: 10,
    }),
  },

  slider: {
    width: 200,
  },

  placeholder: {
    color: '#aaa',
  },

  text: {
    color       : '#444',
    fontSize    : 14,
    marginBottom: 10,
  },
})

const dropdownIcon = (<
  Icon
  name="arrow-down-drop-circle-outline"
  style={styles.icon}
/>)
