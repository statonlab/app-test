import React from 'react'
import {Image, Platform} from 'react-native'
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
      let {uri}   = await ImageResizer.createResizedImage(path, maxWidth, maxHeight, 'JPEG', quality, 0, this._thumbnailsDir)
      let name    = this.makeName(path)
      let newPath = `${this.file._imagesDir}/${name}`

      this.file.move(uri.replace('file:', '').replace('///', '/'), newPath, () => {
        this.file.delete(path)
      })

      return newPath
    } catch (error) {
      console.log('Unable to compress image', error)
      return path
    }
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
