/**
 * Type definitions for ExpenseTracker
 */

// Core Data Types
export interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string; // ISO string
  notes?: string;
  isRecurring?: boolean;
}

export interface Income {
  id: number;
  amount: number;
  source: string;
  date: string; // ISO string
  notes?: string;
}

export interface RecurringExpense extends Expense {
  lastProcessed: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

// Metrics Types
export interface Metrics {
  totalMonthExpenses: number;
  totalWeekExpenses: number;
  totalMonthIncome: number;
  totalLastMonthIncome: number;
  percentChangeIncome: number;
  remainingBudget: number;
  budgetPercentage: number;
  categoryTotals: CategoryTotal[];
  trendData: TrendDataPoint[];
  isOverBudget: boolean;
  monthlyBudget: number;
}

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export interface TrendDataPoint {
  date: string;
  amount: number;
}

export interface BarChartDataPoint {
  name: string;
  amount: number;
  fill: string;
}

// Component Props Types
export interface DashboardProps {
  metrics: Metrics;
  expenses: Expense[];
  onAddExpense: () => void;
  onAddIncome: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export interface AnalyticsProps {
  metrics: Metrics;
  expenses: Expense[];
  income: Income[];
  onExport: () => void;
}

export interface SettingsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  recurringExpenses: RecurringExpense[];
  setRecurringExpenses: (expenses: RecurringExpense[]) => void;
  onExport: () => void;
  onClearData: () => void;
  autoBackup: boolean;
  setAutoBackup: (value: boolean) => void;
}

// Navigation Types
export type TabType = "home" | "reports" | "settings";

// Hook Types
export type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((val: T) => T)) => void
];

// Utility Types
export type CSVRow = (string | number)[];
