import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen'; 
import RegisterScreen from '../screens/auth/RegisterScreen';
import TabNavigator from './TabNavigator'; 

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0d0d0d' } }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/*swap prev dashboard screen with the completed tabnavigator*/}
      <Stack.Screen name="MainTabs" component={TabNavigator} /> 
    </Stack.Navigator>
  );
};

export default RootNavigator;