import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';
import { getWalletSummary, getTransactionsByUser, getBudgetByUser } from '../../database/db';
import { connectWebSocket } from '../../services/WebSocket';
import { Transaction, WalletSummary } from '../../types/index';

interface DashboardMetrics extends WalletSummary {
  monthly_budget_limit: number;
}

const fCurrency = (val: number): string => val.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fDate = (str: string): string => new Date(str).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
const getProgress = (exp: number, lim: number): number => lim <= 0 ? 0 : Math.min((exp / lim) * 100, 100);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => <Text style={[styles.fMed, styles.label]}>{text}</Text>;

const TransactionRow: React.FC<{ item: Transaction }> = ({ item }) => {
  const isInc = item.type === 'Income';
  return (
    <View style={[styles.card, styles.row, { paddingVertical: 14, paddingHorizontal: 16 }]}>
      <View style={[styles.row, { flex: 1, marginRight: 12, justifyContent: 'flex-start' }]}>
        <View style={[styles.dot, { backgroundColor: isInc ? '#8ce629' : '#ff4444' }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.fNorm, { color: '#fff', fontWeight: '500' }]} numberOfLines={1}>{item.description}</Text>
          <Text style={[styles.fNorm, styles.subText]}>{item.category}{'  ·  '}<Text style={{ color: '#444' }}>{fDate(item.transaction_date)}</Text></Text>
        </View>
      </View>
      <Text style={[styles.fBold, { fontSize: 14 }, isInc ? styles.tInc : styles.tExp]}>{isInc ? '+' : '-'} RM {fCurrency(item.amount)}</Text>
    </View>
  );
};

