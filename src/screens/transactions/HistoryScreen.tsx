import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getTransactionsByUser, deleteTransaction } from '../../database/db';
import { useIsFocused } from '@react-navigation/native'; // 1. Added focus hook to auto-refresh on tab switch

const HistoryScreen = ({ route }: any) => {
  // Added a hard fallback fallback (e.g., 1) so it never halts when mounted directly as a tab screen
  const userId = route.params?.userId || 1; 
  const [transactions, setTransactions] = useState<any[]>([]);
  const isFocused = useIsFocused(); // Tracks when the user switches to this tab

  const fetchHistory = async () => {
    if (!userId) return;
    try { 
      const data = await getTransactionsByUser(userId);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Runs fetch whenever the screen is focused or the userId changes
  useEffect(() => {
    if (isFocused) {
      fetchHistory();
    }
  }, [userId, isFocused]);

  const handleDelete = (transactionId: number) => {
  Alert.alert('Delete Transaction', 'Are you sure you want to delete this?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        // 1 Await the absolute completion of the database deletion
        await deleteTransaction(transactionId, userId);
        
        // 2 Clear out local state inside history screen immediately
        fetchHistory(); 
      },
    },
  ]);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions recorded yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.transaction_id.toString()}
          showsVerticalScrollIndicator={false} 
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.category}>{item.category} ({item.type})</Text>
                <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.date}>{item.transaction_date}</Text>
              </View>
              <View style={styles.rightBlock}>
                <Text style={[styles.amount, { color: item.type === 'Income' ? '#8ce629' : '#ff4d4d' }]}>
                  {item.type === 'Income' ? '+' : '-'} RM {item.amount.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.transaction_id)} activeOpacity={0.7}>
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 20 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  emptyText: { color: '#555555', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#262626' },
  category: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#aaaaaa', fontSize: 14, marginTop: 2 },
  date: { color: '#555555', fontSize: 12, marginTop: 4 },
  rightBlock: { alignItems: 'flex-end', minWidth: 90 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { color: '#ff4d4d', marginTop: 8, fontSize: 13, fontWeight: '600' },
});

export default HistoryScreen;