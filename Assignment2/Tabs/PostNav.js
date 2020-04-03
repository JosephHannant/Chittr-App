import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Camera from './Camera';
import Posting from './PostChits';
import PostH from './PostHome';
import Drafts from './Draft/Draft';
import DraftView from './Draft/DraftView';

const Pages = createStackNavigator();

//Search User Navigation Code

function PostNav() {
  return (
    <NavigationContainer>
      <Pages.Navigator
        initialRouteName="PostH"
        screenOptions={{headerShown: true}}>
        <Pages.Screen name="PostH" component={PostH} />
        <Pages.Screen name="Post" component={Posting} />
        <Pages.Screen name="Cam" component={Camera} />
        <Pages.Screen name="Drafts" component={Drafts} />
        <Pages.Screen name="DraftView" component={DraftView} />
      </Pages.Navigator>
    </NavigationContainer>
  );
}
//<Pages.Screen name="Camera" component={Camera} />
export default PostNav;
