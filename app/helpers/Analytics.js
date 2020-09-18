import firebase from 'react-native-firebase'
import realm from '../db/Schema'

export default class Analytics {
  /**
   * Analytics Constructor.
   */
  constructor() {
    // try {
    //   this.ga     = firebase.analytics()
    //   const users = realm.objects('User')
    //   if (users.length === 0) {
    //     this.user = false
    //   } else {
    //     this.user = users[0].id
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  /**
   * User visited page event.
   *
   * @param name
   */
  visitScreen(name) {
    // try {
    //   if (this.user !== false) {
    //     this.ga.setUserId(this.user)
    //   }
    //   this.ga.setCurrentScreen(name, name)
    // } catch (error) {
    //   console.log(error)
    // }
  }

  /**
   * User registered event.
   *
   * @param user_id
   */
  registered(user_id) {
    // try {
    //   this.ga.logEvent('registered', {
    //     user_id
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
  }

  /**
   * User logged in event.
   *
   * @param user_id
   */
  loggedIn(user_id) {
    // try {
    //   this.ga.logEvent('logged_in', {
    //     user_id
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
  }

  /**
   * Log observation submission.
   *
   * @param {Object} observation
   * @param {moment} timeStarted
   * @param {moment} timeEnded
   */
  submittedObservation(observation, timeStarted, timeEnded) {
    // const duration = Math.abs(timeEnded.diff(timeStarted, 'seconds'))
    // const metaData = JSON.parse(observation.meta_data)
    // try {
    //   this.ga.logEvent('submitted_observation', {
    //     tree: observation.name === 'Other' ? `${observation.name} (${metaData.otherLabel})` : observation.name,
    //     time_started: timeStarted,
    //     time_ended: timeEnded,
    //     duration: duration
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
  }

  /**
   * Record a share event.
   *
   * @param observation
   */
  shared(observation) {
    // try {
    //   this.ga.logEvent('share', {
    //     CONTENT_TYPE: 'observation',
    //     ITEM_ID: observation.serverID
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
  }
}
