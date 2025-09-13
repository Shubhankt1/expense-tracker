/**
 * Settings Page
 * Clean, organized settings interface
 */

import React, { useState } from "react";
import {
  Moon,
  Sun,
  Download,
  Trash2,
  RefreshCw,
  Save,
  Shield,
  Database,
  Bell,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import type { SettingsProps } from "../types";
import { getCategoryById } from "../utils/metrics";

const Settings: React.FC<SettingsProps> = ({
  theme,
  setTheme,
  monthlyBudget,
  setMonthlyBudget,
  recurringExpenses,
  setRecurringExpenses,
  onExport,
  onClearData,
  autoBackup,
  setAutoBackup,
}) => {
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [showSuccess, setShowSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  //   const [autoBackup, setAutoBackup] = useState(false);

  const handleBudgetUpdate = () => {
    const newBudget = parseFloat(budgetInput);
    if (newBudget > 0) {
      setMonthlyBudget(newBudget);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const removeRecurring = (id: number) => {
    setRecurringExpenses(recurringExpenses.filter((e) => e.id !== id));
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "⚠️ This action cannot be undone. All your data will be permanently deleted. Continue?"
      )
    ) {
      onClearData();
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full px-4 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your preferences and data
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Settings updated successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-blue-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Choose your preferred theme
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Sun className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Light
                </span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Moon className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Dark
                </span>
              </button>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Budget
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set your spending limit for each month
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleBudgetUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Budget Alerts
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified when near budget limit
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Auto Backup
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically backup data weekly
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Methods
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Track expenses by payment method
            </p>
            <button className="w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              + Add Payment Method
            </button>
          </div>

          {/* Recurring Expenses */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recurring Expenses
                </h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recurringExpenses.length} active
              </span>
            </div>

            {recurringExpenses.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No recurring expenses set
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add recurring expenses when creating a new expense
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recurringExpenses.map((expense) => {
                  const category = getCategoryById(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category?.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {category?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Monthly • ${expense.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRecurring(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Remove recurring expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Management
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Export your data or reset everything
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onExport}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                💡 Tip: Export your data regularly to keep backups safe
              </p>
            </div>
          </div>

          {/* About */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2">About ExpenseTracker</h2>
            <p className="text-sm opacity-90 mb-4">Version 1.0</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Built with</p>
                <p className="opacity-80">React, TypeScript, TailwindCSS</p>
              </div>
              <div>
                <p className="font-medium mb-1">Features</p>
                <p className="opacity-80">
                  Real-time tracking, Analytics, Dark mode
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Support</p>
                <p className="opacity-80">Made for students, by Shubhank T.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
