import {AppRegistry, StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScr from './Tabs/HomeScreen';
import SearchPor from './Tabs/Search';
import Profpor from './Tabs/ClientProfile';
import SettingsPor from './Tabs/UserProfileNav';
import Postpor from './Tabs/PostNav';
import SearchUsers from './Tabs/SearchUsers';
const NavigationPortal = createBottomTabNavigator({
  Home: {
    screen: HomeScr,
  },
  //   Create: {
  //     screen: CreatePor,
  //   },
  Post: {
    screen: Postpor,
  },
  //   Search: {
  //     screen: SearchPor,
  //   },
  Search: {
    screen: SearchUsers,
  },
  Profile: {
    screen: Profpor,
  },
  Settings: {
    screen: SettingsPor,
  },
});

const Container = createAppContainer(NavigationPortal);

export default Container;
