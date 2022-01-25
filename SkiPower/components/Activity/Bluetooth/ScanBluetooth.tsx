// React
import React, { useEffect, useState } from 'react';

// React-Native
import {
StyleSheet,
Text,
NativeModules,
NativeEventEmitter,
Platform,
PermissionsAndroid,
View,
TouchableOpacity,
FlatList,
TouchableHighlight,
} from 'react-native';

import BleManager from '../../../bluetooth/BleManager';
import { AuthenticationService } from '../../../services/authentication.service';
import ListItem from './ListItem';

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface ScanBluetoothProps {
  bleManagerEmitter: NativeEventEmitter;
  connectedDevice: any;
  setConnectedDevice: (peripheral: any) => void;
}

const ScanBluetooth = ({ bleManagerEmitter, connectedDevice, setConnectedDevice } : ScanBluetoothProps) => {

  // Bluetooth
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState<any>([]);

  const handleDisconnectedPeripheral = (data: any) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data: any) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      } else {
        console.log(results);

        for (let result of results){
          var peripheral = result;
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral: any) => {
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    } else {
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  }

  useEffect(() => {
    if(!connectedDevice) {
      BleManager.start({showAlert: false});
  
      const bleDiscoverPeripheralListener = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      const bleStopScanListener = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
      const bleDisconnectPeripheralListener = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      const bleCharacteristicListener = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
  
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
        });
      }
      
      return (() => {
        console.log('unmount');      
        bleDiscoverPeripheralListener.remove();
        bleStopScanListener.remove();
        bleDisconnectPeripheralListener.remove();
        bleCharacteristicListener.remove();
      })
    }
  },[])

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, true).then((results) => {
        console.log('Scanning...');
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }  
  }

  const handleStopScan = () => { 
    console.log('Scan is stopped');
    // list.map((peripheral) => console.log(peripheral.name));
    console.log(list)
    setIsScanning(false);
  }

  const testPeripheral = (peripheral:any) => {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            setList(Array.from(peripherals.values()));
          }

          console.log('Connected to ' + peripheral.id);

          setTimeout(() => {
            /* Test read current RSSI value */
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);
              
              // Set connected Device data
              setConnectedDevice(peripheralData);

              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
                let p = peripherals.get(peripheral.id);
                if (p) {
                  p.rssi = rssi;
                  peripherals.set(peripheral.id, p);
                  setList(Array.from(peripherals.values()));
                }                
              });                                          
            });      
          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  return (
    <View style={styles.view}>
      <TouchableOpacity
        // onPress={() => AuthenticationService.clearToken()}
        onPress={startScan}
        style={styles.scanDevices}>
        <Text>Scan Bluetooth ({isScanning ? 'on' : 'off'})</Text>
      </TouchableOpacity>
      {isScanning ? <Text>Scanning...</Text> :
        <FlatList 
          // ItemSeparatorComponent={
          //   Platform.OS !== 'android' &&
          //   (({ highlighted }) => (
          //     <View
          //       style={[
          //         style.separator,
          //         highlighted && { marginLeft: 0 }
          //       ]}
          //     />
          //   ))
          // }
          style={styles.list} 
          data={list}
          renderItem={({item, index, separators}) => 
            <TouchableHighlight
              key={item.name}
              onPress={() => testPeripheral(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <ListItem name={item.name} isConnected={item.name == connectedDevice?.name ?? false} />
            </TouchableHighlight>
          }
        />
      }
      <TouchableOpacity
        // onPress={() => AuthenticationService.clearToken()}
        onPress={retrieveConnected}
        style={styles.scanDevices}>
        <Text>Retrieve Connected</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    width: "100%",
    height: '100%',
    flexDirection: 'column',
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

export default ScanBluetooth;
 