import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import GetLocation from '../components/GetLocation'
import Header from '../components/Header'

export default class CaptureLocationScene extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Capture Location" navigator={this.props.navigator}/>
        <GetLocation
          image={this.props.image}
          accept={this.goToForm}
          cancel={this.goToForm}/>
      </View>
    )
  }

  goToForm = () => {
    let title = this.props.plantTitle
    this.props.navigator.push({
      label: 'FormScene',
      title: title
    })
  }
}

CaptureLocationScene.propTypes = {
  navigator : PropTypes.object.isRequired,
  image     : PropTypes.object.isRequired,
  plantTitle: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex           : 1,
    flexDirection  : 'column'
  },
});
