// React
import React, { useState } from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

// React-Query
import { useQuery } from 'react-query';
import { User } from '../../models/User';
import { getUser } from '../../react-query/users/query';

// Models
import { USER } from '../../react-query/users/queryKeys';

interface HomePageProps {
  navigation: any
}

const HomePage = ({ navigation }: HomePageProps) => {

  const [user, setUser] = useState<User | null>(null);
  
  const goToDetails = () => {
    // navigation.getParent()
    navigation.navigate("Activity", {user: user});
  }

  const { data } = useQuery(USER, async () => getUser(),
    { onSuccess: (dataAPI) => setUser(dataAPI.data) })

  return (
    <View style={styles.view}>
      <Text>{user?.displayname}</Text>
      <Text onPress={() => goToDetails()}>Home</Text>
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
  },
});

export default HomePage;
 