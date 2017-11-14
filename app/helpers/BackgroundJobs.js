import React from 'react'
import {NetInfo} from 'react-native'
import BackgroundTask from 'react-native-background-task'
import Observation from '../helpers/Observation'
import realm from '../db/Schema'

export default class BackgroundJobs {
  /**
   * Initiate background jobs
   */
  init() {
    try {
      BackgroundTask.define(() => {
        // Run the background task only if the user has wifi connection
        NetInfo.getConnectionInfo().then(connectionInfo => {
          if (connectionInfo.type.toLowerCase() === 'wifi') {
            this.execute()
            return
          }

          BackgroundTask.finish()
        })
      })

      BackgroundTask.schedule({
        // Run once every 30 minutes
        period: 1800
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Execute the job.
   *
   * @return {Promise.<void>}
   */
  async execute() {
    try {
      await this.syncObservations()
      BackgroundTask.finish()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Sync unsynced observations.
   *
   * @return {Promise.<void>}
   */
  async syncObservations() {
    let observations = realm.objects('Submission').filtered('synced == false')
    let unsynced     = observations.length
    if (unsynced > 0) {
      for (let key in observations) {
        try {
          let response = await Observation.upload(observations[key])
          realm.write(() => {
            observation.synced         = true
            observation.observation_id = response.data.data.observation_id
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
