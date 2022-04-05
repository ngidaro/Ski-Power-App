// React
import React, { useState } from 'react';

// React-Native
import {
StyleSheet,
Text,
View,
TouchableOpacity,
FlatList,
TouchableHighlight,
PermissionsAndroid,
Platform,
} from 'react-native';

// Bluetooth
import { bleManager } from '../Activity';
import { Device } from 'react-native-ble-plx';

// Components
import ListItem from './ListItem';

interface PLXScanBluetoothProps {
  connectedDevice: any;
  setConnectedDevice: (peripheral: Device | null) => void;
}

const PLXScanBluetooth = ({ connectedDevice, setConnectedDevice } : PLXScanBluetoothProps) => {

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedDevices, setScannedDevices] = useState<any[]>([]);

  // Scans available BLT Devices
  async function scanDevices() {
    if (Platform.OS === 'android') {
      // Android
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission Localization Bluetooth',
          message: 'Requirement for Bluetooth',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ).then(result => {
        startDeviceScan();
      });
    } else {
      // iOS
      startDeviceScan();
    }
  }

  const startDeviceScan = () => {
    setIsScanning(true);
    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
      }

      // Devices being Scanned here
      if(scannedDevice?.name !== null) {
        // Check if the scanned device already exists in the list of devices
        if (!Boolean(scannedDevices.filter(device => device.name === scannedDevice?.name).length > 0)) {
          scannedDevices.push(scannedDevice)
        }
      }
    });

    // stop scanning devices after 2 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 2000);
  }

  //Connect the device and start monitoring characteristics
  async function connectDevice(device: Device) {
    setConnectedDevice(device);
  }

  // handle the device disconnection (poorly)
  async function disconnectDevice() {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        bleManager.cancelTransaction('monitortransactionOUT');
        bleManager.cancelTransaction('monitortransactionLoadcell');
        bleManager.cancelTransaction('monitortransactionIMU');
        bleManager.cancelTransaction('monitortransactionGPS');

        bleManager.cancelDeviceConnection(connectedDevice.id).then(() =>
          console.log('DC completed'),
        );
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setConnectedDevice(null);
      }
    }
  }

  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={scanDevices}
        style={styles.scanDevices}>
        <Text>Scan Devices ({isScanning ? 'on' : 'off'})</Text>
      </TouchableOpacity>
      {isScanning ? <Text>Scanning...</Text> :
        <FlatList 
          style={styles.list} 
          data={scannedDevices}
          renderItem={({item, index, separators}) => 
            <TouchableHighlight
              key={item.name}
              onPress={() => connectDevice(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <ListItem name={item?.name} isConnected={item?.name == connectedDevice?.name ?? false} />
            </TouchableHighlight>
          }
        />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    width: "100%",
    height: '100%',
    flexDirection: 'column',
    padding: 16,
  },
  list: {
    flex: 1,
  },
  scanning: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
  },
  scanDevices: {
    flex: 0,
    width: 200,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#89CFF0',
  },
});

export default PLXScanBluetooth;
 