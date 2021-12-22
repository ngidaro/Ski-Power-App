// React
import React from 'react';

// React-Native
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//React-Query
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import NavigationStack from './components/NavigationStack';

const Stack = createNativeStackNavigator();

const App = () => {
  const queryClient = new QueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
};
export default App;