// React
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

// React-Native
import { StyleSheet, View } from 'react-native';
import { AuthenticationService } from '../../services/authentication.service';

// Components
import CreateAccount from './CreateAccount';
import SignIn from './SignIn';

interface LoginPageProps {
  navigation?: any;
}

const LoginPage = ({ navigation }: LoginPageProps) => {
  const [view, setView] = useState('signin')

  useEffect(() => {
    AuthenticationService.getToken().then((token) => {
      if (token) {
        // Re-routes to LoggedIn Stack and removing the LoginPage as the parent
        navigation.dispatch(
          StackActions.replace("LoggedIn")
        );
      }
    });
  },[])

  const components: any = {
    'signin': <SignIn setView={setView} navigation={navigation} />,
    'createaccount' : <CreateAccount navigation={navigation} setView={setView} />,
  }

  return (
    <View style={styles.view}>
      {components[view]}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',    
    width: '100%',
    height: '100%',
  },
});

export default LoginPage;
