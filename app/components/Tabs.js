import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, ScrollView, Dimensions, Animated} from 'react-native'
import {MKButton} from 'react-native-material-kit'
import Colors from '../helpers/Colors'
import Elevation from '../helpers/Elevation'
import Tab from './subcomponents/Tab'

class Tabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      titles: [],
      active: 0,
      left  : 0
    }

    this.page = null
  }

  componentDidMount() {
    let titles = []

    this.props.children.map(child => {
      titles.push(child.props.title)
    })

    this.setState({titles})
  }

  _renderTitles() {
    if (this.state.titles.length === 0) {
      return (null)
    }

    return (
      <View style={[styles.titlesContainer, new Elevation(this.props.elevation)]}>
        {this.state.titles.map(this._renderTitle.bind(this))}
        <View style={[{
          width: Dimensions.get('window').width / this.state.titles.length,
          left : this.state.left
        }, styles.indicator]}/>
      </View>
    )
  }

  _renderTitle(title, index) {
    return (
      <MKButton
        style={styles.title}
        key={index}
        rippleColor="rgba(0,0,0,.1)"
        onPress={() => this.switchTab(index)}>
        <Text style={[styles.titleText, this.state.active === index ? styles.active : {}]}>{title}</Text>
      </MKButton>
    )
  }

  switchTab(index) {
    let width = Dimensions.get('window').width

    this.page.scrollTo({x: width * index, y: 0, animated: true})

    this.setState({active: index})
  }

  _handleScroll(event) {
    let width     = Dimensions.get('window').width
    let x         = event.nativeEvent.contentOffset.x
    let barOffset = x / this.state.titles.length
    let pages     = []

    for (let i = 0; i < this.state.titles.length; i++) {
      pages.push(i)
    }

    let page = pages.indexOf(x / width)

    this.setState({
      left  : barOffset,
      active: page > -1 ? page : this.state.active
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this._renderTitles()}
        <ScrollView
          ref={(ref) => this.page = ref}
          style={{flex: 1}}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={this._handleScroll.bind(this)}
          scrollEventThrottle={16}
          scrollEnabled={this.props.scrollEnabled}
          directionalLockEnabled={true}
          bounces={false}>
          {this.props.children}
        </ScrollView>
      </View>
    )
  }
}

Tabs.PropTypes = {
  elevation    : PropTypes.number,
  scrollEnabled: PropTypes.bool
}

Tabs.defaultProps = {
  elevation    : 1,
  scrollEnabled: false
}

const styles = StyleSheet.create({
  titlesContainer: {
    position       : 'relative',
    flex           : 0,
    flexDirection  : 'row',
    backgroundColor: '#fff',
    height         : 50
  },

  title: {
    flex             : 1,
    alignItems       : 'center',
    justifyContent   : 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height           : 50
  },

  titleText: {
    color     : '#777',
    fontWeight: 'bold',
    fontSize  : 12
  },

  active: {
    color: '#222'
  },

  indicator: {
    height         : 2,
    backgroundColor: Colors.primary,
    position       : 'absolute',
    bottom         : 0
  }
})

// Export components
export {Tabs, Tab}