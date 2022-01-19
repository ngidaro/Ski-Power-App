// React
import React, { useState } from 'react';

// React-Native
import {
StyleSheet,
View,
} from 'react-native';

// Models
import { User } from '../../models/User';

// React-Query
import { useQuery } from 'react-query';
import { getUser } from '../../react-query/users/query';
import { USER } from '../../react-query/users/queryKeys';

import Timer from './Timer';
import { Text } from 'react-native-elements';


const Activity = ({ route, navigation }) => {

  const [user, setUser] = useState<User | null>(null);

  const { data } = useQuery(USER, async () => getUser(),
    { onSuccess: (dataAPI) => setUser(dataAPI.data) })

  return (
    <View style={styles.view}>
      {/* <Text>{user?.firstname}</Text> */}
      <Timer />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

});

export default Activity;
 