import React, {Component, PropTypes} from 'react'
import {
  View,
  ListView,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import Header from '../components/Header'
import Colors from '../helpers/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import realm from '../db/Schema'
import moment from 'moment'
import {MKButton} from 'react-native-material-kit'

export default class SubmissionsScene extends Component {
  constructor(props) {
    super(props)

    let dataSource  = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id,
      sectionHeaderHasChanged: () => {}
    })
    let submissions = realm.objects('Submission')

    this.state = {
      hasData    : (submissions.length > 0),
      submissions: dataSource.cloneWithRowsAndSections(this._createMap(submissions))
    }
  }

  _createMap(submissions) {
    let synced   = []
    let unsynced = []

    submissions.map(submission => {
      if (submission.synced) {
        synced.push(submission)
      } else {
        unsynced.push(submission)
      }
    })

    return {
      'Needs Uploading': unsynced,
      'Uploaded'       : synced
    }
  }

  _renderRow = (submission) => {
    let images = JSON.parse(submission.image)
    return (
      <MKButton style={styles.row} key={submission.id} rippleColor="rgba(10,10,10,.1)">
        <Image source={{uri: images[0]}} style={styles.image}/>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{submission.name}</Text>
          <Text style={styles.body}>{moment(submission.date, "MM-DD-YYYY HH:mm:ss").format("MMMM Do YYYY")}</Text>
          <Text style={styles.body}>Near {submission.location.latitude.toFixed(4)}, {submission.location.longitude.toFixed(4)}</Text>
        </View>
        <MKButton style={[styles.textContainer, styles.rightElement]}>
          <Icon name="md-more" size={30} color="#aaa"/>
        </MKButton>
      </MKButton>
    )
  }

  _renderList = () => {
    return (
      <ListView
        dataSource={this.state.submissions}
        renderRow={this._renderRow}/>
    )
  }

  _renderEmpty = () => {
    return (
      <View>
        <Text>No Entries Found</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigator={this.props.navigator} title="Your Entries"/>
        {this.state.hasData ? this._renderList() : this._renderEmpty()}
      </View>
    )
  }
}

SubmissionsScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f7f7f7'
  },

  row: {
    flexDirection    : 'row',
    alignItems       : 'center',
    backgroundColor  : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding          : 10
  },

  image: {
    flex      : 0,
    width     : 50,
    height    : 50,
    resizeMode: 'cover'
  },

  textContainer: {
    flex             : 1,
    paddingHorizontal: 10,
    justifyContent   : 'space-between'
  },

  title: {
    color     : '#222',
    fontWeight: '500'
  },

  body: {
    color: '#666'
  },

  actionButton: {
    backgroundColor  : Colors.danger,
    borderRadius     : 2,
    paddingHorizontal: 5,
    paddingVertical  : 10
  },

  rightElement: {
    flex          : 0,
    width         : 50,
    alignItems    : 'center',
    justifyContent: 'center'
  }
})