import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  Alert
} from 'react-native'
import moment from 'moment'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import realm from '../db/Schema'
import t from 'tcomb-validation'
import PickerModal from '../components/PickerModal'
import DCP from '../resources/config.js'
import SliderPick from '../components/SliderPick'
import Location from '../components/Location'

DCPrules = {
  seedsBinary        : t.enums.of(DCP.seedsBinary.selectChoices, 'seed'),
  flowersBinary      : t.enums.of(DCP.flowersBinary.selectChoices, 'flowers'),
  woolyAdesPres      : t.Boolean,
  woolyAdesCoverage  : t.enums.of(DCP.woolyAdesCoverage.selectChoices, 'woolyAdesCoverage'),
  acorns             : t.enums.of(DCP.acorns.selectChoices, 'acorns'),
  heightFirstBranch  : t.enums.of(DCP.heightFirstBranch.selectChoices, 'heightFirstBranch'),
  oakHealthProblems  : t.maybe(t.String),
  diameterNumeric    : t.Number,
  chestnutBlightSigns: t.maybe(t.String),
  ashSpecies         : t.enums.of(DCP.ashSpecies.selectChoices, 'ashSpecies'),
  emeraldAshBorer    : t.maybe(t.String),
  crownHealth        : t.Number,
  otherLabel         : t.String
}

const Coordinate = t.refinement(t.Number, (n) => n != 0, 'Coordinate')
const LocationT  = t.dict(t.String, Coordinate)


