import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Platform, StatusBar } from 'react-native';
import { getWalletSummary, getTransactionsByUser } from '../../database/db'; 
import { connectWebSocket } from '../../services/WebSocket'; 
import { Transaction, WalletSummary } from '../../types/index'; 

export const DashboardScreen = () => {
  //hardcode user identity session context pointer for standalone component verification
  const CURRENT_USER_ID = 1;

  const [metrics, setMetrics] = useState<WalletSummary>({
    current_balance: 0,
    total_income: 0,
    total_expenses: 0,
    remaining_budget: 0,
  });
  const [history, setHistory] = useState<Transaction[]>([]);

  //internal data sync runner pulling from device hardware 
  const syncLocalrecord = async () => {
    try {
      const walletSummary = await getWalletSummary(CURRENT_USER_ID);
      const transactionList = await getTransactionsByUser(CURRENT_USER_ID);
      setMetrics(walletSummary);
      setHistory(transactionList);
    } catch (error) {
      console.error('Failed to pull local hardware storage states:', error);
    }
  };

  useEffect(() => {
    
    syncLocalrecord();

    //set up network event receiver to capture global broadcast signals instantly
    const ws = connectWebSocket(CURRENT_USER_ID, (incomingData) => {
      if (incomingData.type === 'TRANSACTION_ADDED') {
        console.log('Dashboard interceptor updating metrics via live package event...');
        syncLocalrecord();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/*balance headline*/}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>RM {metrics.current_balance.toFixed(2)}</Text>
      </View>

      {/*split expense income row*/}
      <View style={styles.statsRow}>
        <View style={styles.statPanel}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, styles.incomeColor]}>+RM {metrics.total_income.toFixed(2)}</Text>
        </View>
        <View style={styles.statPanel}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={[styles.statValue, styles.expenseColor]}>-RM {metrics.total_expenses.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {/*realtime history records*/}
      <FlatList
        data={history}
        keyExtractor={(item) => item.transaction_id!.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={[styles.itemAmount, item.type === 'Income' ? styles.incomeColor : styles.expenseColor]}>
              {item.type === 'Income' ? '+' : '-'} RM {item.amount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions recorded yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', paddingHorizontal: 24, paddingTop: 24 },
  balanceCard: { backgroundColor: '#1a1a1a', borderRadius: 16, paddingVertical: 28, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: '#262626', marginBottom: 16 },
  balanceLabel: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium', fontSize: 12, color: '#888888', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  balanceValue: { fontFamily: Platform.OS === 'ios' ? 'HelveticaEngine-CondensedBold' : 'sans-serif-condensed', fontSize: 42, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statPanel: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#262626' },
  statLabel: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium', fontSize: 11, color: '#888888', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed', fontSize: 15, fontWeight: 'bold', color: '#8ce629', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  listContainer: { gap: 10, paddingBottom: 24 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#262626' },
  itemDescription: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-normal', fontSize: 15, color: '#ffffff', fontWeight: '500' },
  itemCategory: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-normal', fontSize: 12, color: '#666666', marginTop: 2 },
  itemAmount: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed', fontSize: 16, fontWeight: 'bold' },
  incomeColor: { color: '#8ce629' },
  expenseColor: { color: '#ff4444' },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-normal', color: '#444444', fontSize: 14 },
});

export default DashboardScreen;