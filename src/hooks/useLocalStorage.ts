/**
 * Custom hook for managing localStorage with React state
 * Provides persistent storage for app data
 */

import { useState, useEffect } from "react";
import type { UseLocalStorageReturn } from "../types";

/**
 * Custom hook to sync state with localStorage
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue] similar to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function (similar to useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error syncing ${key} from storage event:`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
