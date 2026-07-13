import React, { useState, useRef } from 'react';
import {StyleSheet,View,Text,TextInput,TouchableOpacity, ScrollView,Alert,StatusBar,Platform} from 'react-native';
import { TransactionFormState, TransactionType, TransactionCategory } from '../types';

//constant match type definition
const INCOME_CATEGORIES: TransactionCategory[] = ['Salary', 'Bonus', 'Investment', 'Gifted'];
const EXPENSE_CATEGORIES: TransactionCategory[] = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Gift to others', 'Groceries', 'Others'];

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

  const inputRef = useRef<TextInput>(null);

  const handleInputChange = (field: keyof TransactionFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    //reset category if switching between income n expense 
    if (field === 'type') {
      setForm((prev) => ({ ...prev, type: value as TransactionType, category: '' }));
    }
  };

  const handleSubmit = () => {
    const { amount, description, category } = form;

    //submission checking
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('ERROR: ' ,'You have to enter an amount to record a transaction.');
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
    
    //clear inputs smoothly
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
      <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" translucent={false} />

      {/* transaction toggle button */}
      <Text style={styles.label}>Transaction Type</Text>
      <View style={styles.toggleRow}>
        {['Expense', 'Income'].map((t) => (
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

      {/* input amount */}
      <Text style={styles.label}>Amount</Text>
      <TouchableOpacity style={styles.amountCard} activeOpacity={0.8} onPress={() => inputRef.current?.focus()}>
        <Text style={styles.amountCurrency}>RM </Text>
        <Text style={styles.amountValue}>{form.amount || '0.00'}</Text>
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        keyboardType="numeric"
        value={form.amount}
        onChangeText={(val) => handleInputChange('amount', val)}
      />

      {/* category selection */}
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

      {/* description input */}
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

      {/* submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#0d0d0d', flexGrow: 1 },
  label: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium', fontSize: 12, color: '#888888', fontWeight: '600', marginBottom: 8, marginTop: 14, letterSpacing: 1, textTransform: 'uppercase' },
  input: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-normal', backgroundColor: '#1a1a1a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#ffffff', fontSize: 16, borderWidth: 1, borderColor: '#262626' },
  amountCard: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 16, paddingVertical: 32, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#262626', marginBottom: 12 },
  amountCurrency: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed', fontSize: 32, fontWeight: 'bold', color: '#666666' },
  amountValue: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBold' : 'sans-serif-condensed', fontSize: 44, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  hiddenInput: { position: 'absolute', width: 0, height: 0, opacity: 0 },
  textArea: { height: 80, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggleButton: { flex: 1, paddingVertical: 14, backgroundColor: '#1a1a1a', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#262626' },
  toggleText: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'sans-serif-condensed', color: '#666666', fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
  activeToggleText: { color: '#ffffff', fontWeight: 'bold' },
  activeExpense: { backgroundColor: '#261416', borderColor: '#ff4444' },
  activeIncome: { backgroundColor: '#132417', borderColor: '#8ce629' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#1a1a1a', borderRadius: 20, borderWidth: 1, borderColor: '#262626' },
  activeChip: { backgroundColor: '#8ce629', borderColor: '#8ce629' },
  chipText: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-condensed', color: '#888888', fontSize: 14 },
  activeChipText: { color: '#0d0d0d', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#8ce629', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  submitButtonText: { fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed', color: '#0d0d0d', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
});

export default TransactionForm;