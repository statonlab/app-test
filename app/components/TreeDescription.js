import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import Plants from '../resources/descriptions'
import ImageModal from '../components/ImageModal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const theme = getTheme()

export default class TreeDescription extends Component {

  constructor(props) {
    super(props)
  }

  _renderImageModalIcons() {
    if (Plants[this.props.title].images.length === 0 && Plants[this.props.title].maps.length === 0) {
      return (
        <View style={{marginBottom: 5}}/>
      )
    }

    return (
      <View style={[styles.card, styles.iconsContainer]}>
        {Plants[this.props.title].images.length > 0 ?
          <ImageModal images={Plants[this.props.title].images} captions={Plants[this.props.title].captions} style={styles.buttonAlt} containerStyle={{flex: 1, paddingHorizontal: 5}}>
            <Icon name="camera-burst" size={23} style={styles.icon}/>
          </ImageModal>
          : null }
        {Plants[this.props.title].maps.length > 0 ?
          <ImageModal images={Plants[this.props.title].maps} style={styles.buttonAlt} containerStyle={{flex: 1, paddingHorizontal: 5}}>
            <Icon name="map" size={23} style={styles.icon}/>
          </ImageModal>
          : null }
      </View>
    )
  }

  render() {
    const len = Plants[this.props.title].descriptionCards.length - 1

    return (
      <ScrollView style={[styles.scrollView]}>
        {/*this._renderImageModalIcons()*/}
        <View style={styles.card}>
          <View style={[styles.cardBody, {paddingTop: 10}]}>
            <ImageModal
              images={Plants[this.props.title].images}
              captions={Plants[this.props.title].captions}
              style={[styles.buttonAlt, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
              <Text style={styles.cardTitle}>ID Photos</Text>
              <Icon name="camera-burst" size={23} style={styles.icon}/>
            </ImageModal>
          </View>
          {Plants[this.props.title].descriptionCards.map((card, index) => {
            return (
              <View key={index} style={[styles.cardBody, {borderBottomWidth: len === index ? 0 : 1}]}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                {card.body.map((body, bodyIndex) => {
                  return (<View key={bodyIndex}>
                    {body}
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

TreeDescription.propTypes = {
  title: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  scrollView: {
    flex: 1
  },

  iconsContainer: {
    paddingVertical  : 5,
    paddingHorizontal: 5,
    alignItems       : 'center',
    justifyContent   : 'space-between',
    flexDirection    : 'row'
  },

  icon: {
    color: '#666'
  },

  buttonAlt: {
    borderRadius   : 2,
    height         : 40,
    flex           : 1,
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: '#fff'
  },

  card: {
    borderTopWidth   : 0,
    borderTopColor   : '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor  : '#fff',
    borderRadius     : 0,
    flex             : 1,
    paddingHorizontal: 10,
    justifyContent   : 'center',
    marginBottom     : 5
  },

  cardImage: {
    ...theme.cardImageStyle,
    height         : 200,
    resizeMode     : 'cover',
    width          : undefined,
    backgroundColor: '#fff'
  },

  cardTitle: {
    fontSize  : 14,
    flex      : 1,
    fontWeight: 'bold',
    color     : '#333'
  },

  cardBody: {
    paddingTop       : 15,
    paddingBottom    : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  cardText: {
    fontSize       : 14,
    paddingVertical: 8,
    paddingLeft    : 10,
    paddingRight   : 5,
    color          : '#333',
    lineHeight     : 21
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems    : 'center',
    marginBottom  : 5
  },

  button: {
    ...(new Elevation(1)),
    borderRadius     : 2,
    backgroundColor  : Colors.primary,
    paddingHorizontal: 10,
    paddingVertical  : 15,
    width            : 300,
    maxWidth         : 300
  },

  buttonText: {
    textAlign : 'center',
    color     : '#fff',
    fontWeight: 'bold'
  }
})
