import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text,View,Platform, TouchableOpacity, StyleSheet} from 'react-native';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'; //  Fixed with curly braces!
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import HistoryScreen from '../screens/transactions/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import BudgetScreen from '../screens/dashboard/BudgetScreen';


const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }: any) => {
  const { userId } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8ce629', // Your brand lime accent
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.labelStyle,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        initialParams={{ userId }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        initialParams={{ userId }}
      />
      
      <Tab.Screen 
        name="Add" 
        component={AddTransactionScreen}
        initialParams={{ userId }}
      />

      {/* Embedded directly here so it retains the bottom tab bar layout */}
      <Tab.Screen 
        name="Budget" 
        component={BudgetScreen}
        initialParams={{ userId }}
        options={{
          title: 'Budget',
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={{ userId }}
      />
    </Tab.Navigator>
  );
};

const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0d0d0d',
    borderTopColor: '#262626',
    borderTopWidth: 1,
    height: ios ? 88 : 64,
    paddingBottom: ios ? 30 : 10,
    paddingTop: 10,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-normal',
  }
});

export default TabNavigator;