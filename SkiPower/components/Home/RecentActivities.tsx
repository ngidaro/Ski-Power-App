// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

// Models
import { Activity } from '../../models/Activity';

// Components
import ActivityList from './ActivityList';

interface RecentActivitiesProps {
  navigation?: any;
  recentActivities: Activity[] | undefined;
}

const RecentActivities = ({ navigation, recentActivities }: RecentActivitiesProps) => {
  return (
    <View style={styles.view}>
      <Text style={styles.recentActivityTitleText}>Recent Activities</Text>
      <ActivityList navigation={navigation} nbOfItemsToDisplay={5}/>
      {(recentActivities?.length ?? 0) > 5 ? <Text onPress={() => navigation.navigate("AllActivities")} style={styles.showMoreText}>Show More...</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 102,
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    height: '45%',
    borderRadius: 16,
    shadowOpacity: 0.2,
    borderWidth: 0.3,
    borderColor: 'gray',
  },
  recentActivityTitleText: {
    fontSize: 24,
    fontFamily: 'Arial Rounded MT Bold',
    padding: 8,
    paddingBottom: 0,
    width: '100%',
  },
  showMoreText: {
    width: '100%',
    color: 'blue',
    paddingLeft: 16,
    padding: 8,
  }
});

export default RecentActivities;
 