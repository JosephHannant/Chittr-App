import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScr from './Tabs/HomeScreen'
import LoginPor from './Tabs/LoginPortal'
import CreatePor from './Tabs/CreatePortal'
const NavigationPortal = createBottomTabNavigator({
    Home: {
        screen: HomeScr
    },
    Login: {
        screen: LoginPor
    },
    Create: {
        screen:CreatePor
    }
});

const Container = createAppContainer(NavigationPortal)

export default Container;