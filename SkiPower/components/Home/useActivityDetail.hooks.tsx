// React
import { useEffect, useState } from "react";

// Helpers
import { toString } from "lodash";

// Components
import { GraphProps } from "./LineGraph";
import { IMUData } from "../../models/IMU";

export const LOADCELL = 'LOADCELL';
export const PHONEGPS = 'PHONEGPS';
export const IMU = 'IMU';
export const POWER = 'POWER';
export const GPS = 'GPS';

export const useActivityDetails = ({ route, navigation, activity, data, isFetching, dataType } : GraphProps) => {  

  const [dataArray, setDataArray] = useState<number[]>([]);
  const [xLabel, setXLabel] = useState<string[]>([]);

  useEffect(() => {
    if(!isFetching) {
      // Check the dataType: loadcell, imu or gps
      switch (dataType) {
        case LOADCELL:
          if(data.loadcelldata && (dataArray.length === 0)) {
            // Populate array with data if the array is empty
            data.loadcelldata.forEach(val => {
              const weight = val.weight * 0.00981;
              // setDataArray(previous => [...previous, weight >= 0.05 ? weight : 0]);
              setDataArray(previous => [...previous, weight]);
            });
          }
          break;
        case PHONEGPS:
          if(data.GPSdata && (dataArray.length === 0)) {
            data.GPSdata.forEach(val => {
              setDataArray(previous => [...previous, val.coords.speed >= 0 ? Number(Math.abs(val.coords.speed)) : 0]);
            });
          }
          break;
        case IMU:
          if(data.IMUdata && (dataArray.length === 0)) {
            // let initTime = data.IMUdata[0].timestamp;
            let previousData: IMUData;
            data.IMUdata.forEach(val => {
              const { xAngle, prevData } = calculateXAngle(false, val, previousData);
              previousData = prevData;
              // const elapsedTime = (val.timestamp - initTime) / 1000;  // Get elapsed time in seconds
              // const accData = (Math.atan2(Number(val.accel.x), Number(val.accel.y)) / (Math.PI/180)) * 0.96;
              // const gyroData = val.gyro.y * elapsedTime * 0.04;
              // const xAngle = accData + gyroData;

              // // Update initTime to be the previous time
              // initTime = val.timestamp;

              setDataArray(previous => [...previous, xAngle >= 1 ? xAngle : 0]);
            });
          }
          break;
        case POWER:
          const loadcelldata = data[0].loadcelldata;
          const IMUdata = data[1].IMUdata;
          const GPSdata = data[2].GPSdata;
          let previousData: IMUData;

          GPSdata.forEach((val, arrIndex: number)  => {
            // Phone GPS
            if(GPSdata.coords) {
              // The index is the same for the loadcell and the IMU data
              const index = loadcelldata.findIndex(value => value.timestamp === val.hardwaretimestamp);
              if(index !== -1){
                // Index exists
                // Check to see if the IMU accel in y is greater than 1
                const { xAngle, prevData } = calculateXAngle(true, IMUdata[index], previousData);
                previousData = prevData;
                
                let power = calculatePower(val.coords.speed, xAngle, loadcelldata[index].weight);
                setDataArray(previous => [...previous, power > 0.01 ? power : 0]);
              } else {
                // Index does not exist (or did not record) so the value is 0
                setDataArray(previous => [...previous, 0]);
              }
            } else {
              // Hardware GPS
              const {xAngle, prevData}  = calculateXAngle(true, IMUdata[arrIndex], previousData);
              previousData = prevData;
              let power = calculatePower(val.speed, xAngle, loadcelldata[arrIndex].weight);
              setDataArray(previous => [...previous, power > 0.01 ? power : 0]);
            }
          });
          
          break;
        case GPS:
          if(data.GPSdata && (dataArray.length === 0)) {
            data.GPSdata.forEach(val => {
              setDataArray(previous => [...previous, val.speed >= 0 ? Number(Math.abs(val.speed)) : 0]);
            });
          }
          break;
        default:
          break;
      }

      if(xLabel.length === 0) {
        // populate the X axis with the total time... 0 to total time
        for (let index = 0; index < (activity?.totaltime ?? 0); index+=10) {
          setXLabel(previous => [...previous, toString(index)]);
        }
      }
    }
  },[isFetching]);

  const calculatePower = (GPSspeed: number, xAngle: number, loadcellWeight: number) => {
    const force = Number(Math.abs(loadcellWeight)) * 0.00981;  // In N
    const forceX = force * Math.cos(xAngle);
    const speed = GPSspeed > 0 ? GPSspeed : 0;
    return forceX * speed;
  }

  const calculateXAngle = (inRAD: boolean, IMUdata: IMUData, previousData: IMUData) => {
    let xAngle: number;
    if(IMUdata.accel.y > 1.1) {
      if(previousData){
        xAngle = Math.atan2(Number(previousData.accel.x), Number(previousData.accel.y));
      } else {
        xAngle = 90 * Math.PI/180;
      }
    } else {
      xAngle = Math.atan2(Number(IMUdata.accel.x), Number(IMUdata.accel.y));
      previousData = IMUdata;
    }

    if(inRAD) {
      return { xAngle, previousData};
    } else {
      return { xAngle: (xAngle * 180/Math.PI), previousData };
    }
  }

  return {
    dataArray,
    xLabel,
  }
}