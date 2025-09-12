/**
 * CSV Export utility
 * Handles exporting financial data to CSV format
 */
import type { Expense, Income, CSVRow } from "../types";
import { getCategoryById } from "./metrics";

/**
 * Export expenses and income to CSV file
 * @param expenses - Array of expenses
 * @param income - Array of income entries
 */
export function exportToCSV(expenses: Expense[], income: Income[]): void {
  // Define CSV headers
  const headers: string[] = ["Date", "Type", "Category", "Amount", "Notes"];

  // Convert expenses to CSV rows
  const expenseRows: CSVRow[] = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    "Expense",
    getCategoryById(e.category)?.name || e.category,
    e.amount,
    e.notes || "",
  ]);

  // Convert income to CSV rows
  const incomeRows: CSVRow[] = income.map((i) => [
    new Date(i.date).toLocaleDateString(),
    "Income",
    i.source,
    i.amount,
    i.notes || "",
  ]);

  // Combine all rows
  const allRows = [...expenseRows, ...incomeRows];

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...allRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create and download file
  downloadCSV(csvContent);
}

/**
 * Trigger CSV file download
 * @param csvContent - CSV string content
 */
function downloadCSV(csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL
  URL.revokeObjectURL(url);
}

/**
 * Exports a summary report of financial metrics as a CSV file.
 *
 * The report includes the monthly budget, total income, total expenses,
 * net income, remaining budget, and the report date.
 *
 * @param totalExpenses - The total expenses for the period.
 * @param totalIncome - The total income for the period.
 * @param monthlyBudget - The monthly budget amount.
 * @param remainingBudget - The remaining budget after expenses.
 *
 * @returns void
 */
export function exportSummaryReport(
  totalExpenses: number,
  totalIncome: number,
  monthlyBudget: number,
  remainingBudget: number
): void {
  const headers = ["Metric", "Value"];
  const rows: CSVRow[] = [
    ["Monthly Budget", monthlyBudget],
    ["Total Income", totalIncome],
    ["Total Expenses", totalExpenses],
    ["Net Income", totalIncome - totalExpenses],
    ["Remaining Budget", remainingBudget],
    ["Report Date", new Date().toLocaleDateString()],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadCSV(csvContent);
}
