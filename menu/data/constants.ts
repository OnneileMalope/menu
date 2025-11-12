import { CourseType } from '../types';

// GLOBAL VARIABLES
export const COURSE_TYPES: Record<string, CourseType> = {
  STARTER: 'starter',
  MAIN: 'main',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
} as const;

export const COURSE_LABELS: Record<CourseType, string> = {
  starter: 'Starters',
  main: 'Main Courses',
  dessert: 'Desserts',
  beverage: 'Beverages',
};

// Storage key
export const STORAGE_KEY = 'menuItems';