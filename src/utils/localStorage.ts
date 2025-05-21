/**
 * Utility functions for working with localStorage
 */
import { hasUserConsent } from './consentManager';

/**
 * Save data to localStorage
 * @param key The key to store the data under
 * @param value The data to store
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (hasUserConsent() || key === 'cookieconsent_status') {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage
 * @param key The key to retrieve data from
 * @param defaultValue The default value to return if the key doesn't exist
 * @returns The stored data or the default value
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (hasUserConsent() || key === 'cookieconsent_status') {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param key The key to remove
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    if (hasUserConsent() || key === 'cookieconsent_status') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    if (hasUserConsent()) {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
