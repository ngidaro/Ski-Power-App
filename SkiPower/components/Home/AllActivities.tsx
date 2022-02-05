// React
import React from 'react';

// React-Native
import {
  StyleSheet,
  View,
} from 'react-native';

// React-Query
import ActivityList from './ActivityList';

interface AllActivitiesProps {
  navigation?: any,
}

const AllActivities = ({ navigation }: AllActivitiesProps) => {

  return (
    <View style={styles.view}>
      <ActivityList height='100%' navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({  
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderTopWidth: 0.5,
    borderColor: 'gray',
  },
});

export default AllActivities;
 