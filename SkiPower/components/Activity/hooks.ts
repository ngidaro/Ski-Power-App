// React
import { useCallback, useEffect, useRef, useState } from "react";

// React-Query
import { useMutation, useQueryClient } from "react-query";
import { ACTIVITY } from "../../react-query/activity/queryKeys";
import { updateQueryID } from "../../react-query/reusable/hooksRQ";
import { phoneGPS, postNewActivity, saveHardwareData, updateActivity } from "../../react-query/activity/mutations";

// React-Native
import base64 from "react-native-base64";
import { Platform } from "react-native";

// Components
import { ActivityProps, bleManager } from "./Activity";

// GeoLocation
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation'

// Bluetooth
import { Device } from 'react-native-ble-plx';

// Models
import { Activity } from "../../models/Activity";
import { IMUData } from "../../models/IMU";
import { LoadCellData } from "../../models/Loadcell";
import { parseIMUData, parseLoadCellData, parseGPSData } from "../../reusable/parse";
import { GPSdata } from "../../models/GPS";

const SERVICE_UUID = '6725B97A-B780-48E2-A199-27B94E9F6E1B';
const INPUT_UUID = '5D695378-B55B-4F49-B2DE-B1575A839B19';
const OUTPUT_UUID = 'DC51B616-6197-4E57-A102-F7C77E6A3B01';

const LOADCELL_OUTPUT_UUID =  "358B2F25-7B72-4116-BE08-979E946A3CEF";
const IMU_OUTPUT_UUID = "F6F693DD-4369-4358-8C2B-97D68A71EC74";
const GPS_OUTPUT_UUID = "0051D730-611A-463B-B0D9-0159A8625C65";

