import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  TextInput,
  Navigator,
  Dimensions,
  StyleSheet,
  Picker,
  Button,
  Alert,
} from 'react-native'
import {getTheme, MKColor, MKButton} from 'react-native-material-kit'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'

import ModalPicker from 'react-native-modal-picker'

const theme = getTheme()

let index      = 0;
const treeSize = [
  {key: index++, label: '0-10 feet'},
  {key: index++, label: '11-50 feet'},
  {key: index++, label: '51-100 feet'},
  {key: index++, label: '>100 feet'},
];

index           = 0;
const treeStand = [
  {key: index++, label: '1-10'},
  {key: index++, label: '11-50'},
  {key: index++, label: '51+'}
]

index           = 0;
const deadTrees = [
  {key: index++, label: 'none'},
  {key: index++, label: '1-50'},
  {key: index++, label: '51+'}
]


export default class FormScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeHeightPicked: '',
      treeStandNumber : '',
      textAddComment  : '',
      nearbyDeadTrees : ''
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Header title={this.props.title} navigator={this.props.navigator}/>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tree Height</Text>
            <ModalPicker
              style={styles.picker}
              data={treeSize}
              onChange={(option)=>{ this.setState({treeHeightPicked:option.label})}}>
              <TextInput
                style={styles.textField}
                editable={false}
                placeholder="Tree Height"
                value={this.state.treeHeightPicked}
              />
            </ModalPicker>
            {dropdownIcon}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Trees in Stand</Text>
            <ModalPicker
              style={styles.picker}
              data={treeStand}
              onChange={(option)=>{ this.setState({treeStandNumber:option.label})}}>
              <TextInput
                style={styles.textField}
                editable={false}
                placeholder="Number of Trees"
                value={this.state.treeStandNumber}
                underlineColorAndroid="#fff"
              />
            </ModalPicker>
            {dropdownIcon}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Dead Trees</Text>
            <ModalPicker
              style={styles.picker}
              data={deadTrees}
              onChange={(option)=>{ this.setState({nearbyDeadTrees:option.label})}}>
              <TextInput
                style={styles.textField}
                editable={false}
                placeholder="Number of Trees"
                value={this.state.nearbyDeadTrees}
              />
            </ModalPicker>
            {dropdownIcon}
          </View>

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>Photo</Text>
            <MKButton style={styles.buttonLink} onPress={() => this.props.navigator.push({index: 2})}>
              <Text style={styles.buttonLinkText}>
                Choose photo
              </Text>
            </MKButton>
            <Icon name="camera" style={styles.dropdownIcon}/>
          </View>

          <View style={[styles.formGroup, {borderBottomWidth: 0}]}>
            <TextInput
              style={[styles.textField, styles.textAddComment]}
              placeholder="Add additional comments here"
              value={this.state.textAddComment}
              onChangeText={(textAddComment) => this.setState({textAddComment})}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={[styles.footer, {borderBottomWidth: 0}]}>
          <MKButton style={[styles.button, styles.flex0]} onPress={() => console.log("Submit the tree form")}>
            <Text style={styles.buttonText}>
              Submit Entry
            </Text>
          </MKButton>

          <MKButton style={[styles.button, styles.buttonAlt, styles.flex0]} onPress={() => console.log("Submit the tree form")}>
            <Text style={styles.buttonAltText}>
              Cancel
            </Text>
          </MKButton>
        </View>

      </View>
    );
  }

}

FormScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
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
    width: 110,
    color: '#444'
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

  textAddComment: {
    flex  : 1,
    width : undefined,
    height: 150
  },

  dropdownIcon: {
    width   : 20,
    fontSize: 20,
    color   : '#aaa'
  },

  footer: {
    flex          : 0,
    flexDirection : 'row',
    justifyContent: 'space-between',
    padding       : 10
  },
})

const dropdownIcon = (<Icon name="arrow-down-drop-circle-outline" style={styles.dropdownIcon}/>)
