import React from 'react';
import { View, StyleSheet } from 'react-native';
import TransactionForm from '../../components/TransactionForm';

const AddTransactionScreen = ({ navigation }: any) => {
  
  const handleSaveTransaction = (formData: any) => {
    console.log('Saving transaction data to DB:', formData);

    //go back to dashboard
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/*pass the required onSave function down to component */}
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