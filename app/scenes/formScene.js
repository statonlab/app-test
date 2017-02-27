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
import realmInterface from '../db/realmDB'

const theme  = getTheme();
const myIcon = (<Icon name="md-arrow-dropright-circle" size={22} color="#959595"/>);
let thisDate = new Date();
let thisDateDisplay = String(thisDate);
var PickerItem = Picker.Item;



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
    Alert.alert('Button has been pressed!');
};

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
    }

    render() {
        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
                <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
                <View>
                    <Text>Today's date: {thisDateDisplay}</Text>
                        <Text>Tree density: </Text>
                        <Picker selectedValue={this.state.selectedDensity}
                                onValueChange={ (densities) => (
                                    this.setState({selectedDensity:densities}) ) } >
                            { this.state.densities.map((s, i) => {
                                return <PickerItem
                                    key={i}
                                    value={s}
                                    label={s} />
                            }) }
                        </Picker>
                        <Picker selectedValue={this.state.selectedDiseaseRating}
                                onValueChange={ (diseaseRatings) => (
                                    this.setState({selectedDiseaseRating:diseaseRatings}) ) } >
                            { this.state.diseaseRatings.map((s, i) => {
                                return <PickerItem
                                    key={i}
                                    value={s}
                                    label={s} />
                            }) }
                        </Picker>
                        <Button
                            onPress={onButtonPress}
                            title= "Submit"
                        />
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

const styles = StyleSheet.create({
    container: {
        height: 200,
        width : undefined,
    },
    card     : {
        ...theme.cardStyle,
        ...elevationStyle,
        marginBottom: 10,
        borderRadius: 3
    },
    cardImage: {
        ...theme.cardImageStyle,
        height              : 150,
        resizeMode          : 'cover',
        width               : undefined,
        borderTopRightRadius: 3,
        borderTopLeftRadius : 3,
        backgroundColor     : '#fff',
    },
    cardTitle: {
        ...theme.cardTitleStyle,
        fontSize: 14,
        flex    : 50,
        padding : 0,
        position: undefined,
        top     : 0,
        left    : 0
    },
    cardBody : {
        flexDirection : 'row',
        flex          : 1,
        padding       : 0,
        alignItems    : 'center',
        justifyContent: 'center'
    }
})
