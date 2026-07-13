import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserById } from '../../database/db';

const ProfileScreen = ({ route, navigation }: any) => {
  const { userId } = route.params || {};
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userData = await getUserById(userId);
        setUser(userData);
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.username?.substring(0, 2).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.username}>{user?.username || 'Loading...'}</Text>
        <Text style={styles.email}>{user?.email || 'Loading...'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Account</Text>
        <Text style={styles.infoLabel}>User ID: <Text style={styles.infoValue}>{userId}</Text></Text>
        <Text style={styles.infoLabel}>Local Device Storage Engine: <Text style={styles.infoValue}>SQLite (WAL Mode)</Text></Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Log Out Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 24, justifyContent: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#8ce629', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#0d0d0d', fontSize: 32, fontWeight: 'bold' },
  username: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  email: { color: '#555555', fontSize: 14, marginTop: 4 },
  infoCard: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#262626', marginBottom: 40 },
  infoTitle: { color: '#8ce629', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  infoLabel: { color: '#888888', marginBottom: 8, fontSize: 14 },
  infoValue: { color: '#ffffff', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ff4d4d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;