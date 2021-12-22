// React
import React, { useState } from 'react';

// React-Native
import { View } from 'react-native';

// Components
import CreateAccount from './CreateAccount';
import SignIn from './SignIn';

interface LoginPageProps {
  setToken: (token: string) => void,
}

const LoginPage = ({setToken}: LoginPageProps) => {
  const [view, setView] = useState('signin')

  const components: any = {
    'signin': <SignIn setView={setView} setToken={setToken} />,
    'createaccount' : <CreateAccount setView={setView} setToken={setToken} />,
  }

  return (
    <View>
      {components[view]}
    </View>
  );
};

export default LoginPage;
