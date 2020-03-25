import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CreateAccount from './CreatePortal';
import UpdateAccount from './UpdateClientProfile';

const Pages = createStackNavigator();

//Search User Navigation Code

function ProfileNav() {
  return (
    <NavigationContainer>
      <Pages.Navigator
        initialRouteName="MainProfile"
        screenOptions={{headerShown: true}}>
        <Pages.Screen name="CreateAccount" component={CreateAccount} />
        <Pages.Screen name="UpdateAccount" component={UpdateAccount} />
      </Pages.Navigator>
    </NavigationContainer>
  );
}

export default ProfileNav;