export const useActivity = ({ route, navigation, connectedDevice, setConnectedDevice } : ActivityProps) => {  
  // Timer/Reading from Microcontroller
  const [timer, setTimer] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [IMUData, setIMUData] = useState<string[]>([]);
  const [loadcellData, setLoadcellData] = useState<string[]>([]);
  const [GPSData, setGPSData] = useState<string[]>([]);

  // Data IDs
  const [phoneGPSId, setPhoneGPSId] = useState<string |null>(null);
  const [IMUId, setIMUId] = useState<string |null>(null);
  const [loadcellId, setLoadcellId] = useState<string |null>(null);
  const [GPSId, setGPSId] = useState<string |null>(null);

  const countRef = useRef(null);
  const postToDBRef = useRef(null);

  // Geolocation
  const [positionData, setPositionData] =useState<PhoneGPSData[]>([]);
  const [watchID, setWatchID] = useState<number | null>(null);

  let currentLoadCellData = "";

  const queryClient = useQueryClient();

  // Add New Activity - when the Record button is pressed
  const addActivityMutation = useMutation(postNewActivity,
    { onSuccess: (data) => {
      setCurrentActivity(data.data.activity);
      // Need to update the useQuery(ACTIVITY) with the new entry
      updateQueryID(queryClient, ACTIVITY, "ADD", data.data.activity);
    },
  });

  // Update Activity - updates the total time
  const updateActivityMutation = useMutation(updateActivity,
    { onSuccess: (data) => {
      setCurrentActivity(data.data.activity);
      // Need to update the useQuery(ACTIVITY) with the new entry
      updateQueryID(queryClient, ACTIVITY, "EDIT", data.data.activity);
    },
  });

  // Creates New Entry and Updates existing entry for GPS embedded in the phone
  const phoneGPSMutation = useMutation(phoneGPS,
    { onSuccess: (data) => {
      if(phoneGPSId === null) {
        setPhoneGPSId(data.data.phoneGPS._id);
      }
      // If the app is no longer recording then we want to reset the ID
      if(!isRecording)
        setPhoneGPSId(null);
    },
  });

  const hardwareMutation = useMutation(saveHardwareData);

  const handleBLEData = (saveOnlyOnStop: boolean = false) => {
    // Save data to the Database every 30 seconds or when timer stops
    if(positionData.length > 0) {
      console.log("Saving GPS Data");
      phoneGPSMutation.mutate({_id: phoneGPSId, activity: currentActivity?._id ?? "", GPSdata: positionData});
    }
    // Reset the array to be empty
    setPositionData([]);

    if(saveOnlyOnStop) {
      console.log("Saving IMU - LoadCell - GPS Data");
      // Convert data into proper format before saving
      const parsedIMUData: IMUData[] = parseIMUData(IMUData);
      const parsedLoadCellData: LoadCellData[] = parseLoadCellData(loadcellData);
      const parsedGPSData: GPSdata[] = parseGPSData(GPSData);

      // Save the data to the DB
      // Need to do mutation
      hardwareMutation.mutate({ 
        activity: currentActivity?._id ?? "", 
        IMU: { 
          IMUdata: parsedIMUData 
        }, 
        loadCell: { 
          loadcelldata: parsedLoadCellData 
        },
        GPS: { 
          GPSdata: parsedGPSData 
        },
      });

      setIMUData([]);
      setLoadcellData([]);
      setGPSData([]);
    }
  }

  const updatePositionData = (position: GeolocationResponse) => {
    setPositionData(previous => [...previous, {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      },
      timestamp: position.timestamp,
      hardwaretimestamp: currentLoadCellData 
        ? parseLoadCellData([currentLoadCellData])[0].timestamp
        : null,
    }]);
  };

  // Once the Record button is pressed, Start sending/saving data
  const startRecording = useCallback(async () => {
    if(isRecording) {
      // Create new activity so that new data entries in DB can reference the activity ID
      addActivityMutation.mutate({});

      // ---------------------- Begin Recording Location from Device ----------------------
      Geolocation.getCurrentPosition(
        position => {
          updatePositionData(position);
        },
        error => console.log(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 1}
      );
  
      // Save data in a JSON
      setWatchID(Geolocation.watchPosition(position => {
          updatePositionData(position)
        },
        error => console.log(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 1}
      ))
      // -----------------------------------------------------------------------------------

      // ---------------------- Connect to Device with UUID and begin recording ----------------------
      if(connectedDevice) {
        const device: Device = await connectedDevice.connect();
        await device.discoverAllServicesAndCharacteristics();
        
        //  Set what to do when DC is detected
        bleManager.onDeviceDisconnected(connectedDevice.id, (error, device) => {
          console.log('Device DC');
          setConnectedDevice(null);
        });

        // Signal the Microcontroller to begin recording:
        await device.writeCharacteristicWithResponseForService(SERVICE_UUID, INPUT_UUID, base64.encode("1"));
        
        if(Platform.OS === "ios") {
          //Read inital values
          await device.readCharacteristicForService(SERVICE_UUID, OUTPUT_UUID);
          await device.readCharacteristicForService(SERVICE_UUID, LOADCELL_OUTPUT_UUID);
          await device.readCharacteristicForService(SERVICE_UUID, IMU_OUTPUT_UUID);
          await device.readCharacteristicForService(SERVICE_UUID, GPS_OUTPUT_UUID);

          // On iOS monitorCharacteristicForService only shows the data once... therefore we will use read instead
          countRef.current = setInterval(async () => {
            // Reads Data from ESP32 (from the loop function)
            const readCharacteristic = await device.readCharacteristicForService(SERVICE_UUID, OUTPUT_UUID);
            const readCharLoadcell = await device.readCharacteristicForService(SERVICE_UUID, LOADCELL_OUTPUT_UUID);
            const readCharIMU = await device.readCharacteristicForService(SERVICE_UUID, IMU_OUTPUT_UUID);
            const readCharGPS = await device.readCharacteristicForService(SERVICE_UUID, GPS_OUTPUT_UUID);

            // Save data into an array
            setLoadcellData(previous => [...previous, base64.decode(readCharLoadcell?.value ?? '') ]);
            currentLoadCellData = base64.decode(readCharLoadcell?.value ?? '');
            setIMUData(previous => [...previous, base64.decode(readCharIMU?.value ?? '') ]);
            setGPSData(previous => [...previous, base64.decode(readCharGPS?.value ?? '') ]);
          }, 250); // Anything under 250ms takes too long to parse and save to the DB... 

          // 0ms gives really accurate data but for some reasons takes a while to save in the DB even if it only ran for a couple of seconds
          // Might be because updating the state is very slow?? Not sure?
          
          //** We get more data points which increases accuracy but reduces efficiency **

        } else {
          // Monitor values and tell what to do when receiving an update
          device.monitorCharacteristicForService(SERVICE_UUID, OUTPUT_UUID, (error, characteristic) => {
              if (characteristic?.value != null) {
                console.log(
                  'Message update received: ',
                  base64.decode(characteristic?.value),
                );
              }
            },
            "monitortransactionOUT",
          );

          // Monitor for Loadcell data
          device.monitorCharacteristicForService(SERVICE_UUID, LOADCELL_OUTPUT_UUID, (error, characteristic) => {
              if (characteristic?.value != null) {
                setLoadcellData(previous => [...previous, base64.decode(characteristic?.value ?? '') ]);
              }
            },
            "monitortransactionLoadcell",
          );

          // Monitor for IMU data
          device.monitorCharacteristicForService(SERVICE_UUID, IMU_OUTPUT_UUID, (error, characteristic) => {
              if (characteristic?.value != null) {
                setIMUData(previous => [...previous, base64.decode(characteristic?.value ?? '') ]);
              }
            },
            "monitortransactionIMU",
          );

          // Monitor for GPS data
          device.monitorCharacteristicForService(SERVICE_UUID, GPS_OUTPUT_UUID, (error, characteristic) => {
              if (characteristic?.value != null) {
                setGPSData(previous => [...previous, base64.decode(characteristic?.value ?? '') ]);
              }
            },
            "monitortransactionGPS",
          );
        }
        console.log('Connection established');
        // ----------------------------------------------------------------------------------------
      }
      // postToDBRef.current = setInterval(() => {
      //   console.log(positionData.length);
      //   // handleBLEData();
      // }, 5000);

    } else if(!isRecording && timer !== 0) {
      // Stop Interval (Read from Microcontroller if iOS)
      clearInterval(countRef.current);
      clearInterval(postToDBRef.current);

      // Reset Timer to 0
      setTimer(0);

      // Clear Geolocation
      watchID !== null && Geolocation.clearWatch(watchID);

      // If the user stops recording then send the data to the API
      updateActivityMutation.mutate({...currentActivity, totaltime: timer});

      // Signal the microcontroller to stop recording data
      if(connectedDevice) {
        // Signal the Microcontroller to Stop Recording:
        await connectedDevice.writeCharacteristicWithoutResponseForService(SERVICE_UUID, INPUT_UUID, base64.encode('0'))

        // Cancel monitor transaction
        bleManager.cancelTransaction('monitortransactionOUT');
        bleManager.cancelTransaction('monitortransactionLoadcell');
        bleManager.cancelTransaction('monitortransactionIMU');
        bleManager.cancelTransaction('monitortransactionGPS');
      }

      // Save remaining data to the DB
      handleBLEData(true);

      // Reset the GPS ID
      setPhoneGPSId(null);
    }
  },[isRecording])

  useEffect(() => {
    startRecording();
  },[startRecording])

  useEffect(() => {
    // Save Data to Database every 30 seconds
    if(isRecording && timer % 30 === 0) {
      handleBLEData();
    }
  },[isRecording, timer]);

  return {
    isRecording, 
    timer,
    setTimer,
    navigation,
    connectedDevice,
    setIsRecording,
  }
}
