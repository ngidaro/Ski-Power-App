// React
import * as React from 'react';

// React-Native
import Icon from 'react-native-vector-icons/FontAwesome';

// Services
import { AuthenticationService } from '../services/authentication.service';

// Components
import LoginPage from './LoginPage/LoginPage';
import ActivityStack from './Activity/ActivityStack';
import HomeStack from './Home/HomeStack';
import ProfileStack from './Profile/ProfileStack';

// Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NavigationStack = () => {

  const tabBarIcon = (route: RouteProp<ParamListBase, string>, focused: boolean, color: string, size: number) => {
    let icon: string = '';
    if(route.name === "HomeStack") {
      icon = 'home';
    } else if (route.name === "ActivityStack") {
      icon = 'plus'
    } else if (route.name === "ProfileStack") {
      icon = 'user-circle'
    }
    return <Icon name={icon} size={size} color={color} />
  }

  return (
    <React.Fragment>
      <Stack.Navigator
        initialRouteName={"Login"}
        screenOptions={{headerTitleAlign: 'center', }}>
          <Stack.Screen name="Login" options={{ headerShown: false }} >
            {(props) => <LoginPage {...props} />}
          </Stack.Screen>
          <Stack.Screen name="LoggedIn" options={{ headerShown: false }}>
            {() =>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size}) => tabBarIcon(route, focused, color, size)
                })}>
                <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: "Home", headerShown: false }} />
                <Tab.Screen name="ActivityStack" component={ActivityStack} options={{ title: "Activity", headerShown: false }} />
                <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: "Profile", headerShown: false }} />
              </Tab.Navigator>
            }
          </Stack.Screen>
      </Stack.Navigator>
    </React.Fragment>
  );
};

export default NavigationStack;