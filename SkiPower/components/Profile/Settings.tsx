// React
import React from 'react';

// React-Native
import {
  StyleSheet, TouchableHighlight, View,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Text } from 'react-native-elements';
import { User } from '../../models/User';
import { AuthenticationService } from '../../services/authentication.service';
import FloatingTextField from '../reusable/FloatingTextfield';

// Components

interface SettingsProps {
  route: any;
  navigation: any;
}

const Settings = ({ route, navigation }: SettingsProps) => {

  const user: User = route.params.user;

  const logout = () => {
    // Re-routes to Login Stack and removing the LoggedIn Stack as the parent
    AuthenticationService.clearToken();
    navigation.dispatch(
      StackActions.replace("Login")
    );
  }

  return (
    <View style={styles.view}>
      <FloatingTextField fieldName='Firstname' fieldValue={user.firstname} editable={false}/>
      <FloatingTextField fieldName='Lastname' fieldValue={user.lastname} editable={false}/>
      <FloatingTextField fieldName='Email' fieldValue={user.email} editable={false}/>
      <TouchableHighlight 
        style={styles.logoutTouchable}
        onPress={logout}
        underlayColor={"#D3D3D3"}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    padding: 16,
    alignItems: 'center',
  },
  logoutTouchable: {
    width: 128,
    textAlign: 'center',
    marginTop: 180,
    color: 'red',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'red',
  },
  logoutText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Settings;
 