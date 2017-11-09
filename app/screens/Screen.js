import React, {Component} from 'react'
import {NavigationActions} from 'react-navigation'

export default class Screen extends Component {
  constructor(props) {
    super(props)

    this.navigator          = Object.assign({}, props.navigation)
    // Prevent navigator from double navigating with multi clicks
    this.navigator.navigate = (routeName, params) => {
      if (this._isNavigating) {
        return
      }

      this._isNavigating = true
      props.navigation.navigate(routeName, params)
      setTimeout(() => {
        this._isNavigating = false
      }, 500)
    }
    this.navigator.reset    = this.resetNavigationState
    this.params             = props.navigation.state.params
    this._isNavigating      = false
  }

  resetNavigationState = () => {
    const resetAction = NavigationActions.reset({
      index  : 0,
      actions: [
        NavigationActions.navigate({routeName: 'Landing'})
      ],
      key    : null
    })

    this.navigator.dispatch(resetAction)
  }
}