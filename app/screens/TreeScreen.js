import React from 'react'
import Screen from './Screen'
import {View, DeviceEventEmitter, Text} from 'react-native'
import Header from '../components/Header'
import {Tabs, Tab} from '../components/Tabs'
import TreeDescription from '../components/TreeDescription'
import Form from '../components/Form'
import {Plants} from '../resources/Descriptions'
import Guide from '../components/Guide'

export default class TreeScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props)

    DeviceEventEmitter.addListener('LocationDenied', () => {
      this.navigator.goBack()
    })

    this.shouldLogInfoTabAnalytics = true
  }

  componentDidMount() {
    this.analytics.visitScreen(`TreeScreen_${this.params.title}`)
  }

  renderGuideMessage() {
    return ([
      <View>
        <Text style={Guide.style.headerText}>
          Submitting a New Entry
        </Text>
        <Text style={Guide.style.bodyText}>
          Complete the form below to submit a new observation. TreeSnap will collect your GPS location automatically.
        </Text>
      </View>,
      <View>
        <Text style={Guide.style.headerText}>
          Getting Help
        </Text>
        <Text style={Guide.style.bodyText}>
          You can view distribution maps, species ID images, and more by tapping the "information" tab.
        </Text>
        <Text style={[Guide.style.bodyText, {marginBottom: 0}]}>
          Look for the green question marks or the "Show Examples" icon when answering questions. They provide additional instructions or diagrams to help!
        </Text>
      </View>
    ])
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5', position: 'relative'}}>
        <Guide
          ref={ref => this.guide = ref}
          screen="TreeDescription"
          message={this.renderGuideMessage()}
          icon="md-create"
          version={1}
          marginBottom={10}
        />
        <Header title={this.params.title}
                navigator={this.navigator}
                elevation={0}
                rightIcon="help"
                onRightPress={() => this.guide.show()}
                onBackPress={() => {
                  return this.form.cancel()
                }}/>
        <Tabs
          onSwitch={title => {
            if (this.shouldLogInfoTabAnalytics && title === 'INFORMATION') {
              this.shouldLogInfoTabAnalytics = false
              const screen                   = `InformationTab_${title}`
              this.analytics.visitScreen(screen)
            }
          }}>
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

TreeScreen.propTypes = {
  //navigator: PropTypes.object.isRequired,
  //title    : PropTypes.string.isRequired,
  //entryInfo: PropTypes.object,
  //edit     : PropTypes.bool
}

TreeScreen.defaultProps = {
  entryInfo: {},
  edit     : false
}
