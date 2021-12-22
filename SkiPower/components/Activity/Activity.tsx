// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

const Activity = ({ navigation }) => {

  return (
    <View style={styles.view}>
      <Text>Activity</Text>
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
 