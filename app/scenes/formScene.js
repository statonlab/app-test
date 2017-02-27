import React, {Component, PropTypes} from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    Image,
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
    MKRadioButton,
    mdl,
} from 'react-native-material-kit'

import ModalDropdown from 'react-native-modal-dropdown';


const theme  = getTheme();
const myIcon = (<Icon name="md-arrow-dropright-circle" size={22} color="#959595"/>);
let thisDate = new Date();
let thisDateDisplay = String(thisDate);
var PickerItem = Picker.Item;
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
    dropdown_2: {
        alignSelf: 'flex-end',
        width: 150,
        top: 32,
        right: 8,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: 'cornflowerblue',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 150,
        height: 300,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
    },
})

const Textfield = MKTextField.textfield()
    .withPlaceholder('Add additional comments here...')
    .withStyle(styles.textfield)
    .withTextInputStyle({flex: 1})
    .build();


const ColoredRaisedButton = MKButton.coloredButton()
    .withText('Submit Entry')
    .withBackgroundColor(MKColor.palette_red_500)
    .withOnPress(() => {
        console.log("Submit the tree form");
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


const treeDensities = ['0-10/100 sq feet', '11-50/100 sq feet', '>50/100 sq feet'];
const diseaseCoverage = ['0-25%', '26-50%', '51-75%', '76-100%'];
const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];


export default class FormScene extends Component {
    constructor(props) {
        super(props);
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
                            <ModalDropdown options={treeDensities}/>
                        </View>
                    </View>
                    <View
                        style={styles.card}
                    >

                        <View style={{flexGrow:1, height: 50, flexDirection:'row'}}>
                            <Text>
                                % Disease coverage </Text>
                            <ModalDropdown options={diseaseCoverage}/>
                        </View>
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                        <ModalDropdown style={styles.dropdown_2}
                                       textStyle={styles.dropdown_2_text}
                                       dropdownStyle={styles.dropdown_2_dropdown}
                                       options={treeDensities}
                                       renderRow={this._dropdown_2_renderRow.bind(this)}
                                       renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                        />



                    </View>
                    <Textfield/>
                    <Text></Text>
                    <ColoredRaisedButton/>
                    <Text>Selected image:
                    (Selected image and/or GPS coordinate below)</Text>
                </View>
            </View>
        );
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let icon = highlighted ? require('../../images/heart.png') : require('../../images/flower.png');
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
                    <Image style={styles.dropdown_2_image}
                           mode='stretch'
                           source={icon}
                    />
                    <Text style={[styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {`${rowData}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }


    _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == treeDensities.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
                      key={key}
        />);
    }



}

FormScene.propTypes = {
    title    : PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
}

const elevationStyle = new Elevation(2)

