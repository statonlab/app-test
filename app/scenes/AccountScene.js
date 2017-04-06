import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, Text, TextInput} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'
import Colors from '../helpers/Colors'
import {MKButton} from 'react-native-material-kit'
import PickerModal from '../components/PickerModal'
import realm from '../db/Schema'

export default class AccountScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name          : '',
      anonymous     : '',
      email         : '',
      zipcode       : '',
      isOverThirteen: ''
    }
  }

  componentDidMount() {
    let user = realm.objects('User')[0]
    this.setState({
      name          : user.name,
      email         : user.email,
      zipcode       : user.zipcode,
      anonymous     : user.anonymous ? 'Yes' : 'No',
      isOverThirteen: user.is_over_thirteen ? 'I am over 13 years old' : 'I am not over than 13 years old'
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Account" navigator={this.props.navigator} elevation={4} showRightIcon={false}/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>PERSONAL</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'E.g, Jane Doe'}
                  placeholderTextColor="#aaa"
                  returnKeyType={'next'}
                  onChangeText={(name) => this.setState({name})}
                  defaultValue={this.state.name}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'E.g, jane@example.com'}
                  placeholderTextColor="#aaa"
                  returnKeyType={'next'}
                  onChangeText={(email) => this.setState({email})}
                  defaultValue={this.state.email}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'E.g, 37919'}
                  placeholderTextColor="#aaa"
                  returnKeyType={'next'}
                  onChangeText={(zipcode) => this.setState({zipcode})}
                  defaultValue={this.state.zipcode}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            <Text style={styles.title}>PRIVACY</Text>
            <View style={styles.card}>
              <PickerModal
                style={[styles.formGroup]}
                onSelect={(anonymous) => this.setState({anonymous})}
                choices={['Yes', 'No']}
                header="Anonymous users have their information hidden from other users. Would you like to be anonymous?"
              >
                <Text style={styles.label}>Anonymous</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'No'}
                  placeholderTextColor="#aaa"
                  returnKeyType={'next'}
                  value={this.state.anonymous}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </PickerModal>
              <PickerModal
                style={[styles.formGroup, styles.noBorder]}
                onSelect={(isOverThirteen) => this.setState({isOverThirteen})}
                choices={['I am over 13 years old', 'I am not over 13 years old']}
                header="Are you over the age of 13?"
              >
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholder={'Over Thirteen'}
                  placeholderTextColor="#aaa"
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  value={this.state.isOverThirteen}
                  editable={false}
                />
              </PickerModal>
            </View>

            <Text style={styles.title}>PASSWORD</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, styles.labelLg]}>Old Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholderTextColor="#aaa"
                  onChangeText={(oldPassword) => this.setState({oldPassword})}
                  placeholder={'Old Password'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, styles.labelLg]}>New Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholderTextColor="#aaa"
                  placeholder={'New Password'}
                  onChangeText={(newPassword) => this.setState({newPassword})}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={[styles.formGroup, styles.noBorder]}>
                <Text style={[styles.label, styles.labelLg]}>Repeat Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.textField}
                  autoCapitalize={'words'}
                  placeholderTextColor="#aaa"
                  placeholder={'Repeat New Password'}
                  onChangeText={(reNewPassword) => this.setState({reNewPassword})}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.column}>
            <MKButton style={styles.button}>
              <Text style={styles.buttonText}>Update</Text>
            </MKButton>
          </View>
          <View style={styles.column}>
            <MKButton style={[styles.button, styles.buttonLink]} rippleColor="rgba(0,0,0,0.1)">
              <Text style={[styles.buttonText, styles.buttonLinkText]}>Cancel</Text>
            </MKButton>
          </View>
        </View>
      </View>
    )
  }
}

AccountScene.PropTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  innerContainer: {
    paddingVertical: 10
  },

  card: {
    backgroundColor  : '#fff',
    marginBottom     : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopWidth   : 1,
    borderTopColor   : '#ddd'
  },

  formGroup: {
    flexDirection    : 'row',
    alignItems       : 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical  : 5,
    paddingLeft      : 5,
    marginHorizontal : 5
  },

  label: {
    fontSize        : 14,
    color           : '#222',
    fontWeight      : 'bold',
    width           : 100,
    borderRightWidth: 1
  },

  labelLg: {
    width: 120
  },

  textField: {
    flex             : 1,
    height           : 40,
    borderRadius     : 2,
    paddingHorizontal: 10,
    fontSize         : 14
  },

  title: {
    color     : '#777',
    fontSize  : 12,
    fontWeight: 'bold',
    padding   : 10
  },

  footer: {
    flex          : 0,
    height        : 50,
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },

  column: {
    flex   : 1,
    padding: 5
  },

  button: {
    ...(new Elevation(2)),
    flex           : 1,
    backgroundColor: Colors.primary,
    borderRadius   : 2,
    alignItems     : 'center',
    justifyContent : 'center'
  },

  buttonText: {
    color     : Colors.primaryText,
    flex      : 0,
    fontWeight: 'bold'
  },

  buttonLink: {
    backgroundColor: '#fff'
  },

  buttonLinkText: {
    color: '#777'
  },

  noBorder: {
    borderBottomWidth: 0
  }
})
