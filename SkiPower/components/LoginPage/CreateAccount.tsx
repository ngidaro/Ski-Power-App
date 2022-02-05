// React
import React, { useState } from 'react';

// React-Native
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import { StackActions } from '@react-navigation/native';

// Services
import { AuthenticationService } from '../../services/authentication.service';

//Components
import InputTextbox from '../reusable/InputTextbox';
import SubmitButton from '../reusable/SubmitButton';

// Images
var SkiPowerLogo = require ('../../images/logo.png');

interface CreateAccountProps {
	setView: (view: string) => void,
  navigation: any;
}

const CreateAccount = ({ setView, navigation }: CreateAccountProps) => {
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createaccount = () => {
    const services = new AuthenticationService()
    services.createAccount(firstname, lastname, email, password).then((res) => {
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
          navigation.dispatch(
            StackActions.replace("LoggedIn")
          );
        }
      }
    });
  }

	return (
		<View style={styles.view}>
			<Image style={styles.image} source={SkiPowerLogo}/>
      <InputTextbox value={firstname} placeholder='Firstname' onChange={setFirstname}/>
      <InputTextbox value={lastname} placeholder='Lastname' onChange={setLastname}/>
      <InputTextbox value={email} placeholder='Email' onChange={setEmail}/>
      <InputTextbox value={password} placeholder='Password' isPassword onChange={setPassword}/>
      <SubmitButton text='Register' buttonClicked={() => createaccount()}/>
			<Text style={styles.haveAnAccountText} onPress={() => setView('signin')}>Already have an account?</Text>
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
  haveAnAccountText: {
    margin: 8,
    color: '#2196F3'
  },
});

export default CreateAccount;
