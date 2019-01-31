import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import Elevation from '../helpers/Elevation'
import {CircleSnail, Bar} from 'react-native-progress'
import Colors from '../helpers/Colors'

const CONTENT_PADDING = 20

export default class Spinner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show         : false,
      message      : '',
      total        : 0,
      step         : 0,
      title        : '',
      progressWidth: 50
    }
  }

  /**
   * Open the spinner
   */
  open() {
    this.setState({show: true})
    return this
  }

  /**
   * Close the spinner
   */
  close() {
    this.setState({show: false, total: 0, message: '', step: 0})
    return this
  }

  /**
   * Set a title
   *
   * @param title
   * @return {Spinner}
   */
  setTitle(title) {
    this.setState({title})
    return this
  }

  /**
   * Set a message.
   *
   * @param message
   * @return {Spinner}
   */
  setMessage(message) {
    this.setState({message})
    return this
  }

  /**
   * Set the total number of steps.
   *
   * @param total
   * @return {Spinner}
   */
  setProgressTotal(total) {
    this.setState({total})
    return this
  }

  /**
   * Set the current step.
   *
   * @param step
   * @return {Spinner}
   */
  setProgress(step) {
    this.setState({step})
    return this
  }

  renderProgressBar() {
    const computed = Math.round((this.state.step / this.state.total) * 10) / 10

    return (
      <View style={styles.progress} onLayout={({nativeEvent}) => {
        this.setState({progressWidth: nativeEvent.layout.width - CONTENT_PADDING * 2})
      }}>
        {this.state.title ?
          <Text style={{fontSize: 14, fontWeight: '500', marginBottom: 10}}>{this.state.title}</Text>
          :
          null}
        <Bar
          useNativeDriver={true}
          width={this.state.progressWidth}
          style={{marginBottom: 10}}
          borderColor={Colors.info}
          color={Colors.info}
          progress={computed}/>
        <Text style={{
          color   : '#444',
          fontSize: 12
        }}>
          {this.state.message.length > 0 ? this.state.message : `${this.state.step} out of ${this.state.total}`}
        </Text>
      </View>
    )
  }

  renderSpinner() {
    return (
      <View style={styles.spinner}>
        <CircleSnail size={40} color={[Colors.primary, Colors.danger, Colors.warning]}/>
      </View>
    )
  }

  /**
   * Render the spinner.
   *
   * @return {*}
   */
  render() {
    let hidden = !this.state.show ? {
      width: 0,
      left : -99999
    } : {}

    return (
      <View style={[styles.container, hidden]}>
        {this.state.total !== 0 ? this.renderProgressBar() : this.renderSpinner()}
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
  },

  progress: {
    ...(new Elevation(5)),
    backgroundColor: '#fff',
    borderRadius   : 3,
    justifyContent : 'center',
    alignItems     : 'center',
    padding        : CONTENT_PADDING
  }
})
