// import 'react-native';
// import React from 'react';
// import Login from '../Tabs/ClientProfile';
// import renderer from 'react-test-renderer';
// import testData from './Test-data';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// let loginInput = testData.workingUserData();

// chai.use(chaiHttp);
// const servURL = 'http://localhost:3333/api/v0.0.5';

// describe('Test user login/logout.', function() {
//   /*
//      Successful login
//      */
//   it('Login with correct credentials', function() {
//       login.this.testData.
//   });
// });
//Struggled with setting up tests, didnt have time to get functions working
import 'react-native';
import React from 'react';
import Login from '../Tabs/ClientProfile';
import renderer from 'react-test-renderer';

test('Login render', () => {
  const snap = renderer.create(<Login />).toJSON();

  expect(snap).toMatchSnapshot();
});
