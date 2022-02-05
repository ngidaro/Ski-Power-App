// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

// React-Query
import { useQuery } from 'react-query';
import { getAllActivities } from '../../react-query/activity/query';
import { getUser } from '../../react-query/users/query';

// Models
import { USER } from '../../react-query/users/queryKeys';
import { ACTIVITY } from '../../react-query/activity/queryKeys';

// Components
import RecentActivities from './RecentActivities';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HomePageProps {
  navigation: any;
}

const HomePage = ({ navigation }: HomePageProps) => {

  const { data: user } = useQuery(USER, async () => getUser())
  const { data: recentActivities } = useQuery(ACTIVITY, async () => getAllActivities())

  const welcomeText = () => {
    return (
      <View style={styles.welcomeView}>
        <Text style={styles.textName}>Hi {user?.firstname}</Text>
        <View style={styles.dateView}>
          <Icon name={'calendar'}/>
          <Text style={{paddingLeft: 4 }}>{new Date().toDateString()}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.view}>
      {welcomeText()}
      <RecentActivities navigation={navigation} recentActivities={recentActivities}/>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: 16,
  },
  welcomeView: {
    position: 'absolute',
    top: 16,
    left: 16, 
  },
  textName: {
    fontSize: 32,
    fontFamily: 'Arial Rounded MT Bold',
  },
  dateView: {
    paddingTop: 4,
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.5
  }
});

export default HomePage;
 