export interface PhoneGPSData {
  _id?: string;
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
  hardwaretimestamp?: number | null;
}
