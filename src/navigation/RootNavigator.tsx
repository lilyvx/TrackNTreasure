import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen'; 
import DashboardScreen from '../screens/dashboard/DashboardScreen'; 
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0d0d0d' } }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="TransactionForm" component={AddTransactionScreen} />
      <Stack.Screen name="Register"component={RegisterScreen} />  
    </Stack.Navigator>
  );
};

export default RootNavigator;