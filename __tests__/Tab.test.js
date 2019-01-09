import React from 'react';
import Tab from '../app/components/subcomponents/Tab'
import renderer from 'react-test-renderer'

describe('it renders correctly', () => {
  it('should match a tab snapshot', () => {
    const tree = renderer.create(<Tab title={'Test Title'}/>).toJSON();
    expect(tree).toMatchSnapshot();
  })
})
