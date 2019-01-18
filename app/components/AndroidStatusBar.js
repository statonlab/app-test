import { Dimensions, Platform } from 'react-native'

class AndroidStatusBar {
  constructor() {
    this.width = Dimensions.get('window').width
  }

  get() {
    if (Platform.OS !== 'android') {
      return 0
    }

    switch (this.width) {
      case 240:
        return 20
        break
      case 320:
        return 25
        break
      case 480:
        return 38
        break
      default:
        return 20
    }
  }
}

export default new AndroidStatusBar()
