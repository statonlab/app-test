import React from 'react'
import {Platform} from 'react-native'

export default class PinchResponder {
  constructor(callback, scaleMin = 0, scaleMax = 1, scaleStep = .001, startValue = 0) {
    this.callback = callback
    this.scale    = {
      min : scaleMin,
      max : scaleMax,
      step: Platform.select({ios: scaleStep, android: 0.1})
    }

    this.value    = startValue
    this.distance = null
    this.time     = null
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
   * @param {Object} event
   */
  onResponderMove(event) {
    const touches = event.nativeEvent.changedTouches

    if (touches.length < 2) {
      return
    }

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
    const time      = touches[1].timestamp

    if (this.distance === null || this.time == null) {
      this.distance = [xDistance, yDistance]
      this.time     = time
      return
    }

    const dY       = this.velocity(yDistance, this.distance[1], time, this.time)
    const dX       = this.velocity(xDistance, this.distance[0], time, this.time)
    const velocity = Math.max(dY, dX)

    if (xDistance > this.distance[0] && yDistance > this.distance[1]) {
      if (this.value < this.scale.max) {
        this.value += this.scale.step * velocity
      }
    }

    if (xDistance < this.distance[0] && yDistance < this.distance[1]) {
      if (this.value > this.scale.min) {
        this.value -= this.scale.step * velocity
      }
    }

    if (this.value < this.scale.min) {
      this.value = this.scale.min
    }
    if (this.value > this.scale.max) {
      this.value = this.scale.max
    }

    console.log('HERE setting value', this.value)

    this.callback(this.value)
  }

  velocity(x1, x2, t1, t2) {
    const dX = (x2 - x1)
    const dY = (t2 - t1)
    return !isNaN(dX / dY) ? Math.abs(dX / dY) : 1
  }

  /**
   * Touch events over!
   *
   * @param {Object} event
   */
  onResponderRelease(event) {
    this.distance = null
    this.time     = null
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
