import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator'; 
import { initDatabase } from './src/database/db';

//ignore log notifications in the app for testing environment if needed
LogBox.ignoreLogs(['LOG  Database connected successfully!']);

function App(): React.JSX.Element {
  
  useEffect(() => {
    const setupApp = async () => {
      try {
        //run db schema setup on initialization  
        await initDatabase();
        console.log('🎉 Application ready: Database tables is fully online.');
      } catch (error) {
        console.error('CRITICAL: App setup failed:', error);
        Alert.alert(
          'System Initialize Error',
          'Could not initialize the local database file. Please clear storage and try again.'
        );
      }
    };

    setupApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;