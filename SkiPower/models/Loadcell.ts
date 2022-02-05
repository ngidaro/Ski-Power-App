export interface LoadCell {
  _id?: string;
  user?: string;
  activity?: string;

  loadcelldata?: LoadCellData[];

  creationdate?: Date;
  modifieddate?: Date; 
}

export interface LoadCellData {
  _id?: string;
  timestamp?: number;
  weight?: number;
}

