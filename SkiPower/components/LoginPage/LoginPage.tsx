// React
import React, { useState } from 'react';

// React-Native
import { View } from 'react-native';

// Components
import CreateAccount from './CreateAccount';
import SignIn from './SignIn';

const LoginPage = () => {
  const [view, setView] = useState('signin')

  const components: any = {
    'signin': <SignIn setView={setView} />,
    'createaccount' : <CreateAccount setView={setView} />,
  }

  return (
    <View>
      {components[view]}
    </View>
  );
};

export default LoginPage;
