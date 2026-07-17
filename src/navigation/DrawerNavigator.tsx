import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HistoryScreen from '../screens/transactions/HistoryScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ route }: any) => {
  const { userId } = route.params || {};

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true, 
        headerStyle: { backgroundColor: '#0d0d0d', borderBottomWidth: 1, borderBottomColor: '#262626', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#8ce629',
        drawerStyle: { backgroundColor: '#1a1a1a', width: 240 },
        drawerActiveTintColor: '#8ce629',
        drawerInactiveTintColor: '#aaaaaa',
      }}
    >
      <Drawer.Screen 
        name="Track N Treasure" 
        component={TabNavigator} 
        initialParams={{ userId }} 
        options={{ drawerLabel: 'Home' }}
      />
      
      <Drawer.Screen 
        name="SideProfile" 
        component={ProfileScreen} 
        initialParams={{ userId }} 
        options={{ drawerLabel: 'Profile' }}
      />
      <Drawer.Screen 
        name="SideSettings" 
        component={SettingsScreen} 
        initialParams={{ userId }} 
        options={{ drawerLabel: 'Settings' }}
      />

      <Drawer.Screen 
        name="SideHistory" 
        component={HistoryScreen} 
        initialParams={{ userId }} 
        options={{ drawerLabel: 'History' }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;