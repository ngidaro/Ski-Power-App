// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

interface HomePageProps {
  user: Object,
  navigation: any
}

const HomePage = ({ user, navigation }: HomePageProps) => {
  
  const goToDetails = () => {
    // navigation.getParent()
    navigation.navigate("Activity");
  }

  return (
    <View style={styles.view}>
      <Text onPress={() => goToDetails()}>Home</Text>
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

export default HomePage;
 