// React
import * as React from 'react';

// React-Native
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { Icon } from 'react-native-elements/dist/icons/Icon';

// Services
import { AuthenticationService } from '../services/authentication.service';

// Components
import HomePage from './Home/HomePage';
import LoginPage from './LoginPage/LoginPage';
import Activity from './Activity/Activity';
import Profile from './Profile/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const NavigationStack = () => {

  const [userToken, setToken] = React.useState<string | null>('')

  React.useEffect (() => {
    AuthenticationService.getToken().then((token) => setToken(token));
  },[])

  const tabBarIcon = (route: RouteProp<ParamListBase, string>, focused: boolean, color: string, size: number) => {
    let icon: string = '';
    if(route.name === "Home") {
      icon = 'home';
    } else if (route.name === "Activity") {
      icon = 'add-circle'
    } else if (route.name === "Profile") {
      icon = 'account-circle'
    }
    return <Icon name={icon} size={size} color={color} />
  }

  return (
    <React.Fragment>
      {!userToken 
      ? <LoginPage setToken={setToken}/> 
      // : <Stack.Navigator>
      //     <Stack.Screen name="Home" component={HomePage} />
      //     <Stack.Screen name="Detail" component={Detail} />
      //   </Stack.Navigator>
      : <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size}) => tabBarIcon(route, focused, color, size)
          })}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Activity" component={Activity} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      }
    </React.Fragment>
  );
};

export default NavigationStack;