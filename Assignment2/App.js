import {AppRegistry, StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScr from './Tabs/HomeScreen';
import LoginPor from './Tabs/LoginPortal';
import CreatePor from './Tabs/CreatePortal';
import SearchPor from './Tabs/Search';
import Profpor from './Tabs/ClientProfile';
const NavigationPortal = createBottomTabNavigator({
  Home: {
    screen: HomeScr,
  },
  Login: {
    screen: LoginPor,
  },
  Create: {
    screen: CreatePor,
  },
  Search: {
    screen: SearchPor,
  },
  Profile: {
    screen: Profpor,
  },
});

const Container = createAppContainer(NavigationPortal);

export default Container;
