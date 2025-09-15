/**
 * Dashboard Page
 * Clean, modern dashboard with excellent UX
 */

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
} from "lucide-react";

import type { DashboardProps } from "../types";
import { getCategoryById } from "../utils/metrics";

const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  expenses,
  onAddExpense,
  onAddIncome,
  onEditExpense,
  onDeleteExpense,
}) => {
  const recentTransactions = expenses.slice(-8).reverse();

  return (
    <div className="w-full min-h-screen">
      <div className="w-full px-4 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your financial overview for{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Budget Alert */}
        {metrics.isOverBudget && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-400">
                Budget Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-500 mt-0.5">
                You've used {metrics.budgetPercentage.toFixed(0)}% of your
                monthly budget. Consider reducing spending.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Income Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-500">
                {isFinite(metrics.percentChangeIncome) &&
                  !isNaN(metrics.percentChangeIncome) &&
                  `${metrics.percentChangeIncome}% from last month`}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Income
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${metrics.totalMonthIncome.toFixed(2)}
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <span className="text-xs font-medium text-red-600 dark:text-red-500">
                This month
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Expenses
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${metrics.totalMonthExpenses.toFixed(2)}
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <span
                className={`text-xs font-medium ${
                  metrics.totalMonthIncome - metrics.totalMonthExpenses >= 0
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {metrics.totalMonthIncome - metrics.totalMonthExpenses >= 0
                  ? "Positive"
                  : "Negative"}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Net Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              $
              {Math.abs(
                metrics.totalMonthIncome - metrics.totalMonthExpenses
              ).toFixed(2)}
            </p>
          </div>

          {/* Week Spending Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              </div>
              <span className="text-xs font-medium text-purple-600 dark:text-purple-500">
                This week
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Weekly Spending
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${metrics.totalWeekExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Progress */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Budget Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ${metrics.totalMonthExpenses.toFixed(0)} of $
                    {metrics.monthlyBudget}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.budgetPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.budgetPercentage > 90
                        ? "bg-red-500"
                        : metrics.budgetPercentage > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(metrics.budgetPercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  By Category
                </h3>
                <div className="space-y-2">
                  {metrics.categoryTotals.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${cat.value.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No transactions yet
                  </p>
                  <button
                    onClick={onAddExpense}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add your first expense
                  </button>
                </div>
              ) : (
                recentTransactions.map((expense) => {
                  const category = getCategoryById(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category?.emoji}</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {category?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(expense.date).toLocaleDateString()}
                            {expense.notes && ` • ${expense.notes}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={() => onEditExpense(expense)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onAddExpense}
            className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Add Expense
          </button>
          <button
            onClick={onAddIncome}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Add Income
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
