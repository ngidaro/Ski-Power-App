// React
import React from 'react';

// React-Native
import {
  FlatList,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';

// React-Query
import { useQuery } from 'react-query';
import { getAllActivities } from '../../react-query/activity/query';
import { ACTIVITY } from '../../react-query/activity/queryKeys';

// Models
import { Activity } from '../../models/Activity';

// Reusable
import { formatTime } from '../../reusable/formatTime';

// Components
import Icon from 'react-native-vector-icons/FontAwesome';

interface ActivityListProps {
  navigation?: any;
  nbOfItemsToDisplay?: number;
  height?: string;
}

const ActivityList = ({ navigation, nbOfItemsToDisplay, height = '70%' }: ActivityListProps) => {

  const { data: recentActivities } = useQuery(ACTIVITY, async () => getAllActivities())

  const itemView = (activity: Activity, index: number) => {
    const sDate = new Date(Date.parse(activity?.creationdate)).toDateString();
    return (
      <View style={styles.listItemView}>
        <View style={styles.itemView}>
          <Text style={styles.recentActivityText}>Activity {index + 1}</Text>
          <Text style={styles.recentActivityText}>Time: {formatTime(activity.totaltime)}</Text>
          <Icon name='chevron-right'/>
        </View>
        <Text style={styles.recentActivityDateText}>{sDate}</Text>
      </View>
    )
  }

  return (
    <View style={{...styles.view, height: height}}>
      {(recentActivities?.length ?? 0 ) !== 0 
      ? <FlatList
          style={styles.list} 
          data={nbOfItemsToDisplay === undefined ? recentActivities : recentActivities.slice(0, nbOfItemsToDisplay)}
          renderItem={({item, index, separators}) => 
            <TouchableHighlight
              underlayColor={'#D3D3D3'}
              key={item._id}
              onPress={() => navigation.navigate("ActivityDetails", {activity: item, index: index + 1})}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              {itemView(item, index)}
            </TouchableHighlight>
          }
        />
      : <Text style={styles.noActivities}>You don't have any activities logged yet</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '70%',
  },
  recentActivityText: {
    fontSize: 16,
    fontFamily: 'Arial',    
  },
  recentActivityDateText: {
    fontSize: 12,
    fontFamily: 'Arial',
    opacity: 0.5,
  },
  listItemView: {
    flexDirection: 'column',
    borderBottomWidth: 0.5,
    padding: 8,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    padding: 8,
  },
  noActivities: {
    color: 'gray',
    bottom: 100,
  },
});

export default ActivityList;
 