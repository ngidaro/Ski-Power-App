// React
import React, { useState } from 'react';

// React-Native
import {
StyleSheet,
View,
Image,
Text,
} from 'react-native';

// Components
import InputTextbox from './reusable/InputTextbox';
import SubmitButton from './reusable/SubmitButton';

// Images
var SkiPowerLogo = require ('../images/logo.png');

interface SignInProps {
  setView: (view: string) => void,
}

const SignIn = ({ setView }: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={SkiPowerLogo}/>
      <InputTextbox value={email} placeholder='Email' onChange={setEmail}/>
      <InputTextbox value={password} placeholder='Password' onChange={setPassword}/>
      <SubmitButton text='Log In' buttonClicked={() => console.log("Logged In")}/>
      <Text style={styles.createAccountText} onPress={() => setView('createaccount')}>Create Account?</Text>
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
  image: {
    margin: 12,
  },
  createAccountText: {
    margin: 8,
    color: '#2196F3'
  },
});

export default SignIn;
 