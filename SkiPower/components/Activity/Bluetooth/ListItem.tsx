// React
import React from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
} from 'react-native';

interface ListItemProps {
  name: string,
  isConnected: boolean,
}

const ListItem = ({ name, isConnected }: ListItemProps) => {
  return (
    <View style={styles.view}>
      <Text style={styles.item}>{name}</Text>
      <Text style={styles.itemConnect}>{isConnected ? 'Connected' : 'Not Connected'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  item: {
    height: 44,
    fontSize: 18,
    padding: 10,
  },
  itemConnect: {
    fontSize: 14,
    color: 'gray',
    padding: 10,
  },
});

export default ListItem;
 