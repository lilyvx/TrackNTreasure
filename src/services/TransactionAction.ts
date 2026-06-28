

import { createTransaction } from '../database/db'; 
import { sendTransactionEvent } from './WebSocket'; 
import { Transaction } from '../types/Index';     

export const handleAddNewTransaction = async (
  newTransaction: Omit<Transaction, 'transaction_id'>
): Promise<number | null> => {
  try {
    //save to local
    const insertedId = await createTransaction(newTransaction);
    console.log(`Transaction saved locally to SQLite with ID: ${insertedId}`);

    //prep payload
    const fullTransactionRecord: Transaction = {
      ...newTransaction,
      transaction_id: insertedId,
    };

    //send to server
    sendTransactionEvent('TRANSACTION_ADDED', fullTransactionRecord);

    return insertedId;
  } catch (error) {
    console.error('[ERROR} Failed to execute synchronized transaction save:', error);
    return null;
  }
};