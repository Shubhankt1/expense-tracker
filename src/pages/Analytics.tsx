/**
 * Analytics Page
 * Data visualization with clean charts
 */

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Download, TrendingUp, DollarSign, Calendar } from 'lucide-react';

import type { AnalyticsProps } from '../types';

const Analytics: React.FC<AnalyticsProps> = ({ metrics, expenses, income, onExport }) => {
  // Prepare data for charts
  const monthlyData = [
    { name: 'Income', value: metrics.totalMonthIncome, fill: '#10B981' },
    { name: 'Expenses', value: metrics.totalMonthExpenses, fill: '#EF4444' }
  ];

  // Custom tooltip
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full px-4 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Understand your spending patterns
            </p>
          </div>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Average</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(metrics.totalMonthExpenses / 30).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily spending</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {expenses.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Transactions</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Highest</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.categoryTotals[0]?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top category</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Trend */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: 12 }}
                />
                <Tooltip content={customTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metrics.categoryTotals}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {metrics.categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {metrics.categoryTotals.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${cat.value.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Income vs Expenses */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  style={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: 12 }}
                />
                <Tooltip content={customTooltip} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;