import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import DishFormScreen from './screens/DishFormScreen';
import ChefManagementScreen from './screens/ChefManagementSreen';
import FilterScreen from './screens/FilterScreen'; // NEW SCREEN

const Stack = createStackNavigator();
const STORAGE_KEY = '@christoffel_menu';

// Validation function
const validateMenuItem = (item) => {
  if (!item.name?.trim() || !item.description?.trim() || !item.course || !item.price) {
    throw new Error('All fields are required');
  }
  if (item.price < 0) {
    throw new Error('Price must be positive');
  }
  if (typeof item.price !== 'number') {
    throw new Error('Price must be a number');
  }
};

// Storage service
const MenuService = {
  save: async (items) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save menu', e);
      throw e;
    }
  },
  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to load menu', e);
      throw e;
    }
  }
};

// NEW: Utility functions with TypeScript-style loops
const MenuCalculations = {
  // FOR LOOP: Calculate average prices by course
  calculateAveragePrices: (menuItems) => {
    const courseTotals = {};
    const averages = {};
    
    // Using for loop to iterate through menu items
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      if (!courseTotals[item.course]) {
        courseTotals[item.course] = { sum: 0, count: 0 };
      }
      courseTotals[item.course].sum += item.price;
      courseTotals[item.course].count++;
    }
    
    // Using for...in loop to calculate averages
    for (const course in courseTotals) {
      averages[course] = courseTotals[course].sum / courseTotals[course].count;
    }
    
    return averages;
  },

  // WHILE LOOP: Filter menu items by course
  filterByCourse: (menuItems, course) => {
    const filtered = [];
    let i = 0;
    
    // Using while loop to filter items
    while (i < menuItems.length) {
      if (menuItems[i].course === course) {
        filtered.push(menuItems[i]);
      }
      i++;
    }
    
    return filtered;
  },

  // FOR...IN LOOP: Get available courses
  getAvailableCourses: (menuItems) => {
    const courses = {};
    
    // Using for loop to collect unique courses
    for (let i = 0; i < menuItems.length; i++) {
      courses[menuItems[i].course] = true;
    }
    
    const availableCourses = [];
    // Using for...in loop to extract course names
    for (const course in courses) {
      availableCourses.push(course);
    }
    
    return availableCourses;
  }
};

// Initial seed data
const getInitialData = () => [
  { 
    id: '1', 
    name: 'Beetroot Carpaccio', 
    description: 'Thin sliced beetroot with feta and walnuts', 
    course: 'Starter', 
    price: 85.00 
  },
  { 
    id: '2', 
    name: 'Pan-seared Lamb', 
    description: 'Served with rosemary jus and roasted veg', 
    course: 'Main', 
    price: 220.00 
  },
  { 
    id: '3', 
    name: 'Vanilla Panna Cotta', 
    description: 'Creamy panna cotta with berry compote', 
    course: 'Dessert', 
    price: 75.00 
  }
];

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const stored = await MenuService.load();
      if (stored) {
        setMenuItems(stored);
      } else {
        const seed = getInitialData();
        setMenuItems(seed);
        await MenuService.save(seed);
      }
    } catch (e) {
      console.warn('Failed to load menu', e);
      // Fallback to seed data
      const seed = getInitialData();
      setMenuItems(seed);
    } finally {
      setLoading(false);
    }
  };

  const persist = useCallback(async (items) => {
    setMenuItems(items);
    try {
      await MenuService.save(items);
    } catch(e) {
      console.error('Failed to save menu', e);
    }
  }, []);

  const addMenuItem = useCallback((item) => {
    try {
      validateMenuItem(item);
      const newItem = { 
        ...item, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      persist([newItem, ...menuItems]);
      return true;
    } catch (error) {
      console.error('Validation failed:', error.message);
      return false;
    }
  }, [menuItems, persist]);

  const updateMenuItem = useCallback((updated) => {
    try {
      validateMenuItem(updated);
      const next = menuItems.map(m => m.id === updated.id ? updated : m);
      persist(next);
      return true;
    } catch (error) {
      console.error('Validation failed:', error.message);
      return false;
    }
  }, [menuItems, persist]);

  const deleteMenuItem = useCallback((id) => {
    const next = menuItems.filter(m => m.id !== id);
    persist(next);
  }, [menuItems, persist]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Home" options={{ title: 'Guest Menu' }}>
          {(props) => (
            <HomeScreen 
              {...props} 
              menuItems={menuItems} 
              loading={loading}
              menuCalculations={MenuCalculations} // NEW: Pass calculations
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ChefManagement" options={{ title: 'Chef Management' }}>
          {(props) => (
            <ChefManagementScreen 
              {...props} 
              menuItems={menuItems} 
              onDelete={deleteMenuItem} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="DishForm" options={{ title: 'Add / Edit Dish' }}>
          {(props) => (
            <DishFormScreen 
              {...props} 
              addMenuItem={addMenuItem} 
              updateMenuItem={updateMenuItem} 
            />
          )}
        </Stack.Screen>
        {/* NEW: Filter Screen */}
        <Stack.Screen name="Filter" options={{ title: 'Filter by Course' }}>
          {(props) => (
            <FilterScreen 
              {...props} 
              menuItems={menuItems} 
              menuCalculations={MenuCalculations} 
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
