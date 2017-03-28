import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {MKSpinner} from 'react-native-material-kit'
import Elevation from  '../helpers/Elevation'

export default class Spinner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true
    }
  }

  open() {
    this.setState({show: true})
  }

  close() {
    this.setState({show: false})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show != this.state.show) {
      this.setState({show: nextProps.show})
    }
  }

  render() {
    return (
      <View style={[styles.container, {left: this.state.show ? 0 : -9999999}]}>
        <View style={styles.spinner}>
          <MKSpinner prgress={.5} buffer={.5}/>
        </View>
      </View>
    )
  }
}

Spinner.PropTypes = {
  show: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex           : 1,
    height         : undefined,
    width          : undefined,
    position       : 'absolute',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    justifyContent : 'center',
    alignItems     : 'center',
    zIndex         : 999999,
  },

  spinner: {
    ...(new Elevation(5)),
    width          : 50,
    height         : 50,
    backgroundColor: '#fff',
    borderRadius   : 3,
    justifyContent : 'center',
    alignItems     : 'center'
  }
})