/**
 * Metrics calculation utilities
 * Clean architecture with proper types
 */

import type {
  Expense,
  Income,
  Metrics,
  Category,
  CategoryTotal,
  TrendDataPoint,
} from "../types";

// Modern color palette
export const CATEGORIES: Category[] = [
  { id: "food", name: "Food", emoji: "🍕", color: "#EF4444" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#8B5CF6" },
  { id: "travel", name: "Travel", emoji: "🚗", color: "#3B82F6" },
  { id: "books", name: "Education", emoji: "📚", color: "#10B981" },
  { id: "fun", name: "Entertainment", emoji: "🎮", color: "#F59E0B" },
  { id: "misc", name: "Other", emoji: "📦", color: "#6B7280" },
];

export function calculateMetrics(
  expenses: Expense[],
  income: Income[],
  monthlyBudget: number
): Metrics {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentWeek = Math.floor((now.getDate() - 1) / 7);

  // Filter current month expenses
  const monthExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  // Filter current week expenses
  const weekExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const week = Math.floor((date.getDate() - 1) / 7);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear &&
      week === currentWeek
    );
  });

  // Filter current month income
  const monthIncome = income.filter((i) => {
    const date = new Date(i.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  // Calculate totals
  const totalMonthExpenses = monthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalWeekExpenses = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMonthIncome = monthIncome.reduce((sum, i) => sum + i.amount, 0);
  const remainingBudget = monthlyBudget - totalMonthExpenses;
  const budgetPercentage = (totalMonthExpenses / monthlyBudget) * 100;

  // Category breakdown
  const categoryTotals = calculateCategoryTotals(monthExpenses);

  // Spending trend
  const trendData = calculateTrendData(expenses);

  return {
    totalMonthExpenses,
    totalWeekExpenses,
    totalMonthIncome,
    remainingBudget,
    budgetPercentage,
    categoryTotals,
    trendData,
    isOverBudget: budgetPercentage > 90,
    monthlyBudget,
  };
}

function calculateCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  return CATEGORIES.map((cat) => ({
    name: cat.name,
    value: expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
    color: cat.color,
  }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
}

function calculateTrendData(expenses: Expense[]): TrendDataPoint[] {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  return last7Days.map((date) => {
    const dayExpenses = expenses.filter((e) => {
      const expDate = new Date(e.date);
      return expDate.toDateString() === date.toDateString();
    });

    return {
      date: date.toLocaleDateString("en", { weekday: "short" }),
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  });
}

export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === categoryId);
}
