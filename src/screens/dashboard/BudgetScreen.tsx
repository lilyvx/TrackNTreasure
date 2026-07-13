import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getBudgetByUser, updateBudgetLimit } from '../../database/db';

export const BudgetScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const CURRENT_USER_ID = 1;
  const [limit, setLimit] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const budget = await getBudgetByUser(CURRENT_USER_ID);
        if (budget?.monthly_limit) setLimit(budget.monthly_limit.toString());
      } catch (err) {
        console.error('Failed to load existing budget:', err);
      }
    })();
  }, []);

  const handleSave = async () => {
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit < 0) return;

    setLoading(true);
    try {
      await updateBudgetLimit(CURRENT_USER_ID, parsedLimit);
      navigation?.goBack(); // Return to dashboard to trigger live sync refresh
    } catch (err) {
      console.error('Failed to update budget limit configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <View style={[styles.row, { marginBottom: 32 }]}>
          <View>
            <Text style={[styles.fMed, styles.subText]}>Start Tracking</Text>
            <Text style={[styles.fBold, styles.title]}>Monthly Budget</Text>
          </View>
        </View>

        <Text style={[styles.fMed, styles.label]}>Set Spending Limit</Text>
        <View style={[styles.card, styles.inputContainer]}>
          <Text style={[styles.fBold, styles.currencyPrefix]}>RM</Text>
          <TextInput
            style={[styles.fBold, styles.input]}
            placeholder="0.00"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
            editable={!loading}
          />
        </View>
        <Text style={[styles.fNorm, styles.hintText]}>
          
        </Text>

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          style={[styles.btn, loading && { opacity: 0.6 }]} 
          activeOpacity={0.85} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[styles.fBold, styles.btnText]}>{loading ? 'SAVING...' : 'SAVE BUDGET LIMIT'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─────────────────────────────────────────────────────────────
// SHARED DESIGN TOKEN COMPATIBLE STYLES
// ─────────────────────────────────────────────────────────────
const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, flexGrow: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, color: '#fff', marginTop: 2 },
  subText: { fontSize: 11, color: '#666666', textTransform: 'uppercase', letterSpacing: 1.5 },
  label: { fontSize: 12, color: '#888888', fontWeight: '600', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, borderWidth: 1, borderColor: '#262626' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 64, marginBottom: 12 },
  currencyPrefix: { fontSize: 20, color: '#666', marginRight: 12 },
  input: { flex: 1, fontSize: 24, color: '#ffffff', padding: 0 },
  hintText: { fontSize: 13, color: '#444', lineHeight: 18 },
  btn: { backgroundColor: '#8ce629', height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  btnText: { fontSize: 14, color: '#0d0d0d', letterSpacing: 1 },
  fMed: { fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-medium' },
  fBold: { fontFamily: ios ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed', fontWeight: 'bold' },
  fNorm: { fontFamily: ios ? 'Helvetica Neue' : 'sans-serif-normal' },
});

export default BudgetScreen;