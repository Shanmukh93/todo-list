export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Personal' | 'Work' | 'Shopping' | 'Health' | 'General';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';
