/*
  Author Joseph Hannant
  This is the screen that deals with the navigation of the post pages
*/
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Camera from './Camera';
import Posting from './PostChits';
import PostH from './PostHome';
import Drafts from './Draft/Draft';
import DraftView from './Draft/DraftView';

const Pages = createStackNavigator();

//Stack navigation hub for the post pages

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
export default PostNav;
