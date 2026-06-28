import React, { useState } from 'react';
import {StyleSheet,View,Text,TextInput,TouchableOpacity, ScrollView,Alert,} from 'react-native';
import { TransactionFormState, TransactionType, TransactionCategory } from '../types';

//constant match type definition
const INCOME_CATEGORIES: TransactionCategory[] = ['Salary', 'Bonus', 'Investment', 'Gifted'];
const EXPENSE_CATEGORIES: TransactionCategory[] = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Gift to others', 'Groceries'];

interface TransactionFormProps {
  onSave: (formData: TransactionFormState) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSave }) => {
  //initialize form state with transacformstate structure
  const [form, setForm] = useState<TransactionFormState>({
    amount: '',
    description: '',
    category: '',
    type: 'Expense', 
    transaction_date: new Date().toISOString().split('T')[0], // Formats to 'YYYY-MM-DD'
  });

  const handleInputChange = (field: keyof TransactionFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    //reset category if switching between income n expense 
    if (field === 'type') {
      setForm((prev) => ({ ...prev, type: value as TransactionType, category: '' }));
    }
  };

  const handleSubmit = () => {
    const { amount, description, category, type } = form;

    //submission checking
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('ERROR: ' ,'You have to enter an amount to log a transaction.');
      return;
    }
    if (!category) {
      Alert.alert('ERROR', 'Please select a transaction category.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('ERROR:', 'Please add a brief description.');
      return;
    }

    //pass validated form state to wrapper to execute db & server write
    onSave(form);
    
    // Clear inputs smoothly
    setForm({
      amount: '',
      description: '',
      category: '',
      type: 'Expense',
      transaction_date: new Date().toISOString().split('T')[0],
    });
  };

  const activeCategories = form.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Ledger Entry</Text>

      //transaction toggle button
      <Text style={styles.label}>Flow Type</Text>
      <View style={styles.toggleRow}>
        {(['Expense', 'Income'] as TransactionType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.toggleButton,
              form.type === t && (t === 'Expense' ? styles.activeExpense : styles.activeIncome),
            ]}
            onPress={() => handleInputChange('type', t)}
          >
            <Text style={[styles.toggleText, form.type === t && styles.activeToggleText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      //input amount
      <Text style={styles.label}>Amount (MYR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#888888"
        value={form.amount}
        onChangeText={(val) => handleInputChange('amount', val)}
      />

      //category selection 
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipContainer}>
        {activeCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, form.category === cat && styles.activeChip]}
            onPress={() => handleInputChange('category', cat)}
          >
            <Text style={[styles.chipText, form.category === cat && styles.activeChipText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      //description input
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={3}
        placeholder="What was this item for?"
        placeholderTextColor="#888888"
        value={form.description}
        onChangeText={(val) => handleInputChange('description', val)}
      />

      //submit button
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Commit Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#4a0006', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 14, color: '#cccccc', fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#300004',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#6b000a',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  toggleButton: { flex: 1, paddingVertical: 12, backgroundColor: '#300004', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#6b000a' },
  toggleText: { color: '#aaaaaa', fontSize: 16, fontWeight: '600' },
  activeToggleText: { color: '#ffffff' },
  activeExpense: { backgroundColor: '#b30006', borderColor: '#ff333a' },
  activeIncome: { backgroundColor: '#006622', borderColor: '#33cc66' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#300004', borderRadius: 20, borderWidth: 1, borderColor: '#6b000a' },
  activeChip: { backgroundColor: '#ffffff', borderColor: '#ffffff' },
  chipText: { color: '#cccccc', fontSize: 14 },
  activeChipText: { color: '#4a0006', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 28, elevation: 2 },
  submitButtonText: { color: '#4a0006', fontSize: 18, fontWeight: 'bold' },
});