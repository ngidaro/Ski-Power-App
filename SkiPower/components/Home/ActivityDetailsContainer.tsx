// React
import React, { useEffect } from 'react';

// React-Native
import {
  View,
} from 'react-native';
import { useQuery } from 'react-query';

// Models
import { Activity } from '../../models/Activity';
import { getActivityData } from '../../react-query/activity/query';
import { ACTIVITYDATA } from '../../react-query/activity/queryKeys';

import ActivityDetails from './ActivityDetails';

interface ActivityDetailsContainerProps {
  route?: any;
  navigation?: any;
}

const ActivityDetailsContainer = ({ route, navigation }: ActivityDetailsContainerProps) => {
  const activity: Activity = route.params.activity;
  const index: number = route.params.index;

  useEffect(() => {
    navigation.setOptions({title: `Activity ${index}`});
  },[])

  // const { data } = useQuery(ACTIVITYDATA, async () => getActivityData(activity?._id ?? ""));

  return (
    <View>
      <ActivityDetails activity={activity} index={index}/>
    </View>
  );
};

export default ActivityDetailsContainer;
 