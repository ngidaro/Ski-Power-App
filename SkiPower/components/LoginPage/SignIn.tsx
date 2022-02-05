// React
import React, { useState } from 'react';

// React-Native
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import { StackActions } from '@react-navigation/native';

// Services
import { AuthenticationService } from '../../services/authentication.service';

// Components
import InputTextbox from '../reusable/InputTextbox';
import SubmitButton from '../reusable/SubmitButton';

// Images
var SkiPowerLogo = require ('../../images/logo.png');

interface SignInProps {
  setView: (view: string) => void;
  navigation: any;
}

const SignIn = ({ setView, navigation }: SignInProps) => {
  const [email, setEmail] = useState('ngidaro@hotmail.com');
  const [password, setPassword] = useState('123');

  const login = () => {
    const services = new AuthenticationService()
    services.login(email, password).then((res) => {
      if (!res["success"]){
        Snackbar.show({
          text: res["error"] || 'Error',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        })
      } else {
        // Save user token here
        if (res.data.token) {
          AuthenticationService.saveToken(res.data.token);
          // Re-routes to LoggedIn Stack and removing the LoginPage as the parent
          navigation.dispatch(
            StackActions.replace("LoggedIn")
          );
        }
      }
    })
  }

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={SkiPowerLogo}/>
      <InputTextbox value={email} placeholder='Email' onChange={setEmail}/>
      <InputTextbox value={password} placeholder='Password' isPassword onChange={setPassword}/>
      <SubmitButton text='Log In' buttonClicked={login}/>
      <Text style={styles.createAccountText} onPress={() => setView('createaccount')}>Create Account?</Text>
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
  image: {
    margin: 12,
  },
  createAccountText: {
    margin: 8,
    color: '#2196F3'
  },
});

export default SignIn;
 