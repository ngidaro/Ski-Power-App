import { ActivityService } from "../../services/activity.service";

// Models
import { Activity } from "../../models/Activity";
import { GeolocationResponse } from '@react-native-community/geolocation';
import { IMU } from "../../models/IMU";
import { LoadCell } from "../../models/Loadcell";
import { GPS } from "../../models/GPS";
import { PhoneGPSData } from "../../models/PhoneGPSData";

const postNewActivity = (activity: Activity) => {
  const services = new ActivityService();
  return services.postNewActvity(activity);
}

const updateActivity = (activity: Activity | undefined) => {
  const services = new ActivityService();
  return services.updateActvity(activity);
}

// Add/Update existing data
const phoneGPS = (data: {_id: string | null, activity: string, GPSdata: PhoneGPSData[]}) => {
  const services = new ActivityService();
  return services.phoneGPS(data._id, data.activity, data.GPSdata);
}

// Add/Update existing data
const saveHardwareData = (data: {activity: string, IMU: IMU, loadCell: LoadCell, GPS: GPS}) => {
  const services = new ActivityService();
  return services.saveHardwareData(data.activity, data.IMU, data.loadCell, data.GPS);
}

export {
  postNewActivity,
  updateActivity,
  phoneGPS,
  saveHardwareData,
}
