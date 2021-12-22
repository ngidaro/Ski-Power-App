// React
import React, { useState } from 'react';

// React-Native
import {
 StyleSheet,
 View,
 Text,
 Image,
} from 'react-native';

//Components
import InputTextbox from './reusable/InputTextbox';
import SubmitButton from './reusable/SubmitButton';

// Images
var SkiPowerLogo = require ('../images/logo.png');

interface CreateAccountProps {
	setView: (view: string) => void,
}

const CreateAccount = ({setView}: CreateAccountProps) => {
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

	return (
		<View style={styles.view}>
			<Image style={styles.image} source={SkiPowerLogo}/>
      <InputTextbox value={firstname} placeholder='Firstname' onChange={setFirstname}/>
      <InputTextbox value={lastname} placeholder='Lastname' onChange={setLastname}/>
      <InputTextbox value={email} placeholder='Email' onChange={setEmail}/>
      <InputTextbox value={password} placeholder='Password' onChange={setPassword}/>
      <SubmitButton text='Register' buttonClicked={() => console.log("registered")}/>
			<Text style={styles.haveAnAccountText} onPress={() => setView('signin')}>Already have an account?</Text>
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
  haveAnAccountText: {
    margin: 8,
    color: '#2196F3'
  },
});

export default CreateAccount;
