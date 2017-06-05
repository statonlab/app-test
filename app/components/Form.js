import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  Alert,
  Platform
} from 'react-native'
import moment from 'moment'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {MKButton} from 'react-native-material-kit'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import realm from '../db/Schema'
import t from 'tcomb-validation'
import PickerModal from '../components/PickerModal'
import DCP from '../resources/config.js'
import SliderPick from '../components/SliderPick'
import Location from '../components/Location'
import File from '../helpers/File'
import Spinner from '../components/Spinner'

const isAndroid = Platform.OS === 'android'

const DCPrules = {
  seedsBinary            : t.enums.of(DCP.seedsBinary.selectChoices, 'seed'),
  flowersBinary          : t.enums.of(DCP.flowersBinary.selectChoices, 'flowers'),
  woollyAdesPres         : t.Boolean,
  woollyAdesCoverage     : t.enums.of(DCP.woollyAdesCoverage.selectChoices, 'woollyAdesCoverage'),
  acorns                 : t.enums.of(DCP.acorns.selectChoices, 'acorns'),
  heightFirstBranch      : t.Number,
  diameterNumeric        : t.Number,
  heightNumeric          : t.Number,
  ashSpecies             : t.enums.of(DCP.ashSpecies.selectChoices, 'ashSpecies'),
  crownHealth            : t.Number,
  otherLabel             : t.String,
  treated                : t.enums.of(DCP.treated.selectChoices),
  cones                  : t.enums.of(DCP.cones.selectChoices),
  crownClassification    : t.enums.of(DCP.crownClassification.selectChoices),
  partOfStudy            : t.enums.of(DCP.partOfStudy.selectChoices),
  locationComment        : t.maybe(t.String),
  burrs                  : t.enums.of(DCP.burrs.selectChoices),
  catkins                : t.enums.of(DCP.catkins.selectChoices),
  //Multichoice: must be string
  //TO DO: validate to a list of the choices instead
  locationCharacteristics: t.String,
  nearbyTrees            : t.String,
  emeraldAshBorer        : t.maybe(t.String),
  oakHealthProblems      : t.maybe(t.String),
  chestnutBlightSigns    : t.maybe(t.String),
  //Deprecated choices
  // surroundings           : t.enums.of(DCP.surroundings.selectChoices)
  // nearbySmall            : t.enums.of(DCP.nearbySmall.selectChoices),
  // nearbyDead             : t.enums.of(DCP.nearbyDead.selectChoices),
  // accessibility          : t.enums.of(DCP.accessibility.selectChoices),
  // nearByHemlock          : t.enums.of(DCP.nearByHemlock.selectChoices),


}

const Coordinate = t.refinement(t.Number, (n) => n !== 0, 'Coordinate')
const LocationT  = t.dict(t.String, Coordinate)


