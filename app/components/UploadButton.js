import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native'
import realm from '../db/Schema'
import Observation from '../helpers/Observation'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'

export default class UploadButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show        : false,
      observations: []
    }
  }

  /**
   * Verify the existence of unsynced observations.
   */
  componentDidMount() {
    this.getObservations()
  }

  /**
   * Set the unsynced observations in the state.
   */
  getObservations() {
    let observations = realm.objects('Submission').filtered('synced == false')
    if (observations.length > 0) {
      this.setState({
        show: true,
        observations
      })
    } else {
      this.setState({show: false})
    }
  }

  /**
   * Upload observations to the server.
   */
  upload() {
    let len      = this.state.observations.length
    let uploaded = 0

    this.setState({
      show     : false,
      uploading: true
    })

    this.state.observations.forEach(async observation => {
      try {
        let response = await Observation.upload(observation)
        realm.write(() => {
          observation.synced   = true
          observation.serverID = response.data.data.observation_id
        })
        this.done()
        uploaded++
      } catch (error) {
        console.log('REQUEST ERROR', error)
        uploaded++
        if (uploaded === len) {
          this.setState({uploading: false, show: true})
          this.props.onError()
        }
      }
    })
  }

  done() {
    this.setState({uploading: false})
    this.props.onUploadDone()
  }

  render() {
    return (
      <View>
        {!this.state.show || this.state.observations.length === 0 ? null :
          <TouchableOpacity
            style={styles.button}
            onPress={this.upload.bind(this)}
          >
            <Text style={styles.buttonText}>{this.props.label} ({this.state.observations.length})</Text>
          </TouchableOpacity>
        }

        {!this.state.uploading ? null :
          <ActivityIndicator
            animating={true}
            style={[styles.centering, {height: 47}]}
          />
        }
      </View>
    )
  }
}

UploadButton.PropTypes = {
  label       : PropTypes.string,
  onUploadDone: PropTypes.func,
  onError     : PropTypes.func
}

UploadButton.defaultProps = {
  label       : 'Upload Your Observations',
  onUploadDone: () => {
  },
  onError     : () => {
  }
}

const styles = new StyleSheet.create({
  button: {
    ...(new Elevation(2)),
    paddingVertical  : 15,
    paddingHorizontal: 10,
    marginBottom     : 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2,
    marginHorizontal : 5
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: '500',
    textAlign : 'center'
  }
})