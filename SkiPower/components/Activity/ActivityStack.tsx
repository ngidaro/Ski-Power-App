// React
import React from 'react';

// React-Native
import {
  StyleSheet,
} from 'react-native';
import Activity from './Activity';

// Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectDevice from './Bluetooth/ConnectDevice';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Text } from 'react-native-elements';

const Stack = createNativeStackNavigator();

const ActivityStack = ({ navigation }) => {

  const navigateTo = () => navigation.navigate("ConnectDevice")

  return (
    <Stack.Navigator 
      initialRouteName="Activity">
      <Stack.Screen name="Activity" component={Activity} options={{headerRight: () => (
        <Text onPress={navigateTo} style={styles.connect}>Connect</Text>
      )}} />              
      <Stack.Screen name="ConnectDevice" component={ConnectDevice} options={{title: "Connect a Device"}}/>              
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  connect: {
    color: "blue"
  }
});

export default ActivityStack;
 