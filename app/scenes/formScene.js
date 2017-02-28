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
const myIcon = (<Icon name="md-arrow-dropright-circle" size={22} color="#959595"/>);
let thisDate = new Date();
let thisDateDisplay = String(thisDate);


const ColoredRaisedButton = MKButton.coloredButton()
    .withText('Submit Entry')
    .withBackgroundColor(MKColor.palette_red_500)
    .withOnPress(() => {
        console.log("Submit the tree form");
    })
    .build();

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
            textInputValue: ''
        }
    }

    render() {

        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
                <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
                <View>
                    <Text>{thisDateDisplay}</Text>
                    <View
                        style={styles.card}
                    >
                        <View style={{flexGrow:1, padding: 0, height: 50, flexDirection:'row'}}>
                            <Text>
                                Tree density: </Text>
                            <ModalPicker
                                data={treeDensities}
                                initValue="Select density of this tree species for this entry."
                                onChange={(option)=>{ alert(`${option.label} (${option.key}) Updated tree density`) }} />
                        </View>
                    </View>
                    <View
                        style={styles.card}
                    >

                        <View style={{flexGrow:1, height: 50, flexDirection:'row'}}>
                            <Text>
                                % Disease coverage </Text>
                            <ModalPicker
                                data={diseaseCoverage}
                                initValue="Select disease coverage for this tree."
                                onChange={(option)=>{ this.setState({textInputValue:option.label})}}>

                            <TextInput
                                style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30, width: 200}}
                                editable={false}
                                placeholder="%"
                                value={this.state.textInputValue} />

                            </ModalPicker>
                        </View>
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                    </View>
                    <SelectPictureButton/>
                    <Textfield/>
                    <Text></Text>
                    <ColoredRaisedButton/>
                    <Text>Selected image:
                    (Selected image and/or GPS coordinate below)</Text>
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
        flex          : 1,
        padding       : 10,
        alignItems    : 'center',
        justifyContent: 'center'
    },
    textfield : {
        height: 28,  // have to do it on iOS
        marginTop: 32
    },
    subHeadText : {
        fontSize : 22,
        flex : 1
    },

})


const Textfield = MKTextField.textfield()
    .withPlaceholder('Add additional comments here...')
    .withStyle(styles.textfield)
    .withTextInputStyle({flex: 1})
    .build();
