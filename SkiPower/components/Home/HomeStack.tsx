// React
import React from 'react';

// React-Native
import {
  StyleSheet,
} from 'react-native';

// Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import HomePage from './HomePage';
import AllActivities from './AllActivities';
import ActivityDetailsContainer from './ActivityDetailsContainer';

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator 
      initialRouteName="HomePage"
      screenOptions={{headerTitleAlign: 'center', }}>
      <Stack.Screen name="HomePage" options={{headerShown: false}}>
        {() => <HomePage navigation={navigation}/>}
      </Stack.Screen>
      <Stack.Screen name="AllActivities" options={{title: "Activities"}}>
        {() => <AllActivities navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsContainer} options={{ title: 'Activity'}} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
});

export default HomeStack;
 