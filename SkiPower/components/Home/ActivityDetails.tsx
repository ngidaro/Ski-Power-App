// React
import React, { useCallback, useEffect } from 'react';

// React-Native
import {
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';

// Models
import { Activity } from '../../models/Activity';
import { formatTime } from '../../reusable/formatTime';

interface ActivityDetailsProps {
  route?: any;
  navigation?: any;
}

const ActivityDetails = ({ route, navigation }: ActivityDetailsProps) => {
  const activity: Activity = route.params.activity;
  const index: number = route.params.index;

  useEffect(() => {
    navigation.setOptions({title: `Activity ${index}`});
  },[])

  const fieldTemplate = useCallback((fieldName: string, fieldValue: string) => {
    return (
      <View style={styles.fieldView}>
        <Text style={styles.fieldText}>{fieldName}:</Text>
        <Text style={styles.fieldText}>{fieldValue}</Text>
      </View>
    )
  },[]);

  return (
    <View style={styles.view}>
      {fieldTemplate("Name", `Activity ${index}`)}
      {fieldTemplate("Date", new Date(Date.parse(activity?.creationdate)).toDateString())}
      {fieldTemplate("Time", formatTime(activity?.totaltime))}
    </View>
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
});

export default ActivityDetails;
 