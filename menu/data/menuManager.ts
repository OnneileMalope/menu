import { MenuItem } from '../types';
import { STORAGE_KEY } from './constants';

// Global array to store menu items
export let menuItems: MenuItem[] = [];

// FUNCTION TO ORGANIZE CODE - Initialize menu
export const initializeMenu = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      menuItems = JSON.parse(stored);
    }
  } catch (error) {
    console.log('No stored menu items found, starting with empty menu');
  }
};

// FUNCTION TO ORGANIZE CODE - Add menu item
export const addMenuItem = (item: Omit<MenuItem, 'id'>): void => {
  const newItem: MenuItem = {
    ...item,
    id: generateId(),
  };
  menuItems.push(newItem);
  saveToLocalStorage();
};

// FUNCTION TO ORGANIZE CODE - Remove menu item
export const removeMenuItem = (id: string): void => {
  const index = menuItems.findIndex(item => item.id === id);
  if (index !== -1) {
    menuItems.splice(index, 1);
    saveToLocalStorage();
  }
};

// FUNCTION TO ORGANIZE CODE - Get all menu items
export const getAllMenuItems = (): MenuItem[] => {
  return [...menuItems];
};

// FUNCTION TO ORGANIZE CODE - Update menu item
export const updateMenuItem = (id: string, updates: Partial<MenuItem>): void => {
  const index = menuItems.findIndex(item => item.id === id);
  if (index !== -1) {
    menuItems[index] = { ...menuItems[index], ...updates };
    saveToLocalStorage();
  }
};

// Helper functions
const generateId = (): string => {
  return 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const saveToLocalStorage = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
  } catch (error) {
    console.log('Error saving to localStorage:', error);
  }
};