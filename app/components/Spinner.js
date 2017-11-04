import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet} from 'react-native'
import {MKSpinner} from 'react-native-material-kit'
import Elevation from '../helpers/Elevation'

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
    if (nextProps.show !== this.state.show) {
      this.setState({show: nextProps.show})
    }
  }

  componentDidMount() {
    this.setState({show: this.props.show})
  }

  render() {
    let hiddenStyle = {
      left : -999999,
      width: 0
    }

    return (
      <View style={[styles.container, this.state.show ? {} : hiddenStyle]}>
        <View style={styles.spinner}>
          <MKSpinner prgress={.5} buffer={.5}/>
        </View>
      </View>
    )
  }
}

Spinner.PropTypes = {
  show   : PropTypes.bool.isRequired
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
    zIndex         : 999999
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