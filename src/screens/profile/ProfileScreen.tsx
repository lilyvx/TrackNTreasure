import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => (
  <View style={styles.center}><Text>Profile Screen</Text></View>
);

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
export default ProfileScreen;