export default class FormScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images      : [],
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

    this.events = []
    this.realm  = realm

    this.formProps = this.props.formProps // read in form items to display

    let formRules = {
      images  : t.list(t.String),
      title   : t.String,
      location: LocationT
    }

    this.formRulesMeta = this.compileValRules() // build form rules from passed props
    this.formT         = t.struct(formRules, 'formT') // build tcomb validation from rules
    this.formTMeta     = t.struct(this.formRulesMeta, 'formTMeta') // build tcomb validation from rules
  }

  componentWillMount() {
    if (this.props.edit) {
      //For every key, set the state
      for (key of Object.keys(this.props.entryInfo)) {
        if (key === 'meta_data') {
          this.setState({key: JSON.parse(this.props.entryInfo[key])})
          console.log("metadata", JSON.parse(this.props.entryInfo[key]))
          this.setState({"metadata": JSON.parse(this.props.entryInfo[key])})
        }
        else {
          console.log("Setting ", key, this.props.entryInfo[key])
          this.setState({key: this.props.entryInfo[key]})
        }
      }
    }
  }

  componentDidMount() {
    if (!this.props.edit) {
      this.setDefaultValues()
    }
    this.events.push(DeviceEventEmitter.addListener('cameraCapturedPhotos', this.handleImages))
  }

  /**
   *
   * @param images
   */
  handleImages = (images) => {
    this.setState({images})
  }

  /**
   * cancel
   * -------------------------------------------------
   * Method for Cancel button.  Change scene, alert user about losing data.
   * @returns {boolean}
   */
  cancel = () => {
    Alert.alert('Cancel Submission',
      'Data will be permanently lost if you cancel. Are you sure?', [
        {
          text   : 'Yes',
          onPress: () => {
            this.props.navigator.popToTop()
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
  /*
   * Submit button method.  Validate the primary and meta data with tcomb.  Write the observation to Realm, leave the scene.
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

    let primaryKey = this.realm.objects('Submission')
    if (primaryKey.length <= 0) {
      primaryKey = 1
    } else {
      primaryKey = primaryKey.sorted('id', true)[0].id + 1
    }

    let observation = {
      id       : primaryKey,
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

    this.props.navigator.push({
      label   : 'SubmittedScene',
      plant   : observation,
      gestures: {}
    })
  }

  submitEdit = () => {
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
      return
    }
    if (!this.validateMeta().isValid()) {
      this.notifyIncomplete(this.validateMeta())
      return
    }

  primaryKey = this.props.entryInfo.id

    let observation = {
      id       : primaryKey,
      name     : this.state.title.toString(),
      images   : JSON.stringify(this.state.images),
      location : this.props.entryInfo.location,
      date     : this.props.entryInfo.date,
      synced   : this.props.entryInfo.synced,
      meta_data: JSON.stringify(this.state.metadata),
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
   * execute tcomb validation method on the metadata, given the expected parameters formT
   * @returns {*}
   */

  validateMeta = () => {
    return t.validate(this.state.metadata, this.formTMeta)
  }

  /**
   *Handle errors generated by tcomb.  Update the warnings in the state for changing text formatting.
   * @param validationAttempt
   */
  notifyIncomplete = (validationAttempt) => {
    let errors    = validationAttempt.errors
    let errorList = []
    let warnings  = {}
    errors.map((error) => {
      console.log(error.path)
      warnings[error.path] = true
      if (typeof DCP[error.path] !== 'undefined') {
        errorList.push('Required field: ' + DCP[error.path].label)
      }
    })
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

    Object.keys(this.formProps).map((propItem, index) => {

      let itemRule = DCPrules[propItem]

      formBase[propItem] = itemRule

    })
    return formBase
  }

  /**
   *
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

    if (DCP[key].slider) {
      return (
        <View style={styles.formGroup} key={key}>
          <Text style={styles.label}>{DCP[key].label}</Text>
          <SliderPick
            key={key}
            images={DCP[key].images}
            start={ this.state.metadata[key] ? this.state.metadata[key] : DCP[key].startValue}
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
      <View style={styles.formGroup} key={key}>
        <PickerModal
          style={styles.picker}
          images={DCP[key].images}
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
   *Returns the form item describing photos added.
   * @returns {XML}
   */

  renderPhotosField = () => {
    let length = this.state.images.length
    let text   = length > 1 ? 'photos' : 'photo'
    let image  = this.state.images[length - 1]

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
        <Text style={[styles.buttonLinkText, {color: '#444'}]}>{length} {text} added</Text>
        <Image source={{uri: image}} style={styles.thumbnail}/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={this.props.edit ? "Editing entry" : this.state.title} navigator={this.props.navigator} onBackPress={this.cancel}/>
        <KeyboardAwareScrollView
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          enableResetScrollToCoords={false}
        >
          <Animated.View style={[styles.card, {marginBottom: this.state.bottomMargin}]}>

            <View style={[styles.formGroup]}>
              <MKButton
                style={[styles.buttonLink, {height: this.state.images.length > 0 ? 60 : 40}]}
                onPress={this._goToCamera}
              >
                <Text style={this.state.warnings.photos ? [styles.label, styles.labelWarning] : styles.label}>Photos</Text>
                {this.state.images.length === 0 ?
                  <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={[styles.buttonLinkText, {color: '#aaa'}]}>Add photos</Text>
                    <Icon name="camera" style={[styles.icon]}/>
                  </View>
                  :
                  this.renderPhotosField()
                }
              </MKButton>
            </View>

            {this.renderForm()}

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

            <View style={[styles.formGroup]}>
              <Text style={styles.label}>Location</Text>
              <Location onChange={(location) => this.setState({location})}/>
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          <MKButton style={[styles.button, styles.flex1]} onPress={this.props.edit ? this.submitEdit: this.submit} rippleColor="rgba(0,0,0,0.5)">
            <Text style={styles.buttonText}>
              {this.props.edit ? "Confirm Edit" : "Submit Entry"}
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
  _goToCamera = () => {
    this.props.navigator.push({
      label   : 'CameraScene',
      images  : this.state.images,
      gestures: {}
    })
  }
}

FormScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
  formProps: PropTypes.object,
  edit     : PropTypes.bool,
  entryInfo: PropTypes.object
}

const elevationStyle = new Elevation(2)

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
    height           : undefined
  },

  picker: {
    flex         : 0,
    flexDirection: 'row',
    alignItems   : 'center',
    width        : undefined
  },

  label       : {
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
  },
})

const dropdownIcon = (<Icon name="arrow-down-drop-circle-outline" style={styles.icon}/>)
