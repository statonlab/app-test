import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import {getTheme, MKColor, MKButton} from 'react-native-material-kit'
import Realm from 'realm'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {CoordinateSchema, SubmissionSchema} from '../db/Schema'
import t from 'tcomb-validation'
import ModalPicker from 'react-native-modal-picker'

const theme = getTheme()

let index        = 1
const treeHeight = {
  selectChoices: [
    {key: index++, label: '0-10 feet'},
    {key: index++, label: '11-50 feet'},
    {key: index++, label: '51-100 feet'},
    {key: index++, label: '>100 feet'}
  ]
}

index           = 1
const treeStand = {
  selectChoices: [
    {key: index++, label: '1-10'},
    {key: index++, label: '11-50'},
    {key: index++, label: '51+'}
  ]
}

index           = 1
const deadTrees = {
  selectChoices: [
    {key: index++, label: 'none'},
    {key: index++, label: '1-50'},
    {key: index++, label: '51+'}
  ]
}

const TreeHeightIndex = t.enums.of(['0-10 feet', '11-50 feet', '51-100 feet', '>100 feet'], "height")
const TreeStandIndex  = t.enums.of(["1-10", "11-50", "51+"], "stand")
const DeadTreesIndex  = t.enums.of(['', 'none', '1-50', '51+'], "dead")
const Location        = t.dict(t.String, t.Num)


