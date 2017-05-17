import React, {Component, PropTypes} from 'React'
import {View} from 'react-native'
import Header from '../components/Header'
import {Tabs, Tab} from '../components/Tabs'
import TreeDescription from '../components/TreeDescription'
import Form from '../components/Form'
import Plants from '../resources/descriptions'

export default class DescriptionScene extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Header title={this.props.title} navigator={this.props.navigator} showRightIcon={false} elevation={0}/>
        <Tabs>
          <Tab title="DESCRIPTION">
            <TreeDescription title={this.props.title}/>
          </Tab>
          <Tab title="ADD ENTRY">
            <Form title={this.props.title} formProps={Plants[this.props.title].formProps} navigator={this.props.navigator}/>
          </Tab>
        </Tabs>
      </View>
    )
  }
}

DescriptionScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  title    : PropTypes.string.isRequired
}