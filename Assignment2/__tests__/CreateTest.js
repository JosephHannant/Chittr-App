import 'react-native';
import React from 'react';
import Create from '../Tabs/CreatePortal';
import renderer from 'react-test-renderer';

test('Create render', () => {
  const snap = renderer.create(<Create />).toJSON();

  expect(snap).toMatchSnapshot();
});
