// React
import React, { useState } from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
Image,
TouchableHighlight,
} from 'react-native';

// React-Query
import { useQuery } from 'react-query';
import { getUser } from '../../react-query/users/query';
import { USER } from '../../react-query/users/queryKeys';
import { ACTIVITY } from '../../react-query/activity/queryKeys';
import { getAllActivities } from '../../react-query/activity/query';

// Components
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = ({ navigation }) => {

  const { data: user } = useQuery(USER, async () => getUser())
  const { data: activities } = useQuery(ACTIVITY, async () => getAllActivities())

  return (
    <View style={styles.view}>
      <Icon style={styles.avatar} name={'user-circle'} color={'gray'} size={98} />
      <Text style={styles.displaynameText}>{user.displayname}</Text>
      
      <View style={styles.activitiesView}>
        <Text style={styles.activitiesText}>Activities</Text>
        <Text style={styles.activitiesText}>{activities.length}</Text>
      </View>

      <TouchableHighlight
        underlayColor={"#D3D3D3"}
        style={{...styles.touchableButtonDataView, ...styles.exportMargin}}
        onPress={() => null}>
        <View style={ styles.buttonDataView }>
          <Text style={styles.exportDataText}>Export Data    <Text style={styles.comingSoonText}>(Coming Soon)</Text></Text>
          <Icon style={styles.exportDataText} name={'chevron-right'}/>
        </View>
      </TouchableHighlight>
      
      <TouchableHighlight
        underlayColor={"#D3D3D3"}
        style={{...styles.touchableButtonDataView, ...styles.settingMargin}}
        onPress={() => navigation.navigate("Settings", {user: user})}>
        <View style={ styles.buttonDataView }>
          <Text style={styles.exportDataText}>Settings</Text>
          <Icon style={styles.exportDataText} name={'chevron-right'}/>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    height: '100%',
  },
  avatar: {
    marginTop: 84,
  },
  displaynameText: {
    marginTop: 16,
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 32,
    fontWeight: 'bold',
  },
  activitiesView: {
    alignItems: 'center',
    marginTop: 16,
    fontFamily: 'Arial Rounded MT Bold',
  },
  activitiesText: {
    fontSize: 16,
    fontFamily: 'Arial Rounded MT Bold',
  },
  touchableButtonDataView: {
    width: '88%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderRadius: 16,
  },
  buttonDataView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportMargin: {
    marginTop: 54,
  },
  settingMargin: {
    marginTop: 16,
  },
  exportDataText: {
    fontFamily: 'Arial Rounded MT Bold',
  },
  comingSoonText: {
    opacity: 0.5,
  },
});

export default Profile;
 