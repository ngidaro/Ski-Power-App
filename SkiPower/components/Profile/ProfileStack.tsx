// React
import React from 'react';

// React-Native
import {
  StyleSheet,
} from 'react-native';

// Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './Profile';
import Settings from './Settings';

// Components

const Stack = createNativeStackNavigator();

const ProfileStack = ({ navigation }) => {
  return (
    <Stack.Navigator 
      initialRouteName="Profile"
      screenOptions={{headerTitleAlign: 'center', }}>
      <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
});

export default ProfileStack;
 