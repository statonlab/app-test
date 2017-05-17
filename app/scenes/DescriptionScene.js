import React, {Component, PropTypes} from 'React'
import {View, Text} from 'react-native'
import Header from '../components/Header'
import {Tabs, Tab} from '../components/Tabs'
import TreeDescription from '../components/TreeDescription'

export default class DescriptionScene extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Header title={this.props.title} navigator={this.props.navigator} showRightIcon={false} elevation={0}/>
        <Tabs>
          <Tab title="Description">
            <TreeDescription title={this.props.title}/>
          </Tab>
          <Tab title="Add Entry">
            <Text style={{backgroundColor: '#fff', padding: 10}}>Tab 2</Text>
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