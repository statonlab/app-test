import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {MKSpinner} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'

export default class Spinner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false
    }
  }

  open() {
    this.setState({show: true})
  }

  close() {
    this.setState({show: false})
  }

  render() {
    let hidden = !this.state.show ? {
      width: 0,
      left : -99999
    } : {}
    return (
      <View style={[styles.container, hidden]}>
        <View style={styles.spinner}>
          <MKSpinner prgress={.5} buffer={.5}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.2)',
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
    zIndex         : 9999999999,
    elevation      : 5
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
