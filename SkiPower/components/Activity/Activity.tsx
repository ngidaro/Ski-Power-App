// React
import React from 'react';

// React-Native
import {
  Platform,
StyleSheet,
View,
} from 'react-native';
import { Text } from 'react-native-elements';

// Components
import Timer from './Timer';
import Icon from 'react-native-vector-icons/FontAwesome';

// Bluetooth
// import BleManager from '../../bluetooth/BleManager';
import { BleManager } from 'react-native-ble-plx';
import { Device } from 'react-native-ble-plx';
import { useActivity } from './hooks';

export interface ActivityProps {
  route?: any;
  navigation?: any;
  connectedDevice: Device | null;
  setConnectedDevice: (device: Device | null) => void;
}

export const bleManager = new BleManager();

const Activity = (props) => {
  const { 
    isRecording, 
    timer,
    setTimer,
    navigation,
    connectedDevice,
    setIsRecording,
   } = useActivity(props);

  return (
    <View style={styles.view}>
      <View style={styles.bluetoothView}>
        <Icon onPress={() => navigation.navigate("ConnectDevice")} style={styles.bluetoothIcon} name="bluetooth-b" color={'blue'}/>
      </View>
      <View style={styles.titleView}>
        <Text style={styles.textName}>Record Activity</Text>
        <View style={styles.connectDevicesView}>
          {connectedDevice ? <Text>Connected to {connectedDevice?.name}</Text> : <Text>No Devices Connected</Text>}
        </View>
      </View>
      <View style={styles.timer}>
        <Timer 
          isRecording={isRecording} 
          setIsRecording={() => setIsRecording(!isRecording)} 
          timer={timer}
          setTimer={setTimer}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',    
    width: '100%',
    height: '100%',
  },
  titleView: {
    position: 'absolute',
    top: 56,
    left: 16, 
    width: '100%',
  },
  textName: {
    fontSize: 32,
    fontFamily: 'Arial Rounded MT Bold',
  },
  bluetoothView: {
    position: 'absolute',
    top: 32,
    right: 16, 
  },
  bluetoothIcon: {
    fontSize: 24,
  },
  connectDevicesView: {
    top: 16,
    left: -16,
    opacity: 0.5,
    alignItems: 'center',
  },
  timer: {
    position: 'absolute',
    bottom: 16,
  },
});

export default Activity;
 