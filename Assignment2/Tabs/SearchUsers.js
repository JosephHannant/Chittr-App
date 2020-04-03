/*
  Author Joseph Hannant
  This is the screen that deals with the navigation of the search pages
*/
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Search from './Search';
import userProfiles from './ProfileView';
import userFollowers from './follow/FollowerList';
import userFollowing from './follow/FollowingList';
import userChits from './follow/UserChits';

const Pages = createStackNavigator();

//Stack navigation hub for search pages

function SearchNav() {
  return (
    <NavigationContainer>
      <Pages.Navigator
        initialRouteName="Search"
        screenOptions={{headerShown: true}}>
        <Pages.Screen name="Search" component={Search} />
        <Pages.Screen name="UserProfiles" component={userProfiles} />
        <Pages.Screen name="UserFollowers" component={userFollowers} />
        <Pages.Screen name="UserFollowing" component={userFollowing} />
        <Pages.Screen name="UserChits" component={userChits} />
      </Pages.Navigator>
    </NavigationContainer>
  );
}

export default SearchNav;
