import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';

const SettingsScreen = ({ route, navigation }: any) => {
  const userId = route?.params?.userId ?? 1;

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            //resets navigation stack so back button can't return to dashboard
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={[styles.fMed, styles.subText]}>Manage</Text>
          <Text style={[styles.fBold, styles.title]}>Settings</Text>
        </View>

        {/* ── App Info ── */}
        <Text style={[styles.fMed, styles.sectionLabel]}>About</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={[styles.fMed, styles.infoKey]}>App Name</Text>
            <Text style={[styles.fNorm, styles.infoValue]}>TrackNTreasure</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={[styles.fMed, styles.infoKey]}>Version</Text>
            <Text style={[styles.fNorm, styles.infoValue]}>1.0.0</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={[styles.fMed, styles.infoKey]}>Storage</Text>
            <Text style={[styles.fNorm, styles.infoValue]}>SQLite (Local)</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={[styles.fMed, styles.infoKey]}>Platform</Text>
            <Text style={[styles.fNorm, styles.infoValue]}>
              {Platform.OS === 'ios' ? 'iOS' : 'Android'}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={[styles.fMed, styles.infoKey]}>User ID</Text>
            <Text style={[styles.fNorm, styles.infoValue]}>#{userId}</Text>
          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={[styles.fBold, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
    flexGrow: 1,
  },

  //header
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  subText: {
    fontSize: 11,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
  },

  sectionLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  //info
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#262626',
    marginHorizontal: 16,
  },
  infoKey: {
    fontSize: 14,
    color: '#ffffff',
  },
  infoValue: {
    fontSize: 14,
    color: '#666666',
  },

  //logout
  logoutButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  fMed: {
    fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  fBold: {
    fontFamily: ios ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed',
    fontWeight: 'bold',
  },
  fNorm: {
    fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-normal',
  },
});

export default SettingsScreen;