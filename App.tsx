import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';

const App = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (
        <DrawerNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;