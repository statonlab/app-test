import {Platform} from 'react-native'
import realm from '../db/Schema'
import File from '../helpers/File'
import Observation from './Observation'

class Diagnostics {
  constructor() {
    this.fs       = new File()
    this._android = Platform.OS === 'android'
  }

  /**
   * Compress all uncompressed observations and
   * fix images for observations that may have
   * their images still in cache.
   */
  async run() {
    const observations = realm.objects('Submission')//.filtered('imagesFixed = false OR compressed = false')
    for (let i in observations) {
      if (!observations.hasOwnProperty(i)) {
        continue
      }

      try {
        let observation = observations[i]
        await this._fixObservation(observation)
        await this._compressObservation(observation)
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * Compress observation images.
   *
   * @param observation
   * @return {Promise<void>}
   * @private
   */
  async _compressObservation(observation) {
    if (!observation.compressed) {
      await Observation.compressImages(observation)
      realm.write(() => {
        observation.compressed = true
      })
    }
  }

  /**
   * Fix each observation asynchronously.
   *
   * @param observation
   * @returns {Promise.<null>}
   * @private
   */
  async _fixObservation(observation) {
    let images = JSON.parse(observation.images)
    try {
      let fixed = await this._fixBrokenImages(images)
      realm.write(() => {
        observation.images = JSON.stringify(fixed)
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Fix broken images.
   *
   * @param {Array} images List of images
   * @returns {Promise.<{}>}
   * @private
   */
  async _fixBrokenImages(images) {
    let fixed = {}

    try {
      await Promise.all(Object.keys(images).map(async (key) => {
        let singleSet = images[key]
        try {
          fixed[key] = await Promise.all(singleSet.map(async image => {
            // Make sure path is in images directory
            try {
              image = await this._fixPath(image)
            } catch (error) {
              throw error
            }

            // Make sure a thumbnail is created
            this._fixThumbnail(image)

            return image
          }))
        } catch (error) {
          throw error
        }
      }))
    } catch (error) {
      throw error
    }

    return fixed
  }

  /**
   * Fix the path of an image and download the image if necessary.
   *
   * @param {String} image Path to the image
   * @returns {Promise.<*>}
   * @private
   */
  async _fixPath(image) {
    let name   = this._extractName(image)
    let path   = `${this.fs._imagesDir}/${name}`
    let exists = false

    try {
      exists = await this.fs.exists(path)
    } catch (error) {
      throw new Error(error)
    }

    if (exists) {
      return path
    }

    // Download image if not yet downloaded
    if (image.indexOf('http') > -1) {
      let path = await this.fs.downloadImage(image)
      return await this._moveToImages(path, image)
    }

    // Move the image to permanent storage if it is not there already
    if (image.indexOf('/images/') === -1) {
      // Move image to images directory and return the new path
      return await this._moveToImages(image)
    }

    // All is good return the correct path
    return image
  }

  /**
   * Move the images to the permanent directory.
   *
   * @param {String} image Path to the image
   * @param {String} url If provided the name will be extracted from the url
   * @returns {Promise.<string>}
   * @private
   */
  async _moveToImages(image, url) {
    let name = this._extractName(image, url)
    let path = `${this.fs._imagesDir}/${name}`

    if (typeof url !== 'undefined' || !this._android) {
      try {
        await this.fs._system.mv(image.replace('file:', ''), path)
      } catch (error) {
        throw new Error(error)
      }
    } else {
      // For android users, attempt copying the asset if it has been
      // captured by camera and not recently downloaded
      try {
        await this.fs._system.cp(image.replace('file:', ''), path)
      } catch (error) {
        throw new Error(error)
      }
    }

    return path
  }

  /**
   * Create thumbnail if missing.
   *
   * @param {String} image Path of the image
   * @param {String} url If provided the name will be extracted from the url
   * @returns {Promise.<string>}
   * @private
   */
  async _fixThumbnail(image, url) {
    let name          = this._extractName(image, url)
    let thumbnailPath = `${this.fs._thumbnailsDir}/${name}`
    let imagePath     = `${this.fs._imagesDir}/${name}`

    let thumbnailExists = await this.fs.exists(thumbnailPath)
    let imageExists     = await this.fs.exists(imagePath)

    if (!thumbnailExists && imageExists) {
      try {
        this.fs._setupThumbnail(image)
      } catch (error) {
        throw new Error(error)
      }
    }

    return thumbnailPath
  }

  /**
   * Extract the name of the image.
   *
   * @param {String} image Path of the image
   * @param {String} url If provided the name will be extracted from the url
   * @returns {*}
   * @private
   */
  _extractName(image, url) {
    let name
    if (typeof url !== 'undefined') {
      name = url.split('/')
    } else {
      name = image.split('/')
    }
    return name[name.length - 1]
  }
}

export default new Diagnostics()
