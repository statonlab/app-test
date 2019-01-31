import React from 'react'
import DeviceInfo from 'react-native-device-info'
// Language files can be imported here
// import en from '../lang/en.js'
// import es from '../lang/es.js'

export class Lang {
  constructor() {
    this.language = DeviceInfo.getDeviceLocale()
    this.languages = {
      // en,
      // es
    }
  }

  translate(str) {
    return str
  }
}

const lang = new Lang()

export default function T(str) {
  return lang.translate(str)
}
