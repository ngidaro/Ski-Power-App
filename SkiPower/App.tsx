// React
import React from 'react';

// React-Native
import { NavigationContainer } from '@react-navigation/native';

//React-Query
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import NavigationStack from './components/NavigationStack';

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