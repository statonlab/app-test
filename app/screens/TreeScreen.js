import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {View, DeviceEventEmitter} from 'react-native'
import Header from '../components/Header'
import {Tabs, Tab} from '../components/Tabs'
import TreeDescription from '../components/TreeDescription'
import Form from '../components/Form'
import {Plants} from '../resources/descriptions'

export default class TreeScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    DeviceEventEmitter.addListener('LocationDenied', () => {
      this.navigator.goBack()
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Header title={this.params.title}
                navigator={this.navigator}
                showRightIcon={false}
                elevation={0}
                onBackPress={() => {
                  return this.form.cancel()
                }}/>
        <Tabs>
          <Tab title="ADD ENTRY">
            <Form
              ref={ref => this.form = ref}
              title={this.params.title}
              formProps={Plants[this.params.title].formProps}
              entryInfo={this.params.entryInfo || {}}
              edit={this.params.edit || false}
              navigator={this.navigator}/>
          </Tab>
          <Tab title="INFORMATION">
            <TreeDescription title={this.params.title}/>
          </Tab>
        </Tabs>
      </View>
    )
  }
}

TreeScreen.PropTypes = {
  //navigator: PropTypes.object.isRequired,
  //title    : PropTypes.string.isRequired,
  //entryInfo: PropTypes.object,
  //edit     : PropTypes.bool
}

TreeScreen.defaultProps = {
  entryInfo: {},
  edit     : false
}