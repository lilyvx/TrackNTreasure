import RootNavigator from './src/navigation/RootNavigator';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Alert } from 'react-native';
import { initDatabase, insertTransaction } from './src/database/db';
import { connectWebSocket, sendTransactionEvent } from './src/services/WebSocket';
import { TransactionForm } from './src/components/TransactionForm';
import { TransactionFormState } from './src/types';

const App = () => {
  //hardcode session id for testing
  const CURRENT_USER_ID = 1;

  useEffect(() => {
    const startupPipeline = async () => {
      try {
        //init sql schema
        await initDatabase();
        
        //open network stream
        connectWebSocket(CURRENT_USER_ID, (incomingData) => {
          console.log('Live data broadcast caught:', incomingData);
        });

      } catch (error) {
        console.error('Initialization error during boot sequence:', error);
      }
    };

    startupPipeline();
  }, []);

  //supervisor catching data from form
  const handleSaveTransaction = async (formData: TransactionFormState) => {
    try {
      //write to local memory
      const savedTransaction = await insertTransaction(CURRENT_USER_ID, formData);
      console.log('Transaction committed safely to SQLite database:', savedTransaction);

      //broadcast the updated package up to server engine 
      sendTransactionEvent('TRANSACTION_ADDED', savedTransaction);

      Alert.alert('Success', 'Entry saved');
    } catch (error: any) {
      console.error('Pipeline process broke down:', error);
      Alert.alert('System Error', 'Could not process the transaction event.');
    }
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#0d0d0d' }}>
    <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
    {/* The master router now controls the view flow */}
    <RootNavigator />
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  formWrapper: { flex: 1 },
});

export default App;