import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScr from './Tabs/HomeScreen';
import Profpor from './Tabs/ClientProfile';
import SettingsPor from './Tabs/UserProfileNav';
import SearchUsers from './Tabs/SearchUsers';
import PostNav from './Tabs/PostNav';
const NavigationPortal = createBottomTabNavigator({
  Home: {
    screen: HomeScr,
  },
  Post: {
    screen: PostNav,
  },
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
