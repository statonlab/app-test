import AndroidStatusBar from '../app/components/AndroidStatusBar'

jest.mock('Platform', () => {
  const Platform = require.requireActual('Platform')
  Platform.OS    = 'android'
  return Platform
})

describe('returns a status bar dimension', () => {
  it('should return 20 by default', () => {
    expect(AndroidStatusBar.get()).toBe(20)
  })

  it('should return 20 for width 240', () => {
    AndroidStatusBar.width = 240
    expect(AndroidStatusBar.get()).toBe(20)
  })

  it('should return 25 for width 320', () => {
    AndroidStatusBar.width = 320
    expect(AndroidStatusBar.get()).toBe(25)
  })

  it('should return 38 for width 480', () => {
    AndroidStatusBar.width = 480
    expect(AndroidStatusBar.get()).toBe(38)
  })
})
