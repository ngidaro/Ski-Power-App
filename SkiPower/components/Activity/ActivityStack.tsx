// React
import React, { useState } from 'react';

// React-Native
import {
  // NativeEventEmitter,
  // NativeModules,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-elements';

// Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import ConnectDevice from './Bluetooth/ConnectDevice';
import Activity from './Activity';

const Stack = createNativeStackNavigator();

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ActivityStack = ({ navigation }) => {

  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  // Will need to connect 2 ESP32's
  const [connectedDevice2, setConnectedDevice2] = useState<any>();

  const navigateTo = () => navigation.navigate("ConnectDevice");

  return (
    <Stack.Navigator 
      initialRouteName="Activity"
      screenOptions={{headerTitleAlign: 'center', }}>
      <Stack.Screen name="Activity" options={{headerRight: () => (
        <Text onPress={navigateTo} style={styles.connect}>Connect</Text>
      ) , headerShown: false}}>
        {() => <Activity navigation={navigation} connectedDevice={connectedDevice} setConnectedDevice={setConnectedDevice}/>}
      </Stack.Screen>
      <Stack.Screen name="ConnectDevice" options={{title: "Connect a Device"}}>
        {/* {() => <ConnectDevice bleManagerEmitter={bleManagerEmitter} connectedDevice={connectedDevice} setConnectedDevice={setConnectedDevice}/>} */}
        {() => <ConnectDevice connectedDevice={connectedDevice} setConnectedDevice={setConnectedDevice}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({  
  connect: {
    color: "blue"
  },
});

export default ActivityStack;
 