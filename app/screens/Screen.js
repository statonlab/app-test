import React, {Component} from 'react'
import {NavigationActions} from 'react-navigation'

export default class Screen extends Component {
  constructor(props) {
    super(props)

    this.navigator         = props.navigation
    this.navigator.reset   = this.resetNavigationState
    this.navigator.replace = this.replaceNavigationState
    this.params            = props.navigation.state.params
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

  replaceNavigationState = (routeName, params) => {
    const replaceAction = NavigationActions.reset({
      index  : 0,
      actions: [
        NavigationActions.navigate({routeName}, params)
      ],
      key    : null
    })

    this.navigator.dispatch(replaceAction)
  }
}