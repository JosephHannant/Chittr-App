import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CreateAccount from './CreatePortal';
import UpdateAccount from './UpdateClientProfile';
import UpdateUserPhoto from './UpdateDP';

const Pages = createStackNavigator();

//Navigation hub for the create and update pages

function ProfileNav() {
  return (
    <NavigationContainer>
      <Pages.Navigator
        initialRouteName="MainProfile"
        screenOptions={{headerShown: true}}>
        <Pages.Screen name="CreateAccount" component={CreateAccount} />
        <Pages.Screen name="UpdateAccount" component={UpdateAccount} />
        <Pages.Screen name="UpdateDP" component={UpdateUserPhoto} />
      </Pages.Navigator>
    </NavigationContainer>
  );
}

export default ProfileNav;
