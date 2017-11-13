import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform
} from 'react-native'
import realm from '../db/Schema'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'

export default class Guide extends Component {
  constructor(props) {
    super(props)

    this.state = {
      closing    : false,
      show       : false,
      opacity    : new Animated.Value(1),
      translate  : new Animated.Value(-30),
      currentStep: 0,
      hasSteps   : false
    }
  }

  static reset() {
    let guides = realm.objects('Guide')
    if (guides.length > 0) {
      realm.write(() => {
        realm.delete(guides)
      })
    }
  }

  componentWillMount() {
    let guides = realm.objects('Guide').filtered('screen = $0', this.props.screen)

    if (guides.length > 0) {
      let guide = guides[0]
      if (guide.version !== this.props.version) {
        realm.write(() => {
          guide.version = this.props.version
        })
        this.show()
      }
    } else {
      realm.write(() => {
        realm.create('Guide', {
          screen : this.props.screen,
          version: this.props.version
        })
      })
      this.show()
    }

    if (typeof this.props.message !== 'string' && Array.isArray(this.props.message)) {
      this.setState({hasSteps: true})
    }
  }

  show() {
    this.setState({show: true})
    this.state.opacity.setValue(1)
    Animated.timing(this.state.translate, {
      toValue : 0,
      duration: 700
    }).start()
  }

  close() {
    this.setState({closing: true})
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue : 0,
        duration: 500
      }),
      Animated.timing(this.state.translate, {
        toValue : -50,
        duration: 500
      })
    ]).start(() => {
      this.setState({show: false, closing: false})
    })
  }

  renderMessage() {
    if (typeof this.props.message === 'string') {
      return (<Text style={[style.bodyText]}>{this.props.message}</Text>)
    }

    if (this.state.hasSteps) {
      return this.props.message[this.state.currentStep]
    }

    return this.props.message
  }

  renderFooter() {
    if (!this.state.hasSteps) {
      return (
        <View style={style.footer}>
          <TouchableOpacity style={style.footerButton} onPress={this.close.bind(this)}>
            <Text style={style.footerButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      )
    }

    let remainingSteps = this.props.message.length - (this.state.currentStep + 1)
    let isFirstStep    = this.state.currentStep === 0
    let isLastStep     = remainingSteps === 0

    return (
      <View style={[style.footer, {justifyContent: 'space-between', flexDirection: 'row'}]}>
        <TouchableOpacity
          style={[style.footerButton, isFirstStep ? style.disabled : null]}
          onPress={this.back.bind(this)}
          activeOpacity={isFirstStep ? 1 : 0.2}
        >
          <Text style={[style.footerButtonText, isFirstStep ? style.disabledText : null]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.footerButton} onPress={() => {
          if (isLastStep) {
            this.close()
          } else {
            this.next()
          }
        }}>
          <Text style={style.footerButtonText}>
            {isLastStep ? 'Got it' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  back() {
    let isFirstStep = this.state.currentStep === 0
    if (isFirstStep) {
      return
    }

    this.setState({currentStep: this.state.currentStep - 1})
  }

  next() {
    this.setState({
      currentStep: this.state.currentStep + 1
    })
  }

  render() {
    if (!this.state.show) {
      return null
    }

    let transform       = [{
      translateY: this.state.translate
    }]
    let opacity         = this.state.opacity
    let marginBottom    = this.props.marginBottom
    let {width, height} = Dimensions.get('window')
    return (
      <View style={[style.absolute, {width, height}]}>
        <Animated.View style={[style.container, {transform, opacity, marginBottom}]}>
          <View style={style.icon}>
            <Icon name={this.props.icon ? this.props.icon : 'md-bulb'} color={Colors.primary} size={32}/>
          </View>
          <View style={[style.innerContainer]}>
            <View style={[style.body]}>
              {this.renderMessage()}
            </View>
            {this.renderFooter()}
          </View>
        </Animated.View>
      </View>
    )
  }
}

Guide.propTypes = {
  // Name of current screen
  screen      : PropTypes.string.isRequired,
  // Text or component message to display
  message     : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  // Version of message (used to determine whether the user has seen this new message)
  version     : PropTypes.number.isRequired,
  // Optional IonIcon name (E.g, md-star)
  // @see https://ionicframework.com/docs/ionicons/
  icon        : PropTypes.string,
  // Optional bottom margin
  marginBottom: PropTypes.number
}

Guide.defaultProps = {
  icon        : null,
  marginBottom: 10
}

const style = StyleSheet.create({
  absolute: {
    position: 'absolute',
    zIndex  : 9999999,
    ...Platform.select({
      android: {
        elevation: 5
      }
    })
  },

  container: {
    backgroundColor  : '#fff',//'#278F82',
    flexDirection    : 'row',
    paddingHorizontal: 5,
    ...(new Elevation(4)),
    marginHorizontal : 5,
    marginTop        : Platform.OS === 'android' ? 65 : 60,
    marginBottom     : 0,
    borderRadius     : 5
  },

  innerContainer: {
    flex           : 1,
    paddingVertical: 5
  },

  header: {
    paddingHorizontal: 5,
    paddingVertical  : 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center'
  },

  body: {
    padding      : 5,
    flexDirection: 'row',
    alignItems   : 'center'
  },

  headerText: {
    color          : '#222',
    fontSize       : 14,
    fontWeight     : '500',
    marginBottom   : 10,
    backgroundColor: 'transparent'
  },

  bodyText: {
    color          : '#444',
    fontSize       : 14,
    marginBottom   : 10,
    backgroundColor: 'transparent'
  },

  footer: {
    alignItems: 'flex-end'
  },

  footerButton: {
    paddingVertical  : 5,
    paddingHorizontal: 10,
    backgroundColor  : Colors.primary,
    borderRadius     : 5,
    margin           : 5,
    ...(new Elevation(1))
  },

  footerButtonText: {
    color     : Colors.primaryText,
    fontWeight: '500',
    fontSize  : 14
  },

  icon: {
    margin         : 10,
    backgroundColor: 'transparent'
  },

  disabled: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    shadowColor: 'transparent'
  },

  disabledText: {
    color: '#aaa'
  }
})

Guide.style = style