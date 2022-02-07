import { ActivityService } from "../../services/activity.service";

const getAllActivities = () => {
  const services = new ActivityService();
  return services.getAllActivities().then((data) => data.data);
}

const getActivityData = (activity: string) => {
  const services = new ActivityService();
  return services.getActivityData(activity).then((data) => data.data);
}

export {
  getAllActivities,
  getActivityData,
}