import 'react-native-gesture-handler'; 
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigation/AuthNavigator';


const App = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
     
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (
        /* placeholder for app navigator */
        null 
      )}
    </NavigationContainer>
  );
};

export default App;