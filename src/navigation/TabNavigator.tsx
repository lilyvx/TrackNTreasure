import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import HistoryScreen from '../screens/transactions/HistoryScreen';

//temporary placeholder for history and profile page
const HistoryPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#ffffff' }}>Transaction History page</Text>
  </View>
);

const ProfilePlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#ffffff' }}>User Profile page</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }: any) => {
  //get user id from login to keep passing to dashboard
  const { userId } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a', 
          borderTopWidth: 1,
          borderTopColor: '#262626',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#8ce629',   //active tabs
        tabBarInactiveTintColor: '#555555', //inactive tabs 
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        initialParams={{ userId }} //pass user session id to the dashboard calculations
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        initialParams={{ userId }} 
        options={{ tabBarLabel: 'History' }} />
        
      <Tab.Screen 
        name="Add" 
        component={AddTransactionScreen} 
        initialParams={{ userId }}
        options={{ tabBarLabel: '+ Add' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePlaceholder} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;