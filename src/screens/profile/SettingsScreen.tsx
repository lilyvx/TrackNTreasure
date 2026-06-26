import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => (
  <View style={styles.center}><Text>Settings Screen</Text></View>
);

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
export default SettingsScreen;