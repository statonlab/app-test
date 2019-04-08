import config from '../app/resources/FormElements'

describe('it returns the correct config', () => {
  it('should match the config snapshot', () => {
    expect(config).toMatchSnapshot()
  })
})
