import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  Navigator,
  Dimensions,
  StyleSheet
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import Elevation from '../helpers/Elevation'

const theme  = getTheme()
const myIcon = (<Icon name="md-arrow-dropright-circle" size={22} color="#959595"/>)
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

export default class LandingScene extends Component {

  render() {
    return (
      <View style={{backgroundColor: '#f5f5f5', flex: 1, flexDirection: 'column'}}>
        <Header title={this.props.title} navigator={this.props.navigator} initial={true}/>
        <ScrollView style={{flex: 0}}>
          <View style={{marginHorizontal: 5, flex: 1, flexDirection: 'column', paddingVertical: 10}}>
            {plants.map((plant, index) => {
              return (
                <TouchableHighlight
                  style={styles.card}
                  key={index}
                  onPress={() => {
                    this.props.navigator.push({index: 2, title: plant.title})
                  }}>
                  <View>
                    <Image source={plant.image} style={styles.cardImage}/>
                    <View style={styles.cardBody}>
                      {myIcon}
                      <Text style={styles.cardTitle}>
                        {plant.title}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

LandingScene.propTypes = {
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
