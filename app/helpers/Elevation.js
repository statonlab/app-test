import {Platform} from 'react-native'

export default class Elevation {
  constructor(level, shadowColor) {
    if (level === 0) {
      return {}
    }

    if (level > 5 || level < 1) {
      throw new Error("Elevation level must be between 1 and 5")
    }

    this.level = level
    this.shadowColor = shadowColor
    return this.get()
  }

  get() {

    if (Platform.OS == 'android') {
      return {
        elevation: this.level
      }
    }

    let iosShadowElevation = {}

    switch (this.level) {
      case 1:
        iosShadowElevation = {
          shadowOpacity: 0.12,
          shadowRadius : 0.8,
          shadowOffset : {
            height: 0.8,
          },
        };
        break;
      case 2:
        iosShadowElevation = {
          shadowOpacity: 0.18,
          shadowRadius : 0.9,
          shadowOffset : {
            height: 1,
          },
        };
        break;
      case 3:
        iosShadowElevation = {
          shadowOpacity: 0.18,
          shadowRadius : 1.4,
          shadowOffset : {
            height: 2,
          },
        };
        break;
      case 4:
        iosShadowElevation = {
          shadowOpacity: 0.18,
          shadowRadius : 2.5,
          shadowOffset : {
            height: 2.8,
          },
        };
        break;
      case 5:
        iosShadowElevation = {
          shadowOpacity: 0.24,
          shadowRadius : 3.2,
          shadowOffset : {
            height: 4,
          },
        };
        break;
      default:
        break;
    }

    iosShadowElevation.zIndex = 5
    iosShadowElevation.shadowColor = this.shadowColor || '#000'

    return iosShadowElevation
  }
}
