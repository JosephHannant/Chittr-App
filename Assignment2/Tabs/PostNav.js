import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//import Camera from './Camera';
import Posting from './PostChits';

const Pages = createStackNavigator();

//Search User Navigation Code

function PostNav() {
  return (
    <NavigationContainer>
      <Pages.Navigator
        initialRouteName="Post"
        screenOptions={{headerShown: true}}>
        <Pages.Screen name="Post" component={Posting} />
      </Pages.Navigator>
    </NavigationContainer>
  );
}
//<Pages.Screen name="Camera" component={Camera} />
export default PostNav;
