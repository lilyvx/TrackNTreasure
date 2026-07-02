import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Reusable logo
const AppLogo = () => (
  <View style={styles.logoSection}>
    <View style={styles.logoRing}>
      <View style={styles.logoCircle}>
        {/* Swap this Text with <Image> when you have a real logo asset */}
        <Text style={styles.logoEmoji}>🗺️</Text>
      </View>
    </View>
    <Text style={styles.appName}>TrackNTreasure</Text>
    <Text style={styles.appTagline}>Your financial manager</Text>
  </View>
);

const styles = StyleSheet.create({
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#8ce629',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  appTagline: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontSize: 13,
    color: '#555555',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default AppLogo;