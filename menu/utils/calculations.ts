import { MenuItem } from '../types';

// FOR LOOP - Calculate average prices by course
export const calculateAveragePrices = (menuItems: MenuItem[]): Record<string, number> => {
  const courseTotals: Record<string, { sum: number; count: number }> = {};
  const averages: Record<string, number> = {};

  // Using for loop to iterate through menu items
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    if (!courseTotals[item.course]) {
      courseTotals[item.course] = { sum: 0, count: 0 };
    }
    courseTotals[item.course].sum += item.price;
    courseTotals[item.course].count++;
  }

  // Calculate averages using for...in loop
  for (const course in courseTotals) {
    const total = courseTotals[course];
    averages[course] = total.count > 0 ? total.sum / total.count : 0;
  }

  return averages;
};

// WHILE LOOP - Find menu item by ID
export const findMenuItemById = (menuItems: MenuItem[], id: string): MenuItem | null => {
  let i = 0;
  while (i < menuItems.length) {
    if (menuItems[i].id === id) {
      return menuItems[i];
    }
    i++;
  }
  return null;
};

// FUNCTION DEFINITION - Filter by course
export const filterByCourse = (menuItems: MenuItem[], course: string): MenuItem[] => {
  return menuItems.filter(item => item.course === course);
};

// FOR...IN LOOP - Get available courses
export const getAvailableCourses = (menuItems: MenuItem[]): string[] => {
  const courses: Record<string, boolean> = {};
  
  // Using for loop to collect unique courses
  for (let i = 0; i < menuItems.length; i++) {
    courses[menuItems[i].course] = true;
  }
  
  const availableCourses: string[] = [];
  // Using for...in loop to extract course names
  for (const course in courses) {
    availableCourses.push(course);
  }
  
  return availableCourses;
};