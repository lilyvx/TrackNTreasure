//optional userid, because registered in exist in db after creted
export interface User {
  user_id?: number;
  username: string;
  email: string;
  password: string;
}

//authuser is stored in global context. no password stored after authentication
export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
}

 //only 2 valid transaction types
export type TransactionType = 'Income' | 'Expense';

export type IncomeCategory = 'Salary' | 'Bonus' | 'Investment'| "Gifted";

export type ExpenseCategory =| 'Food'| 'Transportation'| 'Shopping'| 'Entertainment'| 'Bills'| 'Education'| 'Gift to others'| 'Groceries' ;

export type TransactionCategory = IncomeCategory | ExpenseCategory;

//structure of transaction record. transdate is string type format:'YYYY-MM-DD'
export interface Transaction {
  transaction_id?: number;
  user_id: number;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  transaction_date: string;
}

//exp used, remaining, percentage are not stored in database. calc by querying transaction. attach when displaying the budget on screen
export interface Budget {
  budget_id?: number;
  user_id: number;
  monthly_budget_limit: number;
  expenses_used?: number;
  remaining?: number;
  percentage_used?: number;
}


//object build from querying all transactions
//never stored in SQLite freshly calculated from transaction data
export interface WalletSummary {
  current_balance: number;
  total_income: number;
  total_expenses: number;
  remaining_budget: number;
}


//holds the data returned from alphavantage,lastupdate is humanreadable string from the api response
export interface CurrencyResult {
  from_currency: string;
  to_currency: string;
  exchange_rate: number;
  converted_amount: number;
  last_updated: string;
}

//names server broadcasts.match the strings in server code exactly. If the server sends 'transaction-added', client listen for'transaction-added' 
export type WebSocketEventType = | 'SYSTEM'| 'transaction-added'| 'transaction-updated'| 'transaction-deleted'| 'budget-updated';

//shape of every message the server sends and when app receives.  //payload carry data
export interface WebSocketMessage {
  type: WebSocketEventType;
  payload?: unknown;
  message?: string;
}


//TYPES define which screens exist in each navigator and what parameters the screens expects to receive
//screens before login
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

//screens after login
export type MainTabParamList = {
  Home: undefined;
  RecentActivity: undefined;
  QuickCreate: undefined;
  Profile: undefined;
};

//accessible from hamburger menu
export type DrawerParamList = {
  MainTabs: undefined;
  CurrencyExchange: undefined;
  Settings: undefined;
};

//stack within the main app for detail screens
export type AppStackParamList = {
  TransactionDetail: { transaction_id: number };
  EditTransaction: { transaction: Transaction };
  BudgetDetail: { budget_id: number };
  EditBudget: { budget: Budget };
};

 //represent the local state of form screens
 // separate from database types because form fields are always strings (typed into textinput)
export interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TransactionFormState {
  amount: string;         //textinput gives strings
  description: string;
  category: TransactionCategory | '';
  type: TransactionType | '';
  transaction_date: string;
}

export interface BudgetFormState {
  monthly_budget_limit: string; 
}

//constant for async storage keys
export const STORAGE_KEYS = {
  REMEMBER_ME: '@trackntresaure:rememberMe',
  SAVED_USERNAME: '@trackntresaure:savedUsername',
  SESSION_USER: '@trackntresaure:sessionUser',
  THEME: '@trackntresaure:theme',
  CURRENCY: '@trackntresaure:currency',
} as const;

export type ThemeMode = 'light' | 'dark';
export type SupportedCurrency = 'MYR' | 'USD' | 'SGD' | 'EUR' | 'GBP';