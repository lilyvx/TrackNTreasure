import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = () => (
  <View style={styles.center}><Text>Dashboard Screen</Text></View>
);

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
export default DashboardScreen;