export default class FormScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeHeight   : '',
      numberOfTrees: '',
      deadTrees    : '',
      comment      : '',
      image        : '',
      title        : this.props.title,
      location     : {
        latitude : 0,
        longitude: 0
      }
    }

    this.formProps = this.props.formProps

    //set rules for base field values
    let formRules = {
      comment : t.String,
      image   : t.String,
      title   : t.String,
      location: Location
    }

    //Add in rules for optional field values
    if (this.formProps.deadTreeDisplay) {
      formRules.deadTrees = t.maybe(DeadTreesIndex)//optional
    }
    if (this.formProps.treeHeightDisplay) {
      formRules.treeHeight = TreeHeightIndex//required
    }
    if (this.formProps.numberOfTreesDisplay) {
      formRules.numberOfTrees = TreeStandIndex
    }
    this.formT = t.struct(formRules, "formT")

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

  componentDidMount() {
    let _that = this

    DeviceEventEmitter.addListener('LocationCaptured', () => {
      try {
        let formData = AsyncStorage.getItem('@WildType:formData').then((formData) => {
          if (formData !== null) {
            _that.setState(JSON.parse(formData))
          }
        })
      } catch (error) {
        throw new Error('Couldn\'t fetch form data')
      }
    })
  }

  async saveData(data) {
    this.setState(data)
  }

  async fetchData() {
    return await AsyncStorage.getItem('@WildType:formData')
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

    let realm = new Realm({schema: [CoordinateSchema, SubmissionSchema]})
    realm.write(() => {
      let primaryKey = realm.objects('Submission').sorted('id', true)[0] + 1
      if (typeof primaryKey != 'number') {
        primaryKey = 1;
      }
      realm.create('Submission', {
        id           : primaryKey,
        name         : this.state.title,
        species      : this.state.species,
        numberOfTrees: this.state.numberOfTrees,
        treeHeight   : this.state.treeHeight,
        deadTrees    : this.state.deadTrees,
        image        : this.state.image,
        location     : this.state.location,
        comment      : this.state.comment
      })
    })

    this.props.navigator.push({label: 'SubmittedScene'})
  }

  validateState = () => {
    return t.validate(this.state, this.formT)
  }

  notifyIncomplete = (validationAttempt) => {
    let missingFields = {}
    let message       = "Please supply a value for the following required fields: \n"
    console.log(validationAttempt)
    for (let errorIndex in validationAttempt.errors) {
      let errorPath            = validationAttempt.errors[errorIndex].path[0]
      missingFields[errorPath] = true
      message                  = message + errorPath + " \n"
    }
    Alert.alert(message)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={this.state.title} navigator={this.props.navigator}/>
        <ScrollView>
          <View style={styles.card}>
            {!this.formProps.treeHeightDisplay ? null :
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tree Height</Text>
                <ModalPicker
                  style={styles.picker}
                  data={treeHeight.selectChoices}
                  onChange={(option)=>{this.saveData({treeHeight:option.label})}}>
                  <TextInput
                    style={styles.textField}
                    editable={false}
                    placeholder="Tree Height"
                    value={this.state.treeHeight}
                  />
                </ModalPicker>
                {dropdownIcon}
              </View>
            }
            {!this.formProps.numberOfTreesDisplay ? null :
              <View style={styles.formGroup}>
                <Text style={styles.label}>Trees in Stand</Text>
                <ModalPicker
                  style={styles.picker}
                  data={treeStand.selectChoices}
                  onChange={(option)=>{this.saveData({numberOfTrees:option.label})}}>
                  <TextInput
                    style={styles.textField}
                    editable={false}
                    placeholder="Number of Trees in Stand"
                    value={this.state.numberOfTrees}
                    underlineColorAndroid="#fff"
                  />
                </ModalPicker>
                {dropdownIcon}
              </View>
            }
            {!this.formProps.deadTreeDisplay ? null :
              <View style={styles.formGroup}>
                <Text style={styles.label}>Dead Trees</Text>
                <ModalPicker
                  style={styles.picker}
                  data={deadTrees.selectChoices}
                  onChange={(option)=>{this.saveData({deadTrees:option.label})}}>
                  <TextInput
                    style={styles.textField}
                    editable={false}
                    placeholder="Number of Dead Trees"
                    value={this.state.deadTrees}
                  />
                </ModalPicker>
                {dropdownIcon}
              </View>
            }
            <View style={[styles.formGroup]}>
              <Text style={styles.label}>Photo</Text>
              <MKButton style={styles.buttonLink} onPress={() => this.saveData({})
              .then(this.props.navigator.push({
                label: 'CameraScene',
                plantTitle: this.props.title,
                transition: 'VerticalUpSwipeJump',
                formProps: this.props.formProps}))
              }>
                <Text style={styles.buttonLinkText}>
                  {this.state.image === '' ? 'Add Photo' : this.state.image.substr(-20)}
                </Text>
              </MKButton>
              <Icon name="camera" style={styles.dropdownIcon}/>
            </View>

            <View style={[styles.formGroup]}>
              <TextInput
                style={[styles.textField, styles.comment]}
                placeholder="Add additional comments here"
                value={this.state.comment}
                onChangeText={(comment) => this.saveData({comment: comment})}
                multiline={true}
                numberOfLines={4}
              />
            </View>

            <View style={[styles.formGroup, {borderBottomWidth: 0}]}>
              <Text style={styles.label}>Location</Text>
              <Text style={[{flex: 1, width: undefined, color: '#444'}]}>
                {this.state.location.latitude === '' ? 'Will get set after adding a photo' : `${this.state.location.latitude},${this.state.location.longitude}`}
              </Text>
              <Icon name="map" style={styles.dropdownIcon}/>
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

const elevationStyle = new Elevation(1)

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
    position         : 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding          : 10,
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

  textField: {
    height           : 40,
    paddingHorizontal: 15,
    color            : "#444",
    fontSize         : 14
  },

  subHeadText: {
    fontSize: 22,
    flex    : 1
  },

  button: {
    ...elevationStyle,
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
    backgroundColor  : "transparent",
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
    flex  : 1,
    width : undefined,
    height: 150
  },

  dropdownIcon: {
    width   : 20,
    fontSize: 20,
    color   : '#aaa'
  },

  image: {
    width     : 50,
    height    : 50,
    resizeMode: 'cover'
  },

  footer: {
    flex          : 0,
    flexDirection : 'row',
    justifyContent: 'space-between',
    padding       : 10
  },
})

const dropdownIcon = (<Icon name="arrow-down-drop-circle-outline" style={styles.dropdownIcon}/>)