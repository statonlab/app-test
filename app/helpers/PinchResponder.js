import React from 'react'
// import moment from 'moment'

export default class PinchResponder {
  constructor(callback, scaleMin = 0, scaleMax = 1, scaleStep = .01, startValue = 0) {
    this.callback = callback
    this.scale    = {
      min : scaleMin,
      max : scaleMax,
      step: scaleStep
    }
    this.value    = startValue
    // this.time     = moment()
    this.distance = null
  }

  /**
   * Determine whether we should respond.
   *
   * @param {Object} event
   * @return {boolean}
   */
  onStartShouldSetResponder(event) {
    return event.nativeEvent.touches.length > 1
  }

  /**
   * Move event started! Determine whether there are >=2 fingers
   * on the screen. If so, consider it a pinch movement.
   *
   * @param {Object} event
   * @return {boolean}
   */
  onMoveShouldSetResponder(event) {
    // this.time = moment()
    return event.nativeEvent.touches.length > 1
  }

  /**
   * We've been granted control.
   *
   * @param {Object} event
   */
  onResponderGrant(event) {
    // There is nothing to do here
  }

  /**
   * We've been rejected control.
   *
   * @param {Object} event
   */
  onResponderReject(event) {
    // Nothing to do here either
  }

  /**
   * Determine whether it's a zoom-out or a zoom-in movement
   * and update the scale accordingly.
   *
   * @param {Object} nativeEvent
   */
  onResponderMove({nativeEvent}) {
    const touches = nativeEvent.changedTouches

    if (touches.length < 2) {
      return
    }

    // if (moment().subtract(10, 'ms').isBefore(this.time)) {
    //   return
    // }

    // this.time = moment()

    const x = [
      Math.min(touches[0].pageX, touches[1].pageX),
      Math.max(touches[0].pageX, touches[1].pageX)
    ]

    const y = [
      Math.min(touches[0].pageY, touches[1].pageY),
      Math.max(touches[0].pageY, touches[1].pageY)
    ]

    const yDistance = y[1] - y[0]
    const xDistance = x[1] - x[0]

    if (this.distance === null) {
      this.distance = [xDistance, yDistance]
      return
    }

    if (xDistance > this.distance[0] && yDistance > this.distance[1]) {
      if (this.value < this.scale.max) {
        this.value += this.scale.step
        this.callback(this.value)
      }
    }

    if (xDistance < this.distance[0] && yDistance < this.distance[1]) {
      if (this.value > this.scale.min) {
        this.value -= this.scale.step
        this.callback(this.value)
      }
    }
  }

  /**
   * Touch events over!
   *
   * @param {Object} event
   */
  onResponderRelease(event) {
    this.distance = null
  }

  /**
   * Whether to terminate the responder when the touch is over.
   *
   *
   * @param {Object} event
   * @return {boolean}
   */
  onResponderTerminationRequest(event) {
    return true
  }

  /**
   * Clean up.
   *
   * @param {Object} event
   */
  onResponderTerminate(event) {
    // Don't believe there is anything to do here
  }

  /**
   * Get the responder functions as View props.
   *
   * @return {{onStartShouldSetResponder: any, onMoveShouldSetResponder: any, onResponderGrant: any, onResponderReject: any, onResponderMove: any, onResponderRelease: any, onResponderTerminationRequest: any, onResponderTerminate: any}}
   */
  getResponderProps() {
    return {
      onStartShouldSetResponder    : this.onStartShouldSetResponder.bind(this),
      onMoveShouldSetResponder     : this.onMoveShouldSetResponder.bind(this),
      onResponderGrant             : this.onResponderGrant.bind(this),
      onResponderReject            : this.onResponderReject.bind(this),
      onResponderMove              : this.onResponderMove.bind(this),
      onResponderRelease           : this.onResponderRelease.bind(this),
      onResponderTerminationRequest: this.onResponderTerminationRequest.bind(this),
      onResponderTerminate         : this.onResponderTerminate.bind(this)
    }
  }
}
