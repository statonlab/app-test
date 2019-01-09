import React from 'react'
import AdvancedSettingsModal from '../app/components/AdvancedSettingsModal'
import renderer from 'react-test-renderer'

describe('it renders correctly', () => {
  it('should match an AdvancedSettingsModal snapshot', () => {
    const tree = renderer.create(<AdvancedSettingsModal visible={true}
                                                        onChange={jest.fn()}
                                                        onRequestClose={jest.fn()}
                                                        initialValues={{}}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