export default class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images      : {},
      title       : this.props.title,
      location    : {
        latitude : 0,
        longitude: 0,
        accuracy : -1
      },
      metadata    : {},
      id          : '',
      warnings    : {},
      bottomMargin: new Animated.Value(0)
    }

    this.events     = []
    this.realm      = realm
    this.fs         = new File()
    this.primaryKey = 0
    this.formProps  = this.props.formProps // read in form items to display

    let formRules = {
      images  : t.maybe(t.dict(t.String, t.list(t.String))),
      title   : t.String,
      location: LocationT
    }

    this.formRulesMeta = this.compileValRules() // build form rules from passed props
    this.formT         = t.struct(formRules, 'formT') // build tcomb validation from rules
    this.formTMeta     = t.struct(this.formRulesMeta, 'formTMeta') // build tcomb validation from rules
  }

  componentWillMount() {
    if (this.props.edit) {
      // For every key, set the state
      Object.keys(this.props.entryInfo).map(key => {
        if (key === 'meta_data') {
          this.setState({'metadata': JSON.parse(this.props.entryInfo[key])})
          return
        }

        if (key === 'images') {
          this.setState({images: JSON.parse(this.props.entryInfo[key])})
          return
        }

        this.setState({[key]: this.props.entryInfo[key]})
      })
      this.primaryKey = this.props.entryInfo.id
    } else {
      // Generate a primary key
      this.primaryKey = this.realm.objects('Submission')
      if (this.primaryKey.length <= 0) {
        this.primaryKey = parseInt(moment().format('DMMYYH').toString())
      } else {
        this.primaryKey = this.primaryKey.sorted('id', true)[0].id + 1
      }
    }


    // Add image resize event listener
    this.events.push(DeviceEventEmitter.addListener('imagesResized', this._handleResizedImages))
  }

  componentDidMount() {
    if (!this.props.edit) {
      this.setDefaultValues()
    }
  }

  /**
   * Handle resized images.
   *
   * @param images
   * @private
   */
  _handleResizedImages = (images) => {
    this.refs.spinner.close()
    this.setState({images})
    this.save()
  }

  /**
   * Store images in state.
   *
   * @param images
   * @param id
   */
  handleImages = (images, id) => {
    let _images = this.state.images
    _images[id] = images
    this.setState({images: _images})
  }

  /**
   * Method for Cancel button.  Change scene, alert user about losing data.
   *
   * @returns {boolean}
   */
  cancel = () => {
    if (this.state.images['images'] || Object.keys(this.state.metadata)[0]) {
      Alert.alert('Cancel Submission',
        'Data will be permanently lost if you cancel. Are you sure?', [
          {
            text   : 'Yes',
            onPress: this.doCancel
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

    this.doCancel()
    return true
  }

  // Do the actual cancellation
  doCancel = () => {
    this.refs.spinner.open()
    // Delete all images
    this.fs.delete(this.state.images, () => {
      this.refs.spinner.close()
      this.props.navigator.popToTop()
    })
  }

  /**
   * Generate resized images and thumbnails.
   *
   */
  generateImages = () => {
    this.fs.resizeImages(this.state.images)

    this.refs.spinner.open()
  }

  /**
   * Submit button method.  Validate the primary and meta data with tcomb.
   */
  submit = () => {
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
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
  save = () => {
    let observation = {
      id       : this.primaryKey,
      name     : this.state.title.toString(),
      images   : JSON.stringify(this.state.images),
      location : this.state.location,
      date     : moment().format('MM-DD-YYYY HH:mm:ss').toString(),
      synced   : false,
      meta_data: JSON.stringify(this.state.metadata)
    }

    this.realm.write(() => {
      this.realm.create('Submission', observation)
    })

    // Tell anyone who cares that there is a new submission
    DeviceEventEmitter.emit('newSubmission')

    this.props.navigator.replace({
      label   : 'SubmittedScene',
      plant   : observation,
      gestures: {}
    })
  }

  /**
   * Update existing observation.
   */
  submitEdit = () => {
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
      return
    }
    if (!this.validateMeta().isValid()) {
      this.notifyIncomplete(this.validateMeta())
      return
    }

    let primaryKey = this.props.entryInfo.id

    let observation = {
      id          : primaryKey,
      name        : this.state.title.toString(),
      images      : JSON.stringify(this.state.images),
      location    : this.props.entryInfo.location,
      date        : this.props.entryInfo.date,
      synced      : this.props.entryInfo.synced,
      meta_data   : JSON.stringify(this.state.metadata),
      needs_update: true
    }

    this.realm.write(() => {
      realm.create('Submission', observation, true)  // true as 3rd argument updates
    })
    DeviceEventEmitter.emit('editSubmission')
    this.props.navigator.pop()
  }

  /**
   * execute tcomb validation method on the state, given the expected parameters formT
   * @returns {*}
   */
  validateState = () => {
    return t.validate(this.state, this.formT)
  }

  /**
   * Execute tcomb validation method on the metadata, given the expected parameters formT
   *
   * @returns {*}
   */

  validateMeta = () => {
    return t.validate(this.state.metadata, this.formTMeta)
  }

  /**
   * Handle errors generated by tcomb.  Update the warnings in the state for changing text formatting.
   *
   * @param validationAttempt
   */
  notifyIncomplete = (validationAttempt) => {
    let errors = validationAttempt.errors
    let errorList = []
    let warnings  = {}

    errors.map((error) => {
      warnings[error.path] = true
      if (typeof DCP[error.path] !== 'undefined') {
        errorList.push('Required field: ' + DCP[error.path].label)
      }
    })
    //Add error for no location
    if (this.state.location.latitude === 0 && this.state.location.longitude === 0 && this.state.location.accuracy === -1) {
      errorList.push('Cannot get location.  Please wait for GPS signal and try again.')
    }
    this.setState({warnings})

    if (errorList) {
      alert(errorList.join('\n'))
    }
  }

  /**
   * Takes the formProps passed to the scene and creates the rules for tcomb
   * @returns {{}}
   */
  compileValRules = () => {
    let formBase = {}

    Object.keys(this.formProps).map(propItem => {
      formBase[propItem] = DCPrules[propItem]
    })
    return formBase
  }

  /**
   * Remove any registered events
   */
  componentWillUnmount() {
    this.events.map(event => {
      event.remove()
    })
  }

  /**
   * Parse JSON to display the selected items in the form field for multicheck items.
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
   * Renders the form item for each key passed via formProps.
   * Form item will default to a picker Modal.
   * @param key
   * @returns {XML}
   */
  populateFormItem = (key) => {
    if (typeof DCP[key] === undefined) return

    if (DCP[key].comment) {
      return
    }

    if (DCP[key].slider) {
      return (
        <View style={styles.formGroup} key={key}>
          <Text style={this.state.warnings[key] ? [styles.label, styles.labelWarning] : styles.label}>{DCP[key].label}</Text>
          <SliderPick
            key={key}
            images={DCP[key].images}
            start={ this.state.metadata[key] ? this.state.metadata[key] : null}
            max={DCP[key].maxValue}
            min={DCP[key].minValue}
            legendText={DCP[key].units}
            description={DCP[key].description}
            onChange={(value) => {
              this.setState({metadata: {...this.state.metadata, [key]: value}})
            }}
          />
        </View>
      )
    }

    return (
      <View key={key}>
        <View style={styles.formGroup} key={key}>
          <PickerModal
            style={styles.picker}
            images={DCP[key].images}
            captions={DCP[key].captions}
            multiCheck={DCP[key].multiCheck}
            freeText={DCP[key].modalFreeText}
            header={DCP[key].description}
            choices={DCP[key].selectChoices}
            onSelect={(option) => {
              this.setState({metadata: {...this.state.metadata, [key]: option}})
            }}
          >
            <View style={styles.picker}>
              <Text style={this.state.warnings[key] ? [styles.label, styles.labelWarning] : styles.label}>{DCP[key].label}</Text>
              <TextInput
                style={styles.textField}
                editable={false}
                placeholder={DCP[key].placeHolder}
                placeholderTextColor="#aaa"
                value={this.getMultiCheckValue(this.state.metadata[key], DCP[key].multiCheck)}
                underlineColorAndroid="transparent"
              />
              {dropdownIcon}
            </View>
          </PickerModal>
        </View>
        {DCP[key].camera && DCP[key].camera.includes(this.state.metadata[key]) ? this.renderCameraItem(DCP[key].label, DCP[key].label)
          : null}
      </View>
    )
  }

  /**
   * Form items with starting values need to be set separately here.
   */
  setDefaultValues = () => {
    let metadata = {}
    Object.keys(this.props.formProps).map(key => {
      if (DCP[key].startValue) {
        metadata = {
          ...metadata,
          [key]: DCP[key].startValue
        }
      }
    })

    this.setState({metadata})
  }


  /**
   * Goes through the formProps and returns an array of JSX for each form item.
   * @returns {Array}
   */
  renderForm = () => {
    return Object.keys(this.props.formProps).map(this.populateFormItem)
  }

  /**
   * Renders the extra comment field for hidden comments detailing directions to an observation.
   * Not currently implemented
   * @returns {*}
   */
  renderHiddenComments = () => {
    if (this.props.formProps.locationComment) {
      return (
        <View style={[styles.formGroup, {flex: 0, alignItems: 'flex-start'}]}>
          <Text style={[styles.label, {paddingTop: 5}]}>Location</Text>
          <TextInput
            style={[styles.textField, styles.comment]}
            placeholder="Comments regarding the location of this tree.  These comments will only be veiwable to Treesnap forestry partners"
            placeholderTextColor="#aaa"
            value={this.state.metadata.comment}
            onChangeText={(comment) => this.setState({metadata: {...this.state.metadata, locationComment: comment}})}
            multiline={true}
            numberOfLines={4}
            underlineColorAndroid="transparent"
          />
        </View>
      )
    }
    return null
  }

  /**
   * Render mailable submission id.
   *
   * @returns {XML}
   */
  renderBiominder = () => {
    return (
      <View style={[styles.formGroup, {justifyContent: 'center'}]}>
        <Text style={[{color: '#444', flex: 1, fontWeight: 'bold', justifyContent: 'center'}]}>
          ID number for submission: {this.primaryKey}
        </Text>
      </View>
    )
  }

  /**
   * Render camera fields.
   *
   * @param id
   * @param label
   * @returns {XML}
   */
  renderCameraItem = (id, label) => {
    let description = 'optional'
    if (id === 'images') {
      description = 'Add photos'
    }

    return (
      <View style={[styles.formGroup]}>
        <MKButton
          style={[styles.buttonLink, {height: this.state.images[id] && this.state.images[id].length > 0 ? 60 : 40}]}
          onPress={() => this._goToCamera(id)}
        >
          <Text style={this.state.warnings.photos ? [styles.label, styles.labelWarning] : styles.label}>{label}</Text>
          {!this.state.images[id] || this.state.images[id].length === 0 ?
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
              <Text style={[styles.buttonLinkText, {color: '#aaa'}]}>{description}</Text>
              <Icon name="camera" style={[styles.icon]}/>
            </View>
            :
            this.renderPhotosField(id)
          }
        </MKButton>
      </View>
    )

  }

  /**
   *Returns the form item describing photos added.
   * @returns {XML}
   */

  renderPhotosField = (id) => {
    if (!this.state.images[id]) {
      return null
    }

    let length = this.state.images[id].length
    let text   = length > 1 ? 'photos' : 'photo'
    let image  = this.state.images[id][length - 1]

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', height: 90}}>
        <Text style={[styles.buttonLinkText, {color: '#444'}]}>{length} {text} added</Text>
        <Image source={{uri: image}} style={[styles.thumbnail]}/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <KeyboardAwareScrollView
          keyboardDismissMode={isAndroid ? 'none' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={60}
          enableResetScrollToCoords={true}
        >
          <View style={[styles.card]}>
            {this.renderCameraItem('images', 'Images')}
            {this.renderForm()}
            {this.renderHiddenComments()}
            {this.props.title === 'American Chestnut' ? this.renderBiominder() : null}

            <View style={[styles.formGroup, {flex: 0, alignItems: 'flex-start'}]}>
              <Text style={[styles.label, {paddingTop: 5}]}>Comments</Text>
              <TextInput
                style={[styles.textField, styles.comment]}
                placeholder="Additional Comments"
                placeholderTextColor="#aaa"
                value={this.state.metadata.comment}
                onChangeText={(comment) => this.setState({metadata: {...this.state.metadata, comment: comment}})}
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={[styles.formGroup, {flex: 0}]}>
              <Text style={[styles.label, {width: 60}]}>Location</Text>
              {this.props.edit ?
                <Location edit={this.props.edit} coordinates={this.props.entryInfo.location} onChange={(location) => this.setState({location})}/> :
                <Location onChange={(location) => this.setState({location})}/>
              }

            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          <MKButton style={[styles.button, styles.flex1]} onPress={this.props.edit ? this.submitEdit : this.submit} rippleColor="rgba(0,0,0,0.5)">
            <Text style={styles.buttonText}>
              {this.props.edit ? 'Confirm Edit' : 'Submit Entry'}
            </Text>
          </MKButton>

          <MKButton style={[styles.button, styles.buttonAlt, styles.flex1]} onPress={this.cancel}>
            <Text style={styles.buttonAltText}>
              Cancel
            </Text>
          </MKButton>
        </View>
      </View>
    )
  }

  /**
   * Takes the form to a mounted camera scene or mounts a new one.
   *
   * @private
   */
  _goToCamera = (id) => {
    this.props.navigator.push({
      label   : 'CameraScene',
      images  : this.state.images[id] ? this.state.images[id] : [],
      onDone  : this.handleImages.bind(this),
      id      : id,
      gestures: {}
    })
  }
}

Form.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
  formProps: PropTypes.object,
  edit     : PropTypes.bool,
  entryInfo: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  card: {
    backgroundColor: '#fff',
    flex           : 0,
    flexDirection  : 'column',
    marginBottom   : 10,
    borderRadius   : 0
  },

  thumbnail: {
    height         : 50,
    width          : 50,
    borderRadius   : 3,
    resizeMode     : 'cover',
    backgroundColor: '#fff'
  },

  formGroup: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    minHeight        : 50
  },

  picker: {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center',
    width        : undefined
  },

  label: {
    flex      : 0,
    width     : 110,
    color     : '#444',
    fontWeight: 'bold'
  },

  labelWarning: {
    color: Colors.danger
  },

  touchable: {
    flex          : 1,
    height        : 40,
    justifyContent: 'center',
    alignItems    : 'flex-start'
  },

  touchableText: {
    flex       : 1,
    color      : '#444',
    width      : undefined,
    marginTop  : 10,
    textAlign  : 'left',
    paddingLeft: 15
  },

  textField: {
    height           : 40,
    paddingHorizontal: 5,
    color            : '#444',
    fontSize         : 14,
    flex             : 1,
    width            : undefined
  },

  subHeadText: {
    fontSize: 22,
    flex    : 1
  },

  button: {
    ...(new Elevation(1)),
    flex             : 1,
    borderRadius     : 2,
    backgroundColor  : Colors.primary,
    paddingHorizontal: 10,
    paddingVertical  : 15
  },

  flex1: {
    flex: 1
  },

  buttonAlt: {
    backgroundColor: '#fff',
    marginLeft     : 5
  },

  buttonBiominder: {
    backgroundColor: Colors.info
  },

  buttonLink: {
    width          : undefined,
    backgroundColor: 'transparent',
    paddingLeft    : 0,
    height         : 40,
    justifyContent : 'center',
    flex           : 1,
    alignItems     : 'center',
    flexDirection  : 'row'
  },

  buttonText: {
    textAlign : 'center',
    color     : '#fff',
    fontWeight: 'bold'
  },

  buttonAltText: {
    textAlign : 'center',
    color     : '#666',
    fontWeight: 'bold'
  },

  buttonLinkText: {
    color            : '#666',
    flex             : 1,
    paddingHorizontal: 5
  },

  comment: {
    flex      : 1,
    width     : undefined,
    height    : 130,
    alignItems: 'flex-start'
  },

  icon: {
    flex    : 0,
    width   : 30,
    fontSize: 20,
    color   : '#aaa'
  },

  image: {
    width     : 50,
    height    : 50,
    resizeMode: 'cover'
  },

  footer: {
    flex             : 0,
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    paddingVertical  : 5,
    paddingHorizontal: 5,
    borderTopWidth   : 1,
    borderTopColor   : '#ddd',
    backgroundColor  : '#f5f5f5'
  },

  slider: {
    width: 200
  }
})

const dropdownIcon = (<Icon name="arrow-down-drop-circle-outline" style={styles.icon}/>)
