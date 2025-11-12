export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  course: string;
  ingredients: string[];
}

export type CourseType = 'starter' | 'main' | 'dessert' | 'beverage';

export type ScreenType = 'home' | 'admin' | 'filter';