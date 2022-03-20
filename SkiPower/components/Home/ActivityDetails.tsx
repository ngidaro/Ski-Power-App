// React
import React, { useCallback } from 'react';

// React-Native
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';

// React-Query
import { useQuery } from 'react-query';
import { getActivityData } from '../../react-query/activity/query';
import { ACTIVITYDATA } from '../../react-query/activity/queryKeys';

// Models
import { Activity } from '../../models/Activity';

// Functions
import { formatTime } from '../../reusable/formatTime';

// Constants
import { IMU, LOADCELL, PHONEGPS, POWER } from './useActivityDetail.hooks';

// Components
import LineGraph from './LineGraph';

interface ActivityDetailsProps {
  route?: any;
  navigation?: any;
  activity: Activity;
  index: number;
}

const ActivityDetails = ({ route, navigation, activity, index }: ActivityDetailsProps) => {

  const { data, isFetching } = useQuery(ACTIVITYDATA, async () => getActivityData(activity?._id ?? ""));

  const fieldTemplate = useCallback((fieldName: string, fieldValue: string) => {
    return (
      <View style={styles.fieldView}>
        <Text style={styles.fieldText}>{fieldName}:</Text>
        <Text style={styles.fieldText}>{fieldValue}</Text>
      </View>
    )
  },[]);

  return (
    <ScrollView style={styles.view}>
      {fieldTemplate("Name", `Activity ${index}`)}
      {fieldTemplate("Date", new Date(Date.parse(activity?.creationdate)).toDateString())}
      {fieldTemplate("Time", formatTime(activity?.totaltime))}
      {(!data?.loadcell ?? false) && (!data?.IMU ?? false) && (!data?.phoneGPS ?? false) && 
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>No Data Available</Text>
      </View>
      }
      {((data?.loadcell ?? false) && 
        (data?.phoneGPS ?? false) &&
        (data?.IMU ?? false)) && 
        <LineGraph 
          title='Power'
          activity={activity}
          data={[data.loadcell, data.IMU, data.phoneGPS]}
          isFetching={isFetching}
          dataType={POWER} 
          yAxisSuffix=' W'/>}
      {(data?.loadcell ?? false) && 
        <LineGraph 
          title='Force Applied'
          activity={activity} 
          data={data.loadcell} 
          isFetching={isFetching} 
          dataType={LOADCELL} 
          yAxisSuffix=' N'/>}
      {(data?.phoneGPS ?? false) && 
        <LineGraph 
          title='Speed'
          activity={activity} 
          data={data.phoneGPS} 
          isFetching={isFetching} 
          dataType={PHONEGPS} 
          yAxisSuffix=' m/s'/>}
      {(data?.IMU ?? false) && 
        <LineGraph 
          title='Pole Angle'
          activity={activity}
          data={data.IMU}
          isFetching={isFetching}
          dataType={IMU} 
          yAxisSuffix=' deg'/>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({  
  view: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    padding: 16,
    flexDirection: 'column',
  },
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: 'Arial',
  },
  noDataView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 128,
  },
  noDataText: {
    alignItems: 'center',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
});

export default ActivityDetails;
 