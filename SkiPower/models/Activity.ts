export interface Activity {
  _id?: string;
  user?: string;
  totaltime?: number;

  // Reference to DB ID's
  phoneGPS?: string | null;
  IMU?: string | null;
  loadcell?: string | null;
  GPS?: string | null;

  creationdate?: Date;
  modifieddate?: Date; 
}