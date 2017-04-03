import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {MKButton} from 'react-native-material-kit'
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

  componentDidMount() {
    this.getObservations()
  }

  getObservations() {
    let observations = realm.objects('Submission').filtered('synced = false')
    if (observations.length > 0) {
      this.setState({
        show: true,
        observations
      })
    } else {
      this.setState({show: false})
    }
  }

  upload() {
    this.state.observations.forEach(observation => {
      Observation.upload(observation)
        .then(response => {
          realm.write(() => {
            observation.synced = true
          })
        }).catch(error => {
        console.log('REQUEST ERROR', error)
      })
    })

    this.setState({show: false})
  }

  render() {
    return (
      <View>
        {this.state.show ?
          <MKButton
            style={styles.button}
            onPress={this.upload.bind(this)}
          >
            <Text style={styles.buttonText}>{this.props.label} ({this.state.observations.length})</Text>
          </MKButton> : null}
      </View>
    )
  }

  componentWillUnmount() {
    this.events.forEach(event => {
      event.remove()
    })
  }
}

UploadButton.PropTypes = {
  label: PropTypes.string
}

UploadButton.defaultProps = {
  label: 'Upload Your Observations'
}

const styles = new StyleSheet.create({
  button: {
    ...(new Elevation(2)),
    paddingVertical  : 15,
    paddingHorizontal: 10,
    marginBottom     : 10,
    backgroundColor  : Colors.warning,
    borderRadius     : 2
  },

  buttonText: {
    color     : Colors.warningText,
    fontWeight: '500',
    textAlign : 'center'
  }
})