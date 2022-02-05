// React
import React from 'react';

// React-Native
import {
  NativeEventEmitter,
StyleSheet,
View,
} from 'react-native';
import PLXScanBluetooth from './PLX-ScanBluetooth';
import ScanBluetooth from './ScanBluetooth';

interface ConnectDeviceProps {
  bleManagerEmitter?: NativeEventEmitter;
  connectedDevice: any;
  setConnectedDevice: (peripheral: any) => void;
}

const ConnectDevice = ({ bleManagerEmitter, connectedDevice, setConnectedDevice } : ConnectDeviceProps) => {
  return (
    <View style={styles.view}>
      {/* <ScanBluetooth bleManagerEmitter={bleManagerEmitter} connectedDevice={connectedDevice} setConnectedDevice={setConnectedDevice}/>       */}
      <PLXScanBluetooth connectedDevice={connectedDevice} setConnectedDevice={setConnectedDevice}/>      
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderTopWidth: 0.5,
  },
});

export default ConnectDevice;
 