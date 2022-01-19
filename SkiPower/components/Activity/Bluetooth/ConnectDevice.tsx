// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
} from 'react-native';
import ScanBluetooth from './ScanBluetooth';

const ConnectDevice = () => {
  return (
    <View style={styles.view}>
      <ScanBluetooth />
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

export default ConnectDevice;
 