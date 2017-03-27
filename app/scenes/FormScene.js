import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  AsyncStorage,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import moment from 'moment'
import {getTheme, MKButton} from 'react-native-material-kit'
import Realm from 'realm'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {CoordinateSchema, SubmissionSchema, UserSchema} from '../db/Schema'
import t from 'tcomb-validation'
import PickerModal from '../components/PickerModal'
import DCP from '../resources/config.js'
import Axios from 'axios'

const theme = getTheme()

const DeadTreesIndex  = t.enums.of(DCP.deadTrees.selectChoices, "dead")
const TreeHeightIndex = t.enums.of(DCP.treeHeight.selectChoices, "height")
const TreeStandIndex  = t.enums.of(DCP.treeStand.selectChoices, "stand")
const Coordinate =  t.refinement(t.Number, (n) => n != 0, 'Coordinate')
const ImageString =  t.refinement(t.String, (string) => string != '', 'ImageString')

const Location        = t.dict(t.String, Coordinate)

const userID = "test@etttt.com"//Important:  The logged in User should be stored by the app somewhere.

export default class FormScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeHeight   : '',
      species      : '',
      numberOfTrees: '',
      deadTrees    : '',
      comment      : '',
      image        : '',
      title        : this.props.title,
      location     : {
        latitude : 0,
        longitude: 0,
        accuracy : -1
      }
    }
     this.realm = new Realm({
      schema: [CoordinateSchema, SubmissionSchema, UserSchema]
    })

    this.formProps = this.props.formProps

    //set rules for base field values
    let formRules = {
      comment : t.String,
      image   : ImageString,
      title   : t.String,
      location: Location
    }

    //Add in rules for optional field values
    if (this.formProps.deadTree) {
      formRules.deadTrees = t.maybe(DeadTreesIndex)//optional
    }
    if (this.formProps.treeHeight) {
      formRules.treeHeight = TreeHeightIndex//required
    }
    if (this.formProps.numberOfTrees) {
      formRules.numberOfTrees = TreeStandIndex
    }
    this.formT = t.struct(formRules, "formT")

    this.fetchData()
  }

  componentDidMount() {
    this.event = DeviceEventEmitter.addListener('FormStateChanged', this.fetchData)
  }

  fetchData = () => {
    try {
      let formData = AsyncStorage.getItem('@WildType:formData').then((formData) => {
        if (formData !== null) {
          this.setState(JSON.parse(formData))
        }
      })
    } catch (error) {
      throw new Error('Couldn\'t fetch form data')
    }
  }

  cancel = () => {
    AsyncStorage.removeItem('@WildType:formData')
    this.props.navigator.popToTop()
  }

  submit = () => {
    if (!this.validateState().isValid()) {
      this.notifyIncomplete(this.validateState())
      return
    }

    AsyncStorage.setItem('@WildType:savedForm', JSON.stringify(this.state))
    AsyncStorage.removeItem('@WildType:formData')

    let primaryKey = this.realm.objects('Submission')
    if (primaryKey.length <= 0) {
      primaryKey = 1;
    } else {
      primaryKey = primaryKey.sorted('id', true)[0].id + 1
    }

    let observation = {
      id           : primaryKey,
      name         : this.state.title.toString(),
      species      : this.state.species.toString(),
      numberOfTrees: this.state.numberOfTrees.toString(),
      treeHeight   : this.state.treeHeight.toString(),
      deadTrees    : this.state.deadTrees.toString(),
      image        : this.state.image.toString(),
      location     : this.state.location,
      comment      : this.state.comment.toString(),
      date         : moment().format('MM-DD-Y H:m:s').toString()
    }

    this.realm.write(() => {

      this.realm.create('Submission', observation)
    })

    let obsSubmit = {
      observation_category: this.props.title,
      meta_data: JSON.stringify(observation),
      longitude: observation.location.longitude,
      latitude: observation.location.latitude,
      location_accuracy: observation.location.accuracy,
       date: observation.date,
      is_private: false
    }
    //Now submit to server
    obsSubmit.api_token = this.retrieveAPI()
    this.submitObsToServer(obsSubmit)


     this.props.navigator.push({
       label   : 'SubmittedScene',
       plant   : this.state,
       gestures: {}
     })
  }

  validateState = () => {
    return t.validate(this.state, this.formT)
  }

  notifyIncomplete = (validationAttempt) => {
    let missingFields = {}
    let message       = "Please supply a value for the following required fields: \n"

    for (let errorIndex in validationAttempt.errors) {
      let errorPath            = validationAttempt.errors[errorIndex].path[0]
      missingFields[errorPath] = true
      message                  = message + errorPath + " \n"
    }

    Alert.alert(message)
  }


  submitObsToServer = (request) => {

    //Run AXIOS POST request
    let axios = Axios.create({
      baseURL: 'http://treesource.app/api/v1/',
      timeout: 10000
    })
    axios.post('observations', request)
      .then(response => {
        console.log('RES', response.data);
      })
      .catch(error => {
        console.log('ERR', error);
         alert(error[0]);
      });

  }

  retrieveAPI = () => {
   return this.realm.objects('User').filtered(`email = "${userID}"`)[0].api_token
  }


  componentWillUnmount() {
    this.event.remove()
    AsyncStorage.removeItem('@WildType:formData')
    this.realm.close()
  }

    populateFormItem = (key) => {

      if(typeof DCP[key] === undefined) return
        return(
        <View style={styles.formGroup} key={key}>
          <Text style={styles.label}>{DCP[key].label}</Text>
          <PickerModal
            style={styles.picker}
            header={DCP[key].description}
            choices={DCP[key].selectChoices}
            onSelect={(option)=>{this.setState({[key]:option})}}>
            <TextInput
              style={styles.textField}
              editable={false}
              placeholder={DCP[key].placeHolder}
              placeholderTextColor="#aaa"
              value={this.state[key]}
              underlineColorAndroid="transparent"
            />
          </PickerModal>
          {dropdownIcon}
        </View>
        )
  }




  render() {
    return (
      <View style={styles.container}>
        <Header title={this.state.title} navigator={this.props.navigator}/>
        <ScrollView>
          <View style={styles.card}>

            <View style={[styles.formGroup]}>
              <Text style={styles.label}>Photo</Text>
              <MKButton
                style={[styles.buttonLink, {height: this.state.image !== '' ? 60 : 40, justifyContent: 'center'}]}
                onPress={() => this.props.navigator.push({label: 'CameraScene'})}
              >
                {this.state.image === '' ?
                  <Text style={[styles.buttonLinkText, {color: '#aaa'}]}>
                    Add Photo
                  </Text>
                  :
                  <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={[styles.buttonLinkText, {flex: 1, color: '#aaa'}]}>Change Photo</Text>
                    <Image source={{url: this.state.image}} style={{flex: 0, height: 60, width: 60}}/>
                  </View>
                }
              </MKButton>
              {this.state.image === '' && <Icon name="camera" style={styles.icon}/>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <MKButton style={styles.buttonLink} onPress={() => this.props.navigator.push({
                label: 'CaptureLocationScene'
              })}>
                <Text style={[styles.buttonLinkText, {color: this.state.location.latitude === 0 ? '#aaa' : '#444'}]}>
                  {this.state.location.latitude === 0 ? 'Enter location' : `${this.state.location.latitude},${this.state.location.longitude}`}
                </Text>
              </MKButton>
              <Icon name="map" style={styles.icon}/>
            </View>

            {Object.keys(this.props.formProps).map(this.populateFormItem)}

            <View style={[styles.formGroup, {borderBottomWidth: 0, flex: 1, alignItems: 'flex-start'}]}>
              <Text style={[styles.label, {paddingTop: 5}]}>Comments</Text>
              <TextInput
                style={[styles.textField, styles.comment]}
                placeholder="Additional Comments"
                placeholderTextColor="#aaa"
                value={this.state.comment}
                onChangeText={(comment) => this.setState({comment: comment})}
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, {borderBottomWidth: 0}]}>
          <MKButton style={[styles.button, styles.flex0]} onPress={this.submit} rippleColor="rgba(0,0,0,0.5)">
            <Text style={styles.buttonText}>
              Submit Entry
            </Text>
          </MKButton>

          <MKButton style={[styles.button, styles.buttonAlt, styles.flex0]} onPress={this.cancel}>
            <Text style={styles.buttonAltText}>
              Cancel
            </Text>
          </MKButton>
        </View>
      </View>
    )
  }
}

FormScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
  formProps: PropTypes.object
}

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  card: {
    ...theme.cardStyle,
    ...elevationStyle,
    flex         : 0,
    flexDirection: 'column',
    marginBottom : 10,
    borderRadius : 0
  },

  formGroup: {
    flex             : 0,
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    padding          : 5,
    height           : undefined,
  },

  picker: {
    flex : 1,
    width: undefined
  },

  label: {
    width     : 110,
    color     : '#444',
    fontWeight: 'bold'
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
    paddingHorizontal: 15,
    color            : '#444',
    fontSize         : 14
  },

  subHeadText: {
    fontSize: 22,
    flex    : 1
  },

  button: {
    ...(new Elevation(1)),
    flex           : 1,
    borderRadius   : 2,
    backgroundColor: Colors.primary,
    padding        : 10
  },

  flex0: {
    flex: 1,
  },

  buttonAlt: {
    backgroundColor: '#fff',
    marginLeft     : 10
  },

  buttonLink: {
    flex             : 1,
    width            : undefined,
    backgroundColor  : 'transparent',
    paddingHorizontal: 15,
    height           : 40,
    justifyContent   : 'center'
  },

  buttonText: {
    textAlign: 'center',
    color    : '#fff',
  },

  buttonAltText: {
    textAlign: 'center',
    color    : '#666'
  },

  buttonLinkText: {
    color: "#666"
  },

  comment: {
    flex      : 1,
    width     : undefined,
    height    : 130,
    alignItems: 'flex-start'
  },

  icon: {
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
    paddingVertical  : 10,
    paddingHorizontal: 5
  },
})

const dropdownIcon = (<Icon name="arrow-down-drop-circle-outline" style={styles.icon}/>)