export const DashboardScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const USER_ID = 1;
  const [history, setHistory] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({ current_balance: 0, total_income: 0, total_expenses: 0, remaining_budget: 0, monthly_budget_limit: 0 });

  const syncData = async () => {
    try {
      const wallet = await getWalletSummary(USER_ID);
      const list = await getTransactionsByUser(USER_ID);
      const budget = await getBudgetByUser(USER_ID);
      setMetrics({ ...wallet, monthly_budget_limit: budget?.monthly_limit ?? 0 });
      setHistory(list);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    syncData();
    connectWebSocket(USER_ID, (msg) => { if (msg.type === 'TRANSACTION_ADDED') syncData(); });
  }, []);

  const progress = getProgress(metrics.total_expenses, metrics.monthly_budget_limit);
  const color = progress >= 100 ? '#ff4444' : progress >= 80 ? '#f0a500' : '#8ce629';
  const hasBudget = metrics.monthly_budget_limit > 0;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.row, { marginBottom: 24 }]}>
          <View>
            <Text style={[styles.fMed, styles.subText, { fontSize: 11, letterSpacing: 1.5, marginBottom: 2 }]}>Overview</Text>
            <Text style={[styles.fBold, { fontSize: 28, color: '#fff' }]}>Dashboard</Text>
          </View>
          <View style={[styles.dot, { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8ce629', marginRight: 0 }]} />
        </View>

        <SectionLabel text="Current Balance" />
        <View style={[styles.card, { paddingVertical: 36, paddingHorizontal: 20, alignItems: 'center', borderRadius: 16 }]}>
          <Text style={[styles.fBold, { fontSize: 20, color: '#666', marginBottom: 4 }]}>RM</Text>
          <Text style={[styles.fBold, { fontSize: 48, color: '#fff' }]}>{fCurrency(metrics.current_balance)}</Text>
        </View>

        <SectionLabel text="This Month" />
        <View style={[styles.row, { gap: 12 }]}>
          {[['Total Income', metrics.total_income, '#8ce629', styles.tInc], ['Total Expenses', metrics.total_expenses, '#ff4444', styles.tExp]].map(([lbl, val, bg, txt]: any) => (
            <View key={lbl} style={[styles.card, { flex: 1, padding: 16, overflow: 'hidden' }]}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: bg }} />
              <Text style={[styles.fMed, styles.subText, { fontSize: 11, marginTop: 6, marginBottom: 8 }]}>{lbl}</Text>
              <Text style={[styles.fBold, { fontSize: 18 }, txt]}>{lbl.includes('Inc') ? '+' : '-'}RM {fCurrency(val)}</Text>
            </View>
          ))}
        </View>

        <SectionLabel text="Monthly Budget" />
        {hasBudget ? (
          <View style={[styles.card, { padding: 16 }]}>
            <View style={[styles.row, { alignItems: 'flex-end', marginBottom: 14 }]}>
              <View>
                <Text style={[styles.fMed, styles.subText, { fontSize: 11, marginBottom: 4 }]}>Limit set</Text>
                <Text style={[styles.fBold, { fontSize: 16, color: '#fff' }]}>RM {fCurrency(metrics.monthly_budget_limit)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.fMed, styles.subText, { fontSize: 11, marginBottom: 4 }]}>Remaining</Text>
                <Text style={[styles.fBold, { fontSize: 20, color }]}>RM {fCurrency(metrics.remaining_budget)}</Text>
              </View>
            </View>
            <View style={{ height: 6, backgroundColor: '#262626', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
              <View style={{ height: '100%', width: `${progress}%`, backgroundColor: color }} />
            </View>
            <View style={styles.row}>
              <Text style={[styles.fNorm, { fontSize: 12, color: '#666' }]}>{progress.toFixed(1)}% used</Text>
              {progress >= 80 && <Text style={[styles.fBold, { fontSize: 12, color }]}>⚠ {progress >= 100 ? 'Over budget' : '80% reached'}</Text>}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={[styles.card, { padding: 20, borderStyle: 'dashed', alignItems: 'center' }]} activeOpacity={0.75} onPress={() => navigation?.navigate('Budget')}>
            <Text style={[styles.fBold, { fontSize: 15, color: '#444', marginBottom: 4 }]}>No budget set</Text>
            <Text style={[styles.fNorm, { fontSize: 13, color: '#8ce629' }]}>Tap to set your monthly spending limit →</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.row, { alignItems: 'flex-end' }]}>
          <SectionLabel text="Recent Transactions" />
          {history.length > 5 && <TouchableOpacity onPress={() => navigation?.navigate('History')}><Text style={[styles.fNorm, { fontSize: 12, color: '#8ce629', marginBottom: 10 }]}>See all</Text></TouchableOpacity>}
        </View>

        {history.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 12 }}>
            <Text style={[styles.fNorm, { color: '#444', fontSize: 14, marginBottom: 4 }]}>No transactions recorded yet.</Text>
            <Text style={[styles.fNorm, { color: '#333', fontSize: 12, textAlign: 'center' }]}>Tap the button below to add your first entry.</Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>{history.slice(0, 5).map(item => <TransactionRow key={item.transaction_id!.toString()} item={item} />)}</View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => navigation?.navigate('Add')}><Text style={[styles.fBold, { fontSize: 32, color: '#0d0d0d', lineHeight: 36 }]}>+</Text></TouchableOpacity>
    </View>
  );
};

const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d0d' },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, borderWidth: 1, borderColor: '#262626' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12, flexShrink: 0 },
  label: { fontSize: 12, color: '#888888', fontWeight: '600', marginBottom: 10, marginTop: 24, letterSpacing: 1, textTransform: 'uppercase' },
  subText: { fontSize: 11, color: '#666666', textTransform: 'uppercase', letterSpacing: 0.8 },
  tInc: { color: '#8ce629' },
  tExp: { color: '#ff4444' },
  fMed: { fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-medium' },
  fBold: { fontFamily: ios ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed', fontWeight: 'bold' },
  fNorm: { fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-normal' },
  fab: { position: 'absolute', bottom: 88, left: '50%', marginLeft: -30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#8ce629', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#8ce629', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
});

export default DashboardScreen;