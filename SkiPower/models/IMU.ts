export interface IMU {
  _id?: string;
  user?: string;
  activity?: string;

  IMUdata?: IMUData[];

  creationdate?: Date;
  modifieddate?: Date; 
}

export interface IMUData {
  _id?: string;
  timestamp?: number;
  gyro: {
    x: number,
    y: number,
    z: number,
  },
  accel: {
    x: number,
    y: number,
    z: number,
  },
}

