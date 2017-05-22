import React from 'react'
import {DeviceEventEmitter, Platform} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import FS from 'react-native-fetch-blob'
import realm from '../db/Schema'

export default class File {
  constructor() {
    this._system        = FS.fs
    this._imagesDir     = `${this._system.dirs.DocumentDir}/images`
    this._thumbnailsDir = `${this._system.dirs.DocumentDir}/thumbnails`
    this._processed     = 0
    this._images        = {}
    this._android       = Platform.OS === 'android'

    this._setup()
  }

  /**
   * Setup filesystem directories for images and thumbnails if they don't exist.
   *
   * @private
   */
  _setup() {
    this.isDirectory(this._imagesDir).then(exists => {
      if (exists) {
        return
      }

      this._system.mkdir(this._imagesDir).then(() => {
        // Done
      }).catch(error => {
        console.log(error)
      })
    })

    this.isDirectory(this._thumbnailsDir).then(exists => {
      if (exists) {
        return
      }

      this._system.mkdir(this._thumbnailsDir).then(() => {
        // Done
      }).catch(error => {
        console.log(error)
      })
    })
  }

  /**
   * Check if file exists.
   *
   * @param file
   * @returns {Promise.<bool>}
   */
  async exists(file) {
    return await this._system.exists(file)
  }

  /**
   * Check if file path is a directory.
   *
   * @param file
   * @returns {Promise.<bool>}
   */
  async isDirectory(file) {
    return await this._system.isDir(file)
  }

  /**
   * Copy files.
   *
   * @param from original file path
   * @param to new copy path
   * @param callback Function to call on success
   */
  copy(from, to, callback) {
    this._system.cp(from, to).then(() => {
      if (typeof  callback !== 'undefined') {
        callback()
      }
    }).catch(error => {
      console.log('Could not copy file ' + filePath + ': ', error)
    })
  }

  /**
   * Delete file.
   *
   * @param file File path to delete
   * @param callback Function to call on success
   */
  delete(file, callback) {
    let count     = 0
    let processed = 0

    if (typeof file === 'string') {
      this._system.unlink(file.replace('file:', '')).then(() => {
        if (typeof  callback !== 'undefined') {
          callback()
        }
      }).catch(error => {
        console.log('Could not delete file ' + file + ': ', error)
      })

      return
    }

    if (typeof file === 'object') {
      let keys = Object.keys(file)

      // We need a count to know if there is anything to delete
      keys.map(key => {
        count += file[key].length
      })

      if (count === 0) {
        typeof callback !== 'undefined' && callback()
      }

      keys.map(key => {
        if (!Array.isArray(file[key])) {
          return
        }

        file[key].map(f => {
          // Increment the count.
          this._system.unlink(f.replace('file:', '')).then(() => {
            // Increment the number of deleted items.
            processed++
            // If all files have been deleted, run the callback.
            if (processed === count && typeof callback !== 'undefined') {
              callback()
            }
          }).catch(error => {
            // We still want the number of deleted items increased even in failure because
            // we will never execute the callback if we fail.
            processed++
            console.log(error)
          })
        })
      })
    }
  }

  /**
   * Move file.
   *
   * @param from file path to move
   * @param to new path to move to
   * @param callback Function to call on success
   */
  move(from, to, callback) {
    this._system.mv(from, to).then(() => {
      if (typeof  callback !== 'undefined') {
        callback()
      }
    }).catch(error => {
      console.log('Could not move file from ' + from + ' to ' + to + ': ', error)
    })
  }

  /**
   * Download all images for an observation. This function will only download images
   * that haven't been downloaded previously.
   *
   * @param observation
   */
  download(observation) {
    let images    = JSON.parse(observation.images)
    let keys      = Object.keys(images)
    let count     = 0
    let processed = 0

    keys.map(key => {
      count += images[key].length
    })

    keys.map(key => {
      images[key].map((link, index) => {
        this._setupImage(link, (image) => {
          processed++
          images[key][index] = image
          if (processed === count) {
            realm.write(() => {
              observation.images = JSON.stringify(images)
            })
          }
        })
      })
    })
  }

  /**
   * Resize a list of images.
   *
   * @param images
   */
  resizeImages(images) {
    let total       = 0
    this._processed = 0
    this._images    = images

    // Calculate the number of images in the array
    Object.keys(images).map(key => {
      total += images[key].length
    })

    // Deal with empty images object
    if (total === 0) {
      DeviceEventEmitter.emit('imagesResized', this._images)
    }

    Object.keys(images).map(key => {
      images[key].map((image, index) => {
        this._setupImage(image, new_image => {
          this._images[key][index] = new_image
          this.delete(image)
          this._processed++
          if (this._processed === total) {
            DeviceEventEmitter.emit('imagesResized', this._images)
            console.log(this._images)
          }
        })
      })
    })
  }

  /**
   * Get the thumbnail path.
   *
   * @param image
   * @returns {string}
   */
  thumbnail(image) {
    if (typeof image !== 'string') {
      return
    }

    // Get image name
    let name = image.split('/')
    name     = name[name.length - 1]

    let prefix = this._android ? 'file:' : ''

    return `${prefix}${this._thumbnailsDir}/${name}`
  }

  /**
   * Resize image to create thumbnail.
   *
   * @param image path to image
   * @param callback (image, thumbnail) gets called on success
   * @private
   */
  _setupImage(image, callback) {
    ImageResizer.createResizedImage(image, 1000, 1000, 'JPEG', 100, 0, this._imagesDir).then(full_image => {
      this._setupThumbnail(full_image)

      if (typeof  callback !== 'undefined') {
        callback(full_image)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * Resize thumbnail.
   *
   * @param image
   * @private
   */
  _setupThumbnail(image) {
    // Get image name
    let name = image.split('/')
    name     = name[name.length - 1]

    ImageResizer.createResizedImage(image, 160, 160, 'JPEG', 100, 0, this._thumbnailsDir).then(thumbnail => {
      // Let it have the same name of the original image
      this.move(thumbnail.replace('file:', ''), `${this._thumbnailsDir}/${name}`)
    }).catch((error) => {
      console.log(error)
    })
  }
}
