import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './TabNavigator';
import CurrencyScreen from '../screens/currency/CurrencyScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerTitle: 'TracknTreasure' }}>
      <Drawer.Screen name="Main" component={TabNavigator} options={{ drawerLabel: 'Dashboard' }} />
      <Drawer.Screen name="Currency Exchange" component={CurrencyScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};