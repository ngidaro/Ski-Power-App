// React
import { useEffect, useState } from "react";

// Helpers
import { toString } from "lodash";

// Components
import { GraphProps } from "./LineGraph";

export const LOADCELL = 'LOADCELL';
export const PHONEGPS = 'PHONEGPS';
export const IMU = 'IMU';

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
              setDataArray(previous => [...previous, Number(Math.abs(val.weight)) * 9.81]);
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