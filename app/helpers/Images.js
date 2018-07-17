import React from 'react'
import {Platform} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import File from './File'

export default class Images {
  static errors = 0

  constructor() {
    this.file    = new File()
    this.android = Platform.OS === 'android'
  }

  /**
   * Compress an image.
   *
   * @param path uncompressed image path
   * @return {Promise<*>} String: image new path
   */
  async compress(path) {
    const maxHeight = 1000
    const maxWidth  = 1000

    try {
      let quality = 100
      let {uri}   = await ImageResizer.createResizedImage(path, maxWidth, maxHeight, 'JPEG', quality, 0, this.file._imagesDir)
      let name    = this.makeName(path)
      let newPath = `${this.file._imagesDir}/${name}`

      await this.file.moveAsync(uri.replace('file:', '').replace('///', '/'), newPath)
      await this.file.deleteAsync(path)

      return newPath
    } catch (error) {
      console.log('Unable to compress image', error)
      return path
    }
  }

  async compressAll(images) {
    let newImages = {}

    for (let i in images) {
      if (!images.hasOwnProperty(i)) {
        continue
      }

      newImages[i] = []

      for (let j in images[i]) {
        if (!images[i].hasOwnProperty(j)) {
          continue
        }

        if (images[i][j].indexOf('.min.') > -1) {
          newImages[i].push(images[i][j])
        } else {
          let img = await this.compress(images[i][j])
          newImages[i].push(img)
        }
      }
    }

    return newImages
  }

  makeName(path) {
    let name = path.split('/')
    name     = name[name.length - 1]

    let extension = name.split('.')

    name      = extension[0]
    extension = extension[extension.length - 1]

    return `${name}.min.${extension}`
  }
}
