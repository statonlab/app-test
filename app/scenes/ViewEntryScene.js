import React, {Component, PropTypes} from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'

export default class ViewEntryScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex: 0
    }
  }

  render() {
    let entry  = this.props.plant
    let images = JSON.parse(entry.images)
    console.log(entry)
    return (
      <View style={styles.container}>
        <Header navigator={this.props.navigator} title={entry.name}/>
        <ScrollView style={styles.contentContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={true}
            pagingEnabled={true}
          >
            {images.map((image, index) => {
              return (<Image key={index} source={{uri: image}} style={styles.image}/>)
            })}
          </ScrollView>
          <View style={styles.card}>
            <View style={styles.field}>
              {entry.synced ?
                <Text style={styles.dataText}>Uploaded</Text> :
                <MKButton style={styles.button}>
                  <Text style={styles.buttonText}>Click to Upload</Text>
                </MKButton>
              }
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Date Collected</Text>
              <Text style={styles.dataText}>{entry.date}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

ViewEntryScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  plant    : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7'
  },

  contentContainer: {
    flex: 1,
  },

  card: {
    flex           : 0,
    backgroundColor: '#fff'
  },

  field: {
    flex             : 0,
    flexDirection    : 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  label: {
    fontWeight       : 'bold',
    paddingVertical  : 10,
    paddingHorizontal: 10,
    color            : '#444'
  },

  dataText: {
    color        : '#777',
    paddingLeft  : 20,
    paddingRight : 10,
    paddingBottom: 10
  },

  image: {
    flex      : 0,
    width     : Dimensions.get('window').width,
    height    : 190,
    resizeMode: 'cover'
  },

  button: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.warning,
    borderRadius: 2,
    marginHorizontal: 10,
    marginVertical: 5
  },

  buttonText: {
    color: Colors.warningText,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})