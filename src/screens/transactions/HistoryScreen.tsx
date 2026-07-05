import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getTransactionsByUser, deleteTransaction } from '../../database/db';

const HistoryScreen = ({ route }: any) => {
  const { userId } = route.params || {};
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchHistory = async () => {
    if (!userId) return;
    try { 
      const data = await getTransactionsByUser(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const handleDelete = (transactionId: number) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(transactionId, userId);
          fetchHistory(); //refresh 
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
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.category}>{item.category} ({item.type})</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.date}>{item.transaction_date}</Text>
              </View>
              <View style={styles.rightBlock}>
                <Text style={[styles.amount, { color: item.type === 'Income' ? '#8ce629' : '#ff4d4d' }]}>
                  {item.type === 'Income' ? '+' : '-'} RM{item.amount.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.transaction_id)}>
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
  rightBlock: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { color: '#ff4d4d', marginTop: 8, fontSize: 13 },
});

export default HistoryScreen;