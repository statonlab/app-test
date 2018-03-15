import React from 'react'
import Screen from './Screen'
import PropTypes from 'prop-types'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  BackHandler
} from 'react-native'
import Header from '../components/Header'
import Elevation from '../helpers/Elevation'

export default class PrivacyPolicyScreen extends Screen {
  static navigationOptions = {
    tabBarVisible: false
  }

  componentWillMount() {
    this.backEvent = BackHandler.addEventListener('hardwareBackPress', () => {
      this.navigator.goBack()
      return true
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Privacy Policy"
          navigator={this.navigator}
          elevation={2}
          showRightIcon={false}
          initial={true}
          onMenuPress={() => this.navigator.navigate('DrawerToggle')}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.textBody}>Policy version 1.0. Please refer to the TreeSnap website
              for more information.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>What information do we collect?</Text>
            <Text style={styles.textBody}>When you create a user account for this app, we will
              collect your name, email address, zip code, and your age. We will also collect some
              information related to your device (operating system, model). This information will be
              stored in the TreeSnap user database and will not be shown, disseminated, or sold to
              any third parties. This information may be used, without personal identifying
              information, to report demographic data in grant reports and/or scientific
              publication.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>How do we use this information?</Text>
            <Text style={styles.textBody}>We will use the information we collect from you for
              several purposes.
              First, the tree information you provide (your observations) will be added to a
              database for scientists to access. Information (such as tree locations, size, and
              condition) will be available for vetted researchers but not made available to the
              general public. In addition, your contact information may be provided in the event
              that these researchers need to contact you regarding submissions of scientific
              interest. Second, we will work to better service you in responding to your customer
              service requests. As a part of this we may send periodic emails regarding our products
              and services.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>E-mail address</Text>
            <Text style={styles.textBody}>To create an account, you must provide a valid email
              address, which will be used to validate your account and send important information
              about the TreeSnap project. Your email address will not be shown, disseminated, or
              sold to any third parties not affiliated with tree research programs. Your email will
              only be used to manage your TreeSnap account and for the scientists using the TreeSnap
              dataset to contact you with questions regarding your submitted observations.
            </Text>
            <Text style={styles.textBody}>You are able to delete your TreeSnap account or opt out of
              receiving emails at any time.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>How do we use the submitted observations?</Text>
            <Text style={styles.textBody}>All observations submitted to our database will be stored
              on the TreeSnap website. This includes all data and metadata, including GPS
              coordinates, and images. Observation data will be displayed on the TreeSnap website,
              and be made available to outside parties through an API. Observations can be made
              anonymous in the profile settings of the app or website: anonymous observations will
              only be visible to you and the scientists behind TreeSnap.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Images</Text>
            <Text style={styles.textBody}>By submitting photographs using the TreeSnap app, you give
              TreeSnap permission to publish the image on the TreeSnap website and include the image
              in publications, project reports, and /or publicity materials. You grant the TreeSnap
              project a non-exclusive, worldwide license to republish the image in any format
              without limitation.
              Where possible you will receive credit for the reproduction of your photograph in the
              text or caption of your image. We reserve the right to not include a direct
              attribution for whatever reason. </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>How can I manage my privacy settings?</Text>
            <Text style={styles.textBody}>Your privacy settings can be changed in the settings
              section of the mobile app. Changing your submissions to anonymous will prevent them
              from being displayed on the TreeSnap web portal to other users or the general public.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Will this policy change?</Text>
            <Text style={styles.textBody}> As TreeSnap evolves, we may make changes to our data
              usage and privacy policy. We will never show, sell, or disseminate your personal
              information to any outside parties not affiliated with tree research programs.
              Users will receive an email notification upon any change to the privacy policy if they
              have not opted out of email notifications.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Terms of Use</Text>
            <Text style={styles.textBody}> By using this app you agree that you will not collect
              observations for trees on private land without permission. Observations may only be
              submitted for trees on public land, trees on the user's own private land, or trees on
              other private land for which the user has obtained all necessary permissions from the
              private land owner.
            </Text>
            <Text style={styles.textBody}>
              By submitting observations using the TreeSnap app, you affirm that the tree is on
              public land, or that you own the private land the tree is located on or have
              permission to use the private land.</Text>
            <Text style={styles.textBody}>
              All data submitted to the TreeSnap server is considered the property of TreeSnap and
              subject to TreeSnap data licensing. Data stripped of identifying material may be
              included in promotional material or scientific publication. Upon publication, all data
              will be made available via our API according to our data licensing policy.
            </Text>
          </View>

        </ScrollView>
      </View>
    )
  }
}

PrivacyPolicyScreen.propTypes = {
  navigator: PropTypes.object.isRequired
}

const styles = StyleSheet.create({

  container: {
    flex           : 1,
    backgroundColor: '#f5f5f5'
  },

  scrollView: {
    flex           : 1,
    paddingVertical: 5
  },

  card: {
    ...(new Elevation(2)),
    backgroundColor: '#fff',
    padding        : 10,
    margin         : 5,
    borderRadius   : 2
  },

  title: {
    color     : '#222',
    fontWeight: '500',
    fontSize  : 16
  },

  textBody: {
    color     : '#444',
    fontSize  : 14,
    lineHeight: 20,
    marginTop : 10
  }
})
