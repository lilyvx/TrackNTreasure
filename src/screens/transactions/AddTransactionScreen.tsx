import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TransactionForm from '../../components/TransactionForm';
import { sendTransactionEvent } from '../../services/WebSocket'; 
// 1. Import your exact database helper function
import { insertTransaction } from '../../database/db'; // Make sure this path matches where your db file lives!

const AddTransactionScreen = ({ navigation, route }: any) => {
  // Read real userId passed from TabNavigator via initialParams
  const USER_ID = route?.params?.userId ?? 1;

  // 2. Make the handler async to wait for the local SQLite write
  const handleSaveTransaction = async (formData: any) => {
    console.log('Initiating database save for transaction:', formData);

    try {
      // 3. Await the local hardware database write using your helper
      const savedTransaction = await insertTransaction(USER_ID, formData);
      console.log('Successfully saved to local SQLite:', savedTransaction);

      // 4. Broadcast the live event over WebSockets using the real saved object data
      sendTransactionEvent('TRANSACTION_ADDED', savedTransaction);

      // 5. Navigate back. The dashboard's focus hook will now read the updated DB values!
      navigation.goBack();

    } catch (error) {
      console.error('Failed to execute local transaction insert:', error);
      Alert.alert('Database Error', 'Could not save your transaction. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TransactionForm onSave={handleSaveTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
});

export default AddTransactionScreen;