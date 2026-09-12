import { TodoItem } from '../types';

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: '1',
    text: 'Review project sprint deliverables',
    completed: false,
    priority: 'high',
    category: 'Work',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: '2',
    text: 'Pick up fresh groceries & almond milk',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: '3',
    text: 'Schedule 30-min evening workout',
    completed: true,
    priority: 'low',
    category: 'Health',
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: '4',
    text: 'Read two chapters of Clean Code',
    completed: false,
    priority: 'low',
    category: 'Personal',
    createdAt: Date.now() - 3600000 * 1,
  },
];

export const CATEGORIES: { name: TodoItem['category']; color: string; bg: string }[] = [
  { name: 'Work', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  { name: 'Personal', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { name: 'Shopping', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { name: 'Health', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  { name: 'General', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
];
