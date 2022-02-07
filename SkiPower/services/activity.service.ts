import { ApiResult } from "./api-result";
import { SecuredService } from "./secured.service";

// Models
import { Activity } from "../models/Activity";
import { GeolocationResponse } from '@react-native-community/geolocation';
import { IMU } from "../models/IMU";
import { LoadCell } from "../models/Loadcell";

export class ActivityService extends SecuredService {

    private baseUrl = 'api/activity';

    public getAllActivities(): Promise<ApiResult<any>> {
      return this.get(`${this.baseUrl}/`);
    }

    public getActivityData(activity: string): Promise<ApiResult<any>> {
      return this.get(`${this.baseUrl}/activitydata/${activity}`);
    }

    public postNewActvity(activity: Activity): Promise<ApiResult<any>> {
      return this.post(`${this.baseUrl}/newactivity`, activity);
    }

    public updateActvity(activity: Activity | undefined): Promise<ApiResult<any>> {
      return this.post(`${this.baseUrl}/updateactivity`, activity);
    }

    // Add/Update GPS phone entry
    public phoneGPS(_id: string | null, activity: string, GPSdata: GeolocationResponse[]): Promise<ApiResult<any>> {
      return this.post(`${this.baseUrl}/phoneGPS`, {_id, activity, GPSdata});
    }

    // Save Hardware data (Only able to Add new entry...)
    public saveHardwareData(activity: string, IMU: IMU, loadcell: LoadCell): Promise<ApiResult<any>> {
      return this.post(`${this.baseUrl}/savehardwaredata`, {activity, IMU, loadcell});
    }
}