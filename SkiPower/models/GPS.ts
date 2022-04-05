export interface GPS {
  _id?: string;
  user?: string;
  activity?: string;

  GPSdata?: GPSdata[];

  creationdate?: Date;
  modifieddate?: Date; 
}

export interface GPSdata {
  _id?: string;
  timestamp?: number;
  speed?: number;
  latitude?: number;
  longitude?: number;
  sattelite?: number;
  altitude?: number;
}

