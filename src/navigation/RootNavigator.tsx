import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen'; 
import RegisterScreen from '../screens/auth/RegisterScreen';
import TabNavigator from './TabNavigator'; 
import DrawerNavigator from './DrawerNavigator';
import BudgetScreen from '../screens/dashboard/BudgetScreen';
const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0d0d0d' } }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/*swap prev dashboard screen with the completed tabnavigator, now change to drawernavigator*/}
      <Stack.Screen name="MainTabs" component={DrawerNavigator} /> 

    </Stack.Navigator>
  );
};

export default RootNavigator;