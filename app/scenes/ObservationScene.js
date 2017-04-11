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
import DCP from '../resources/config.js'
import Observation from '../helpers/Observation'
import Spinner from '../components/Spinner'
import realm from '../db/Schema'
import SnackBarNotice from '../components/SnackBarNotice'

export default class ObservationScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex: 0,
      synced    : false
    }
  }

  /**
   * Set the synced status.
   */
  componentDidMount() {
    this.setState({synced: this.props.plant.synced})
  }

  /**
   * Call onUnmount property.
   */
  componentWillUnmount() {
    this.props.onUnmount()
  }

  /**
   * Upload entry to server.
   *
   * @param entry
   */
  upload(entry) {
    this.refs.spinner.open()
    Observation.upload(entry).then(response => {
      let data   = response.data.data
      submission = realm.objects('Submission').filtered(`id == ${entry.id}`)
      if (submission.length > 0) {
        let observation = submission[0]
        realm.write(() => {
          observation.serverID = data.observation_id
          observation.synced   = true
        })
        this.refs.spinner.close()
        this.setState({synced: true})
        this.refs.snackbar.showBar()
      }
    }).catch(error => {
      console.log(error)
      this.refs.spinner.close()
    })
  }

  /**
   * Render meta data as list items.
   *
   * @param data
   * @returns {*}
   * @private
   */
  _renderMetaData = (data) => {
    if (typeof data === 'string' && data !== '') {
      data = JSON.parse(data)
    }

    if (data === '') {
      return null
    }

    return Object.keys(data).sort().map((key) => {
      let text  = data[key]
      let label = DCP[key] ? DCP[key].label : key

      // If it is an array, convert it to text
      if (/^\[.*\]$/g.test(text)) {
        let array = JSON.parse(text)
        text      = array.toString().replace(',', ', ')
      }

      if (text === '' || text === null) {
        return null
      }

      return (
        <View style={styles.field} key={key}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.dataText}>{text}</Text>
        </View>
      )
    })
  }

  /**
   * Render Scene.
   *
   * @returns {XML}
   */
  render() {
    let entry  = this.props.plant
    let images = JSON.parse(entry.images)

    return (
      <View style={styles.container}>
        <Spinner ref="spinner"/>
        <SnackBarNotice ref="snackbar" noticeText="Entry uploaded successfully!"/>
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
            {this.state.synced ? null :
              <View style={styles.field}>
                <MKButton style={styles.button} onPress={() => this.upload.call(this, entry)}>
                  <Text style={styles.buttonText}>Upload to Server</Text>
                </MKButton>
              </View>
            }

            <View style={styles.field}>
              <Text style={styles.label}>Date Collected</Text>
              <Text style={styles.dataText}>{entry.date}</Text>
            </View>

            {this._renderMetaData(entry.meta_data)}
          </View>
        </ScrollView>
      </View>
    )
  }
}

ObservationScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  plant    : PropTypes.object.isRequired,
  onUnmount: PropTypes.func
}

ObservationScene.defaultProps = {
  onUnmount: () => {
  }
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7'
  },

  contentContainer: {
    flex: 1
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
    paddingVertical  : 15,
    paddingHorizontal: 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2,
    marginHorizontal : 10,
    marginVertical   : 5
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: 'bold',
    textAlign : 'center'
  }
})