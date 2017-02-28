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
    MKTextField,
    MKColor,
    MKButton,
} from 'react-native-material-kit'

import ModalPicker from 'react-native-modal-picker'

const theme  = getTheme();
const myIcon = (<Icon name="md-menu" size={22} color="#959595"/>);
const cameraIcon = (<Icon name="md-camera" size={22} color="#959595"/>);
    let thisDate = new Date();
    let thisDateDisplay = String(thisDate);

const SelectPictureButton = MKButton.coloredButton()
    .withText('Add photo')
    .withBackgroundColor(MKColor.palette_green_500)
    .withOnPress(() => {
        console.log("Add photo");
    })
    .build();


const plants = [{
    title: 'Dogwood',
    image: require('../img/dogwood.jpg'),
},
    {
    title: 'Overview',
    image: require('../img/dogwood.jpg'),
    } ,
    {
        title: 'Hydrangea',
        image: require('../img/hydrangea.jpg'),
    },
    {
        title: 'Green Ash',
        image: require('../img/ash.jpg'),
    },
    {
        title: 'Dogwood',
        image: require('../img/dogwood.jpg'),
    }]


const onButtonPress = () => {
    Alert.alert('Form has been submitted');
};



let index = 0;
const treeDensities = [
    { key: index++, label: '0-10/100 sq feet' },
    { key: index++, label: '11-50/100 sq feet' },
    { key: index++, label: '51-100/100 sq feet' },
    { key: index++, label: '>100/100 sq feet' },
];

//const treeDensities = ['0-10/100 sq feet', '11-50/100 sq feet', '>50/100 sq feet'];
index = 0;
const diseaseCoverage = [
    { key: index++, label: '0-25%'},
    { key: index++, label:'26-50%'},
    { key: index++, label: '51-75%' },
        { key: index++, label: '76-100%'}]


        export default class FormScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: '',
            textDensityPicked: '',
            textAddComment: ''

        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
                <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
                <View style={{marginHorizontal: 10, paddingVertical:15}}>
                    <Text>{thisDateDisplay}</Text>
                        <ModalPicker
                            data={treeDensities}
                            onChange={(option)=>{ this.setState({textDensityPicked:option.label})}}>
                            <View style={styles.cardBody}>
                            <Text>Tree density: </Text>
                        <TextInput
                                style={{borderWidth:1, borderColor:'#ccc', height:25, width: 200}}
                                editable={false}
                                placeholder="please select"
                                value={this.state.textDensityPicked}
                            />
                                {myIcon}
                            </View>
                        </ModalPicker>
                            <ModalPicker
                                data={diseaseCoverage}
                                onChange={(option)=>{ this.setState({textInputValue:option.label})}}>
                                <View style={styles.cardBody}>
                                        <Text> % Disease:</Text>
                                    <TextInput
                                        style={{borderWidth:1, borderColor:'#ccc', height:25, width: 200}}
                                        editable={false}
                                        placeholder="please select"
                                        value={this.state.textInputValue}
                                    />
                                    {myIcon}
                                </View>
                            </ModalPicker>
                    <MKButton style={styles.button} onPress={() => console.log("Submit the tree form")}>
                        <Text style={styles.buttonText}>
                            Choose photo
                        </Text>
                        {cameraIcon}
                    </MKButton>
                    <TextInput
                        style={styles.textAddComment}
                        placeholder="Add additional comments here"
                        value={this.state.textAddComment}
                        onChangeText={(textAddComment) => this.setState({textAddComment})}
                    />
                    <MKButton style={styles.button}  onPress={() => console.log("Submit the tree form")}>
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
    card     : {
        ...theme.cardStyle,
        ...elevationStyle,
        marginBottom: 10,
        borderRadius: 3
    },
    container: {
        height: 200,
        width : undefined,
        flex: 1
    },
    cardBody : {
        flexDirection : 'row',
        flexGrow          : 1,
        padding       : 10,
        alignItems    : 'center',
        justifyContent: 'space-between'
    },
    textfield : {
        height: 28,  // have to do it on iOS
        marginTop: 32,
    },
    subHeadText : {
        fontSize : 22,
        flex : 1
    },
    button : {
        flexDirection: 'column',
        borderRadius: 2,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.7,
        shadowColor: 'black',
        elevation: 4
    },
    buttonText : {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
textAddComment: {borderWidth:1,
        borderColor:'#ccc',
        height:150,
        width: 300}

})

