import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native'
import realm from '../db/Schema'
import Observation from '../helpers/Observation'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Errors from '../helpers/Errors'

export default class UploadButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show        : false,
      observations: [],
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
    let observations = realm.objects('Submission').filtered('synced == false OR needs_update == true')
    if (observations.length > 0) {
      this.setState({
        show: true,
        observations
      })
    } else {
      this.setState({show: false, observations: []})
    }
  }

  /**
   * Upload observations to the server.
   */
  async upload() {
    this.setState({
      show     : false,
    })

    let step = 0
    if (this.props.spinner) {
      this.props.spinner.setTitle('Uploading Observations')
        .setProgressTotal(this.state.observations.length)
        .setProgress(step)
        .open()
    }

    for (let i in this.state.observations) {
      let observation = this.state.observations[i]
      try {
        if (!observation.needs_update) {
          await Observation.upload(observation)
        } else {
          await Observation.update(observation)
          realm.write(() => {
            observation.needs_update = false
          })
        }
        step++
        if (this.props.spinner) {
          this.props.spinner.setProgress(step)
        }
      } catch (error) {
        if (this.props.spinner) {
          this.props.spinner.close()
        }
        console.log(error)
        const errors = new Errors(error)
        this.setState({show: true})
        if (errors.has('general')) {
          this.props.onError(errors.first('general'))
        } else {
          let field = Object.keys(errors.all())[0]
          this.props.onError(errors.first(field))
        }

        return
      }
    }
    this.done()
  }

  done() {
    if (this.props.spinner) {
      this.props.spinner.close()
    }
    this.props.onUploadDone()
  }

  render() {
    console.log(this.state)
    if (!this.state.show || this.state.observations.length === 0) {
      return null
    }

    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={this.upload.bind(this)}
        >
          <Text style={styles.buttonText}>{this.props.label} ({this.state.observations.length})</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

UploadButton.propTypes = {
  label       : PropTypes.string,
  onUploadDone: PropTypes.func,
  onError     : PropTypes.func,
  spinner     : PropTypes.object
}

UploadButton.defaultProps = {
  label       : 'Upload Your Observations',
  onUploadDone: () => {
  },
  onError     : () => {
  },
  spinner     : null
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
