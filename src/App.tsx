/**
 * Main Application Component
 * Modern architecture with clean separation of concerns
 */

import { exportToCSV } from "./utils/csvExport";
import { calculateMetrics } from "./utils/metrics";
import { useLocalStorage } from "./hooks/useLocalStorage";
import React, { useState, useEffect, useMemo } from "react";
import type { Expense, Income, RecurringExpense, TabType } from "./types";

// Layout Components
import AppLayout from "./components/layout/AppLayout";

// Page Components
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";

// Modal Components
import IncomeModal from "./components/modals/IncomeModal";
import ExpenseModal from "./components/modals/ExpenseModal";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  // Persistent State
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [income, setIncome] = useLocalStorage<Income[]>("income", []);
  const [monthlyBudget, setMonthlyBudget] = useLocalStorage<number>(
    "monthlyBudget",
    800
  );
  const [recurringExpenses, setRecurringExpenses] = useLocalStorage<
    RecurringExpense[]
  >("recurringExpenses", []);
  const [autoBackup, setAutoBackup] = useLocalStorage<boolean>(
    "autoBackup",
    false
  );

  // UI State
  const [currentPage, setCurrentPage] = useState<TabType>("home");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Process recurring expenses monthly
  useEffect(() => {
    const processRecurring = () => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      recurringExpenses.forEach((recurring) => {
        console.log(recurring.lastProcessed);

        const lastProcessed = new Date(recurring.lastProcessed || 0);
        if (
          lastProcessed.getMonth() !== currentMonth ||
          lastProcessed.getFullYear() !== currentYear
        ) {
          const newExpense: Expense = {
            id: Date.now() + Math.random(),
            amount: recurring.amount,
            category: recurring.category,
            date: new Date().toISOString(),
            notes: `[Recurring] ${recurring.notes || ""}`,
            isRecurring: true,
          };

          setExpenses((prev) => [...prev, newExpense]);
          setRecurringExpenses((prev) =>
            prev.map((r) =>
              r.id === recurring.id
                ? { ...r, lastProcessed: today.toISOString() }
                : r
            )
          );
        }
      });
    };

    processRecurring();
  }, []);

  useEffect(() => {
    if (!autoBackup) return;

    const performBackup = () => {
      const now = new Date();
      console.log(`Auto-backup at ${now.toLocaleString()}`);

      // Export to csv
      exportToCSV(expenses, income);

      // Store last backup time
      localStorage.setItem("lastBackupTime", now.toISOString());
    };

    // Check if backup needed.
    const checkAndBackup = () => {
      console.log("Checking for backup...");
      const lastBackup = localStorage.getItem("lastBackupTime");
      const lastBackupDate = lastBackup ? new Date(lastBackup) : null;
      const now = new Date();

      // If no previous backup or more than 3 days ago
      if (
        !lastBackupDate ||
        now.getTime() - lastBackupDate.getTime() > 3 * 24 * 60 * 60 * 1000
      ) {
        console.log("Backing up...");
        performBackup();
      }
    };

    checkAndBackup();

    const interval = setInterval(checkAndBackup, 1000 * 3600);

    return () => {
      //   console.log("🧹 CLEANUP: Clearing interval with ID:", interval);
      clearInterval(interval);
      //   console.log("✨ Interval cleared successfully");
    };
  }, [autoBackup, expenses, income]);

  // Calculate metrics
  const metrics = useMemo(
    () => calculateMetrics(expenses, income, monthlyBudget),
    [expenses, income, monthlyBudget]
  );

  // Handlers
  const handleExpenseSubmit = (expense: Expense, isRecurring: boolean) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === expense.id ? expense : e))
      );
    } else {
      setExpenses((prev) => [...prev, expense]);
      if (isRecurring) {
        setRecurringExpenses((prev) => [
          ...prev,
          {
            ...expense,
            lastProcessed: expense.date,
          },
        ]);
      }
    }
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleIncomeSubmit = (incomeData: Income) => {
    if (editingIncome) {
      setIncome((prev) =>
        prev.map((i) => (i.id === incomeData.id ? incomeData : i))
      );
    } else {
      setIncome((prev) => [...prev, incomeData]);
    }
    setIncomeModalOpen(false);
    setEditingIncome(null);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExportData = () => {
    exportToCSV(expenses, income);
  };

  const handleClearData = () => {
    if (
      window.confirm("This will permanently delete all your data. Continue?")
    ) {
      setExpenses([]);
      setIncome([]);
      setRecurringExpenses([]);
      setMonthlyBudget(800);
    }
  };

  //   console.log("metrics:", metrics);

  return (
    <AppLayout
      theme={theme}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      onAddExpense={() => setExpenseModalOpen(true)}
    >
      {/* Page Content */}
      {currentPage === "home" && (
        <Dashboard
          metrics={metrics}
          expenses={expenses}
          onAddExpense={() => setExpenseModalOpen(true)}
          onAddIncome={() => setIncomeModalOpen(true)}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {currentPage === "reports" && (
        <Analytics
          metrics={metrics}
          expenses={expenses}
          income={income}
          onExport={handleExportData}
        />
      )}

      {currentPage === "settings" && (
        <Settings
          theme={theme}
          setTheme={setTheme}
          monthlyBudget={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
          recurringExpenses={recurringExpenses}
          setRecurringExpenses={setRecurringExpenses}
          onExport={handleExportData}
          onClearData={handleClearData}
          autoBackup={autoBackup}
          setAutoBackup={setAutoBackup}
        />
      )}

      {/* Modals */}
      {expenseModalOpen && (
        <ExpenseModal
          expense={editingExpense}
          onSubmit={handleExpenseSubmit}
          onClose={() => {
            setExpenseModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}

      {incomeModalOpen && (
        <IncomeModal
          income={editingIncome}
          onSubmit={handleIncomeSubmit}
          onClose={() => {
            setIncomeModalOpen(false);
            setEditingIncome(null);
          }}
        />
      )}
    </AppLayout>
  );
};

export default App;
