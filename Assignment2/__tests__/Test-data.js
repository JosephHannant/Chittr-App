'use strict';

exports.workingUserData = function() {
  return [
    {
      testDescription: 'User a a login credentials',
      email: 'a@a.co',
      password: 'a',
      userid: 0,
      token: '',
    },
    {
      testDescription: 'User b b login credentials',
      email: 'b@b.co',
      password: 'b',
      userid: 0,
      token: '',
    },
  ];
};

exports.failingUserData = function() {
  return [
    {
      testDescription: 'User a a login credentials',
      email: 'a@a.co',
      password: 'b',
      userid: 0,
      token: '',
    },
    {
      testDescription: 'User b b login credentials',
      email: 'b@b.co',
      password: 'a',
      userid: 0,
      token: '',
    },
  ];
};

exports.searchInfo = function() {
  return [
    {
      testDescription: 'Search for a',
      query: 'a',
    },
    {
      testDescription: 'search for b',
      query: 'b',
    },
  ];
};

exports.asyncStore = function() {
  return [
    {
      testDescription: 'Store value in async',
      query: 'a',
    },
    {
      testDescription: 'Store value in async',
      query: '2',
    },
  ];
};
