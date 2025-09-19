/**
 * AppLayout Component
 * Responsive layout with navigation
 */

// import React, { useState } from "react";
import {
  LayoutDashboard,
  ChartBar,
  Settings,
  //   Menu,
  //   X,
  Plus,
  Sun,
  Moon,
  Wallet,
} from "lucide-react";

import type { TabType } from "../../types";

interface AppLayoutProps {
  children: React.ReactNode;
  theme: "light" | "dark";
  currentPage: TabType;
  onPageChange: (page: TabType) => void;
  onThemeToggle: () => void;
  onAddExpense: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  theme,
  currentPage,
  onPageChange,
  onThemeToggle,
  onAddExpense,
}) => {
  const navigation = [
    { id: "home" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "reports" as TabType, label: "Analytics", icon: ChartBar },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="w-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Expense
              <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Tracker
              </span>
            </span>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                    ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAddExpense}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>

            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="grid grid-cols-3 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`
                  flex flex-col items-center justify-center space-y-1
                  ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-600"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            ExpenseTracker
          </span>
        </div>

        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-gray-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="lg:pt-16 pt-14 pb-16 lg:pb-0">{children}</main>

      {/* Mobile FAB */}
      <button
        onClick={onAddExpense}
        className="lg:hidden fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AppLayout;
