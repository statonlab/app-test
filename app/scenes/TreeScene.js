import React, {Component, PropTypes} from 'react'
import {View, DeviceEventEmitter} from 'react-native'
import Header from '../components/Header'
import {Tabs, Tab} from '../components/Tabs'
import TreeDescription from '../components/TreeDescription'
import Form from '../components/Form'
import {Plants} from '../resources/descriptions'

export default class TreeScene extends Component {
  constructor(props) {
    super(props)

    DeviceEventEmitter.addListener('LocationDenied', () => {
      this.props.navigator.pop()
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Header title={this.props.title}
                navigator={this.props.navigator}
                showRightIcon={false}
                elevation={0}
                onBackPress={() => {
                  return this.refs.form.cancel()
                }}/>
        <Tabs>
          <Tab title="ADD ENTRY">
            <Form
              ref="form"
              title={this.props.title}
              formProps={Plants[this.props.title].formProps}
              entryInfo={this.props.entryInfo}
              edit={this.props.edit}
              navigator={this.props.navigator}/>
          </Tab>
          <Tab title="INFORMATION">
            <TreeDescription title={this.props.title}/>
          </Tab>
        </Tabs>
      </View>
    )
  }
}

TreeScene.PropTypes = {
  navigator: PropTypes.object.isRequired,
  title    : PropTypes.string.isRequired,
  entryInfo: PropTypes.object,
  edit     : PropTypes.bool
}

TreeScene.defaultProps = {
  entryInfo: {},
  edit     : false
}