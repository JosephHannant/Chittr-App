import 'react-native';
import React from 'react';
import Post from '../Tabs/PostHome';
import renderer from 'react-test-renderer';

test('Login render', () => {
  const snap = renderer.create(<Post />).toJSON();

  expect(snap).toMatchSnapshot();
});
