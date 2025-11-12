import { MenuItem } from '../types';

// FOR...IN LOOP - Validate menu item
export const validateMenuItem = (item: any): boolean => {
  const requiredFields = ['name', 'price', 'course', 'description'];
  
  for (const field in requiredFields) {
    const fieldName = requiredFields[field];
    if (!item[fieldName] || item[fieldName].toString().trim() === '') {
      return false;
    }
  }
  
  if (isNaN(Number(item.price)) || Number(item.price) <= 0) {
    return false;
  }
  
  return true;
};