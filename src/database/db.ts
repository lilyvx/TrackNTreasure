//local db
import SQLite from 'react-native-sqlite-storage';
import { Transaction, TransactionFormState, User, WalletSummary} from '../types';

// promise api so can use async/await with your database operations
SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;


export const getDBConnection = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }
  
  dbInstance = await SQLite.openDatabase({ //pause before promise runs 
    name: 'TrackNTreasure.db',
    location: 'default',
  });
  console.log('Database connected successfully!');
  return dbInstance;
};



//start db
export const initDatabase = async (): Promise<void> => {
  try {
    const db = await getDBConnection();

   
    await db.executeSql('PRAGMA journal_mode = WAL;');

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        user_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        username  TEXT NOT NULL UNIQUE,
        email     TEXT NOT NULL,
        password  TEXT NOT NULL
      );
    `);

    //transactions 
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id          INTEGER NOT NULL,
        amount           REAL NOT NULL,
        category         TEXT NOT NULL,
        type             TEXT NOT NULL,
        description      TEXT NOT NULL,
        transaction_date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    //budget
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS budgets (
        budget_id            INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id              INTEGER NOT NULL UNIQUE,
        monthly_budget_limit REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    console.log("🗄️ Database tables initialized cleanly.");
  } catch (error) {
    console.error("⚠️ Error initializing database:", error);
    throw error;
  }
};

//user
export const createUser = async (user: Omit<User, 'user_id'>): Promise<number> => {
  try {
    const db = await getDBConnection();
    const [result] = await db.executeSql(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [user.username, user.email, user.password]
    );
    return result.insertId;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username already exists. Please choose another.');
    }
    throw new Error('Failed to create account. Please try again.');
  }
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const db = await getDBConnection();
  const [results] = await db.executeSql(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  
  if (results.rows.length > 0) {
    return results.rows.item(0) as User;
  }
  return null;
};

export const getUserById = async (user_id: number): Promise<User | null> => {
  const db = await getDBConnection();
  const [results] = await db.executeSql(
    `SELECT * FROM users WHERE user_id = ?`,
    [user_id]
  );
  
  if (results.rows.length > 0) {
    return results.rows.item(0) as User;
  }
  return null;
};




//making transactions
export const createTransaction = async (transaction: Omit<Transaction, 'transaction_id'>): Promise<number> => {
  const db = await getDBConnection();
  const [result] = await db.executeSql(
    `INSERT INTO transactions 
      (user_id, amount, category, type, description, transaction_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      transaction.user_id,
      transaction.amount,
      transaction.category,
      transaction.type,
      transaction.description,
      transaction.transaction_date,
    ]
  );
  return result.insertId; //auto increment trans id to trasactionaction
};

export const getTransactionsByUser = async (user_id: number): Promise<Transaction[]> => {
  const db = await getDBConnection();
  const [results] = await db.executeSql(
    `SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC`,
    [user_id]
  );
  
  const transactions: Transaction[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    transactions.push(results.rows.item(i));
  }
  return transactions;
};

export const deleteTransaction = async (transaction_id: number, user_id: number): Promise<void> => {
  const db = await getDBConnection();
  await db.executeSql(
    `DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?`,
    [transaction_id, user_id]
  );
};


//takes raw form data from app, formats, inserts to sqlite, returns full saved object w new auto gened id
export const insertTransaction = async (
  userId: number, 
  form: TransactionFormState
): Promise<Transaction> => {
  const db = await getDBConnection(); 

  //convert the string amount from input
  const numericAmount = parseFloat(form.amount);
  
  const sqlInsert = `
    INSERT INTO transactions (user_id, amount, category, type, description, transaction_date)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  const params = [
    userId,
    numericAmount,
    form.category,
    form.type,
    form.description.trim(),
    form.transaction_date
  ];

  //execute query on phone hardware storage
  const [results] = await db.executeSql(sqlInsert, params);

  // sturctured object like transaction interface definition
  return {
    transaction_id: results.insertId, //auto incremented primary key from sqlite
    user_id: userId,
    amount: numericAmount,
    category: form.category as any,
    type: form.type as any,
    description: form.description.trim(),
    transaction_date: form.transaction_date,
  };
};


export const getWalletSummary = async (user_id: number): Promise<WalletSummary> => {
  const db = await getDBConnection();
  
  const [summaryResults] = await db.executeSql(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'Income'  THEN amount ELSE 0 END), 0) AS total_income,
       COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS total_expenses
     FROM transactions WHERE user_id = ?`,
    [user_id]
  );

  const total_income = summaryResults.rows.item(0).total_income ?? 0;
  const total_expenses = summaryResults.rows.item(0).total_expenses ?? 0;

  const [budgetResults] = await db.executeSql(
    `SELECT monthly_budget_limit FROM budgets WHERE user_id = ?`,
    [user_id]
  );

  const budget_limit = budgetResults.rows.length > 0 ? budgetResults.rows.item(0).monthly_budget_limit : 0;
  const remaining_budget = budget_limit - total_expenses;

  return {
    current_balance: total_income - total_expenses,
    total_income,
    total_expenses,
    remaining_budget,
  };
};

export const upsertBudget = async (user_id: number, monthly_budget_limit: number): Promise<void> => {
  const db = await getDBConnection();
  await db.executeSql(
    `INSERT OR REPLACE INTO budgets (user_id, monthly_budget_limit) VALUES (?, ?)`,
    [user_id, monthly_budget_limit]
  );
};


