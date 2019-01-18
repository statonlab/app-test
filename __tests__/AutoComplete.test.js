import React from 'react';
import AutoComplete from '../app/components/AutoComplete'
import renderer from 'react-test-renderer'

describe('it renders correctly', () => {
  it('should match an AutoComplete snapshot', () => {
    const tree = renderer.create(<AutoComplete />).toJSON();
    expect(tree).toMatchSnapshot();
  })
})
