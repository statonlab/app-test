import React, {Component, PropTypes} from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native'
import {getTheme} from 'react-native-material-kit'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'
import Plants from '../resources/descriptions'
const theme = getTheme()

export default class TreeDescriptionScene extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.props.title}
          navigator={this.props.navigator}
        />
        <ScrollView style={styles.scrollView}>
          <Image source={Plants[this.props.title].image} style={styles.cardImage}/>
          {Plants[this.props.title].descriptionCards.map((card, index) => {
            return (
              <View style={styles.card} key={index}>
                <View style={[styles.cardBody, {paddingTop: 0}]}>
                  <Text style={styles.cardTitle}> {card.title} </Text>
                  {card.body.map((body, bodyIndex) => {
                    return (
                      <Text style={styles.cardText} key={bodyIndex}> {body} </Text>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </ScrollView>
        <View style={styles.footer}>
          <MKButton style={styles.button} onPress={() => {
            this.props.navigator.push({label: 'FormScene', title: this.props.title, formProps: Plants[this.props.title].formProps})
          }}>
            <Text style={styles.buttonText}>
              Add New Entry
            </Text>
          </MKButton>
        </View>
      </View>
    )
  }
}

TreeDescriptionScene.propTypes = {
  title    : PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
}

const elevationStyle = new Elevation(2)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },

  scrollView: {
    flex: 1
  },

  card: {
    ...theme.cardStyle,
    ...elevationStyle,
    borderRadius   : 0,
    flex           : 1,
    paddingVertical: 10,
    justifyContent : 'center',
    marginBottom   : 5
  },

  cardImage: {
    ...theme.cardImageStyle,
    height         : 150,
    resizeMode     : 'cover',
    width          : undefined,
    backgroundColor: '#fff',
  },

  cardTitle: {
    fontSize  : 14,
    flex      : 1,
    fontWeight: 'bold',
    color     : "#222"
  },

  cardBody: {
    padding          : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede'
  },

  cardText: {
    padding: 10,
    color  : '#666'
  },

  footer: {
    flex          : 0,
    height        : 60,
    justifyContent: 'center',
    alignItems    : 'center'
  },

  button: {
    ...(new Elevation(1)),
    borderRadius     : 2,
    backgroundColor  : Colors.primary,
    paddingHorizontal: 10,
    paddingVertical  : 15,
    width            : 300,
    maxWidth         : 300,
  },

  buttonText: {
    textAlign : 'center',
    color     : '#fff',
    fontWeight: 'bold'
  },
})
