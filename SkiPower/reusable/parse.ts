import { GPSdata } from "../models/GPS";
import { IMUData } from "../models/IMU";
import { LoadCellData } from "../models/Loadcell";

export const parseIMUData = (data: string[]): IMUData[] => {
  // Data coming in is of the form: ["rotX,rotY,rotZ,gForceX,gForceY,gForceZ,time"] where rot is Gyro and gForce is Accel.
  // time is the time in milliseconds since the program was uploaded to the microcontroller

  let IMUdata: IMUData[] = [];
  const len = data.length;
  var i = 0;

  if(data) {
    // Fastest form of iteration according to https://stackoverflow.com/questions/5349425/whats-the-fastest-way-to-loop-through-an-array-in-javascript
    while (i < len) {
      const tmpArr: number[] = data[i].split(',').map((val) => parseFloat(val));
      const tmpDataObj: IMUData = {
        gyro: {
          x: tmpArr[0],
          y: tmpArr[1],
          z: tmpArr[2],
        },
        accel: {
          x: tmpArr[3],
          y: tmpArr[4],
          z: tmpArr[5],
        },
        timestamp: tmpArr[6],
      }
      IMUdata.push(tmpDataObj);
      i++;
    }
  }
  return IMUdata
}

export const parseLoadCellData = (data: string[]): LoadCellData[] => {
  // Data coming in is of the form: ["weight,time"]
  let loadCellData: LoadCellData[] = [];
  const len = data.length;
  var i = 0;

  if(data) {
    while (i < len) {
      const tmpArr: number[] = data[i].split(',').map((val) => parseFloat(val));
      const tmpDataObj: LoadCellData = {
        weight: tmpArr[0],
        timestamp: tmpArr[1],
      }
      loadCellData.push(tmpDataObj);
      i++;
    }
  }
  return loadCellData
}

// Parse the GPS data coming from the hardware
export const parseGPSData = (data: string[]): GPSdata[] => {
  // Data coming in is of the form: ["speed, latitude, longitude, satellite, altitude, time"]
  let gpsData: GPSdata[] = [];
  const len = data.length;
  var i = 0;

  if(data) {
    while (i < len) {
      const tmpArr: number[] = data[i].split(',').map((val) => parseFloat(val));
      const tmpDataObj: GPSdata = {
        speed: tmpArr[0],
        latitude: tmpArr[1],
        longitude: tmpArr[2],
        sattelite: tmpArr[3],
        altitude: tmpArr[4],
        timestamp: tmpArr[5],
      }
      gpsData.push(tmpDataObj);
      i++;
    }
  }
  return gpsData
}