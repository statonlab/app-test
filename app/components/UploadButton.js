import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity} from 'react-native'
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
      observations: []
    }
  }

  /**
   * Verify the existence of unsynced observations.
   */
  componentDidMount() {
    this.getObservations()
    this.events = [
      DeviceEventEmitter.addListener('uploadRequested', () => {
        this.upload()
      })
    ]
  }

  componentWillUnmount() {
    this.events.map(e => e.remove())
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
    // Have to use json to do a deep copy of the objects
    const observations = JSON.parse(JSON.stringify(this.state.observations))
    let foundErrors    = false
    let total          = 0
    Object.keys(observations).forEach(key => {
      total += Observation.countImages(observations[key].images)
    })

    this.setState({
      show: false
    })

    let step = 0
    if (this.props.spinner) {
      this.props.spinner.setTitle('Uploading Images')
        .setProgressTotal(total)
        .setProgress(step)
        .open()
    }

    for (let i in observations) {
      if (!observations.hasOwnProperty(i)) {
        continue
      }

      try {
        let observation = observations[i]
        if (!observation.synced) {
          await Observation.upload(observation, () => {
            step++
            if (this.props.spinner) {
              this.props.spinner.setProgress(step)
            }
          })
        } else {
          await Observation.update(observation, () => {
            step++
            if (this.props.spinner) {
              this.props.spinner.setProgress(step)
            }
          })
          let updatedObservation = realm.objects('Submission').filtered(`id = ${observation.id}`)
          if (updatedObservation.length > 0) {
            realm.write(() => {
              updatedObservation[0].needs_update = false
            })
          }
        }
        if (this.props.spinner) {
          this.props.spinner.setProgress(step)
        }
      } catch (error) {
        foundErrors = true
        if (this.props.spinner) {
          this.props.spinner.close()
        }
        const errors = new Errors(error)
        this.setState({show: true})
        if (errors.has('general')) {
          this.props.onError(errors.first('general'))
        } else {
          let field = Object.keys(errors.all())[0]
          this.props.onError(errors.first(field))
        }

        break
      }
    }

    if (!foundErrors) {
      this.done()
    }
  }

  done() {
    if (this.props.spinner) {
      this.props.spinner.close()
    }
    this.props.onUploadDone()
  }

  render() {
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
