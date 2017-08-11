import {Platform} from 'react-native'
import realm from '../db/Schema'
import File from '../helpers/File'

class Diagnostics {
  constructor() {
    this.fs       = new File()
    this._android = Platform.OS === 'android'
  }

  run() {
    const observations = realm.objects('Submission')
    observations.map(async observation => {
      let images = JSON.parse(observation.images)
      try {
        let fixed = await this._fixBrokenImages(images)
        realm.write(() => {
          observation.images = JSON.stringify(fixed)
        })
      } catch (error) {
        console.log(error)
      }
    })
  }

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
              throw Error(error)
            }

            // Make sure a thumbnail is created
            this._fixThumbnail(image)

            return image
          }))
        } catch (error) {
          throw new Error(error)
        }
      }))
    } catch (error) {
      throw new Error(error)
    }

    return fixed
  }

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