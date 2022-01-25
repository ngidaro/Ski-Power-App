// React
import React, { useEffect, useRef, useState } from 'react';

// React-Native
import {
StyleSheet,
View,
} from 'react-native';
import { Text } from 'react-native-elements';

// Models
import { User } from '../../models/User';

// React-Query
import { useQuery } from 'react-query';
import { getUser } from '../../react-query/users/query';
import { USER } from '../../react-query/users/queryKeys';

// Components
import Timer from './Timer';

// Bluetooth
import BleManager from '../../bluetooth/BleManager';
import base64 from 'react-native-base64';

interface ActivityProps {
  route?: any;
  navigation?: any;
  connectedDevice: any;
}

const Activity = ({ route, navigation, connectedDevice } : ActivityProps) => {

  const [user, setUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const countRef = useRef(null);

  const { data } = useQuery(USER, async () => getUser(),
    { onSuccess: (dataAPI) => setUser(dataAPI.data) })

  useEffect(() => {
    if(connectedDevice && isRecording) {

      // Will need to map through the list of connected devices (2 ESP's will be connected)

      // Send signal to the Microcontrollers to begin recording data      
      BleManager.connect(connectedDevice?.id).then(() => {
        console.log("Connected");

        // RetrieveServices is required before any writes or reads
        BleManager.retrieveServices(connectedDevice?.id).then((peripheralInfo) => {
          // Connected Device Data:
          /** {"advertising": {"isConnectable": 1, "kCBAdvDataRxPrimaryPHY": 1, "kCBAdvDataRxSecondaryPHY": 0, "kCBAdvDataTimestamp": 664734781.991659, "localName": "ESP32", 
           * "serviceUUIDs": ["6725B97A-B780-48E2-A199-27B94E9F6E1B", "6725B97A-B780-48E2-A199-27B94E9F6E1B"], "txPowerLevel": 3}, 
           * "characteristics": [{"characteristic" (Input UUID): "5D695378-B55B-4F49-B2DE-B1575A839B19", "isNotifying": false, "properties": [Array], "service": "6725B97A-B780-48E2-A199-27B94E9F6E1B"}, 
           * {"characteristic" (Output UUID): "DC51B616-6197-4E57-A102-F7C77E6A3B01", "isNotifying": false, "properties": [Array], "service": "6725B97A-B780-48E2-A199-27B94E9F6E1B"}], 
           * "id": "9DE325ED-9240-4A8C-EE09-161D226B6A6E", "name": "ESP32", "rssi": -57, "services": ["6725B97A-B780-48E2-A199-27B94E9F6E1B"]} */
          
          // Ping the microcontroller to begin sending data
          BleManager.write(
            connectedDevice.id,
            connectedDevice.services[0],
            connectedDevice.characteristics[0].characteristic,
            [base64.encode("")]
          ).then(() => {
            console.log("Signaled ESP to start sending data...");
          })
          .catch((error) => {
            console.log(error);
          });

          if(isRecording) {            
            countRef.current = setInterval(() => {
              // Reads Data from ESP32 (from the loop function)
              BleManager.read(
                connectedDevice.id,
                connectedDevice.services[0],
                connectedDevice.characteristics[1].characteristic,
              ).then((data) => {
                const msgFromESP: string = data.reduce((str: string, charIndex: number) => str += String.fromCharCode(charIndex), ' ');
                console.log("Read: " + msgFromESP.trim());
              })
              .catch((error) => {
                console.log(error);
              });
            }, 1000);
          } else {            
            // Stop Interval
            clearInterval(countRef.current);
          }      
        })
      })
      .catch((error) => {
        console.log(error);
      });

    } else if(!connectedDevice) {
      // No devices connected so only the timer will run
      console.log("No devices Connected... only timer will start")
    } else if(!isRecording) {
      clearInterval(countRef.current);
    }
  },[isRecording])

  return (
    <View style={styles.view}>
      {connectedDevice ? <Text>Connected to {connectedDevice?.name}</Text> : null}
      <View style={styles.timer}>
        <Timer isRecording={isRecording} setIsRecording={() =>setIsRecording(!isRecording)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    // backgroundColor: 'white',
    alignItems: 'center',    
    width: '100%',
    height: '100%',
  },
  timer: {
    position: 'absolute',
    bottom: 16,
  },
});

export default Activity;
 