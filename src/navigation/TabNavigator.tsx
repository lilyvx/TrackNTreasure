import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import HistoryScreen from '../screens/transactions/HistoryScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-circle';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Activity') iconName = 'list';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Activity" component={HistoryScreen} />
      <Tab.Screen name="Add" component={AddTransactionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};