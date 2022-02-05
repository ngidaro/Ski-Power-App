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
  // Data coming in is of the form: ["weight,time"] where rot is Gyro and gForce is Accel.
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