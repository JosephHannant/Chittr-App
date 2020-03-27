import {AppRegistry, StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScr from './Tabs/HomeScreen';
import Profpor from './Tabs/ClientProfile';
import SettingsPor from './Tabs/UserProfileNav';
import Postpor from './Tabs/PostChits';
//import Camera from './Tabs/Camera';
import SearchUsers from './Tabs/SearchUsers';
const NavigationPortal = createBottomTabNavigator({
  Home: {
    screen: HomeScr,
  },
  Post: {
    screen: Postpor,
  },
//   Camera: {
//     screen: Camera,
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
