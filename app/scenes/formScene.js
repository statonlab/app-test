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
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form'


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
    }
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


const options = [{




}]


const onButtonPress = () => {
    Alert.alert('Form has been submitted');
};

//https://github.com/xinthink/react-native-material-kit

export default class FormScene extends Component {
    constructor(props){
        super(props);
        this.state = { densities: ['1-10 trees/100ft2', '10-50 trees/100ft2', '50-100 trees/100ft2', '100-1000 trees/100ft2', '>1000 trees/100ft2'],
            selectedDensity: '1-10 trees/100ft2',
            diseaseRatings: ['0%', '50%', '100%'],
            selectedDiseaseRating: '0%',
            images: [],
            selectedImage: '',
        }
        this.radioGroup = new MKRadioButton.Group();
    }

    render() {
        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
                <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
                <View style={theme.cardStyle}>
                    <Text>{thisDateDisplay}</Text>
                        <TouchableHighlight
                        style={styles.card}
                        >
                            <View>
                            <Text style={styles.cardTitle}>
                                    Tree density: </Text>
                            {/*<Picker selectedValue={this.state.selectedDensity}*/}
                                    {/*onValueChange={ (densities) => (*/}
                                        {/*this.setState({selectedDensity:densities}) ) } >*/}
                                {/*{ this.state.densities.map((s, i) => {*/}
                                    {/*return <PickerItem*/}
                                        {/*key={i}*/}
                                        {/*value={s}*/}
                                        {/*label={s} />*/}
                                {/*}) }*/}
                            {/*</Picker>*/}
                            </View>
                        </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.card}
                    >
                        <View>
                            <Text style={styles.cardTitle}>
                                % Disease coverage </Text>
                        </View>
                    </TouchableHighlight>
                        <View style = {{flexDirection: 'row'}}>
                            <MKRadioButton
                                checked={true}
                                group={this.radioGroup}
                            />
                        </View>
                        <Textfield/>
                            <Text></Text>
                            <ColoredRaisedButton/>
                </View>
            </View>
        )
    }
}

FormScene.propTypes = {
    title    : PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
}

const elevationStyle = new Elevation(2)


