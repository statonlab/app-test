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
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import Elevation from '../helpers/Elevation'
import {
  MKColor,
  MKButton,
} from 'react-native-material-kit'
import Colors from '../helpers/Colors'

import ModalPicker from 'react-native-modal-picker'

const theme = getTheme();

const cameraIcon = (<Icon name="md-camera" size={16} color="#fff"/>);
const myIcon     = (<Icon name="md-menu" size={16} color="#2A9D8F"/>);

let thisDate        = new Date();
let thisDateDisplay = String(thisDate);

const SelectPictureButton = MKButton.coloredButton()
  .withText('Add photo')
  .withBackgroundColor(MKColor.palette_green_500)
  .withOnPress(() => {
    console.log("Add photo");
  })
  .build();

const onButtonPress = () => {
  Alert.alert('Form has been submitted');
};


let index      = 0;
const treeSize = [
  {key: index++, label: '0-10 feet'},
  {key: index++, label: '11-50 feet'},
  {key: index++, label: '51-100 feet'},
  {key: index++, label: '>100 feet'},
];

index                 = 0;
const diseaseCoverage = [
  {key: index++, label: '0-25%'},
  {key: index++, label: '26-50%'},
  {key: index++, label: '51-75%'},
  {key: index++, label: '76-100%'}]

index           = 0;
const treeStand = [
  {key: index++, label: '1-10'},
  {key: index++, label: '11-50'},
  {key: index++, label: '51+'}]

index           = 0;
const deadTrees = [
  {key: index++, label: 'none'},
  {key: index++, label: '1-50'},
  {key: index++, label: '51+'}]


export default class FormScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeHeightPicked: '',
      treeStandNumber : '',
      textAddComment  : '',
      nearbyDeadTrees : 'none'
    }
  }

  render() {
    return (
      <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
        <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
        <View style={{marginHorizontal: 10, paddingVertical:15}}>
          <Text>{thisDateDisplay}</Text>
          <ModalPicker
            data={treeSize}
            onChange={(option)=>{ this.setState({treeHeightPicked:option.label})}}>
            <View style={styles.cardBody}>
              <Text>Tree height: </Text>
              <TextInput
                style={{borderWidth:1, borderColor:'#ccc', height:25, width: 200}}
                editable={false}
                placeholder="please select"
                value={this.state.treeHeightPicked}
              />
              {myIcon}
            </View>
          </ModalPicker>
          <ModalPicker
            data={treeStand}
            onChange={(option)=>{ this.setState({treeStandNumber:option.label})}}>
            <View style={styles.cardBody}>
              <Text> Number of Trees </Text>
              <TextInput
                style={{borderWidth:1, borderColor:'#ccc', height:25, width: 200}}
                editable={false}
                placeholder="please select"
                value={this.state.treeStandNumber}
              />
              {myIcon}
            </View>
          </ModalPicker>
          <ModalPicker
            data={deadTrees}
            onChange={(option)=>{ this.setState({nearbyDeadTrees:option.label})}}>
            <View style={styles.cardBody}>
              <Text> Number of Trees </Text>
              <TextInput
                style={{borderWidth:1, borderColor:'#ccc', height:25, width: 200}}
                editable={false}
                placeholder="none"
                value={this.state.nearbyDeadTrees}
              />
              {myIcon}
            </View>
          </ModalPicker>
          <MKButton style={styles.button} onPress={() => this.props.navigator.push({index: 2})}>
            <Text style={styles.buttonText}>
              {cameraIcon} Choose photo
            </Text>

          </MKButton>
          <TextInput
            style={styles.textAddComment}
            placeholder="Add additional comments here"
            value={this.state.textAddComment}
            onChangeText={(textAddComment) => this.setState({textAddComment})}
          />
          <MKButton style={styles.button} onPress={() => console.log("Submit the tree form")}>
            <Text style={styles.buttonText}>
              Submit Entry
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

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  card          : {
    ...theme.cardStyle,
    ...elevationStyle,
    marginBottom: 10,
    borderRadius: 3
  },
  container     : {
    height: 200,
    width : undefined,
    flex  : 1
  },
  cardBody      : {
    flexDirection : 'row',
    flexGrow      : 1,
    padding       : 10,
    alignItems    : 'center',
    justifyContent: 'space-between'
  },
  textfield     : {
    height   : 28,  // have to do it on iOS
    marginTop: 32,
  },
  subHeadText   : {
    fontSize: 22,
    flex    : 1
  },
  button        : {
    flexDirection  : 'column',
    borderRadius   : 2,
    shadowRadius   : 1,
    shadowOffset   : {width: 0, height: 0.5},
    shadowOpacity  : 0.24,
    shadowColor    : 'black',
    elevation      : 4,
    backgroundColor: Colors.primary,
    padding        : 5,
    marginVertical : 10,
    marginLeft     : 50,
    maxWidth       : 300
  },
  buttonText    : {
    fontWeight: 'bold',
    textAlign : 'center',
    color     : '#fff',
  },
  textAddComment: {
    borderWidth: 1,
    borderColor: '#ccc',
    height     : 150,
    width      : 300,
    marginLeft : 25
  }
})

