import React, {Component} from 'react'
import Analytics from '../helpers/Analytics'

export default class Screen extends Component {
  constructor(props) {
    super(props)

    this.navigator = Object.assign({}, props.navigation)
    this.params    = props.navigation.state.params || {}

    // Initialize an analytics object
    this.analytics = new Analytics()
  }
}
