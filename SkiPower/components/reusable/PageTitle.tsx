// React
import React from 'react';

// React-Native
import {
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <View style={styles.view}>
      <Text style={styles.textName}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({  
  view: {
    position: 'absolute',
    top: 56,
    left: 16,
    width: '100%',
  },
  textName: {
    fontSize: 32,
    fontFamily: 'Arial Rounded MT Bold',
  },
});

export default PageTitle;
 