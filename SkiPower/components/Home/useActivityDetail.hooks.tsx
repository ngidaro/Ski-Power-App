// React
import { useEffect, useState } from "react";

// Helpers
import { toString } from "lodash";

// Components
import { GraphProps } from "./LineGraph";

export const LOADCELL = 'LOADCELL';
export const PHONEGPS = 'PHONEGPS';
export const IMU = 'IMU';
export const POWER = 'POWER';


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
              const weight = Number(Math.abs(val.weight)) * 0.00981;
              setDataArray(previous => [...previous, weight >= 1 ? weight : 0]);
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
            data.IMUdata.forEach(val => {
              const xAngle = Math.atan2(Number(val.accel.x), Number(val.accel.y)) / (Math.PI/180);
              setDataArray(previous => [...previous, xAngle >= 1 ? xAngle : 0]);
            });
          }
          break;
        case POWER:
          const loadcelldata = data[0].loadcelldata;
          const IMUdata = data[1].IMUdata;
          const GPSdata = data[2].GPSdata;

          GPSdata.forEach(val  => {
            const index = loadcelldata.findIndex(value => value.timestamp === val.hardwaretimestamp);
            if(index !== -1){
              // Index exists
              // The index is the same for the loadcell and the IMU data

              // xAngle is in radians
              const xAngle = Math.atan2(Number(IMUdata[index].accel.x), Number(IMUdata[index].accel.y));
              const force = Number(Math.abs(loadcelldata[index].weight)) * 0.00981;  // In N
              const forceX = force * Math.cos(xAngle);
              const speed = Number(Math.abs(val.coords.speed));
              const power = forceX * speed;

              // console.log("xAngle: " + xAngle)
              // console.log("force: " + force)
              // console.log("forceX: " + forceX)
              // console.log("power: " + power)
              // console.log("------------------------------------")

              setDataArray(previous => [...previous, power > 0.01 ? power : 0]);
            } else {
              // Index does not exist (or did not record) so the value is 0
              setDataArray(previous => [...previous, 0]);
            }
          });
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

  return {
    dataArray,
    xLabel,
  }
}