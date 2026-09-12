import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { TodoItem, FilterStatus, Category, Priority } from './types';
import { INITIAL_TODOS, CATEGORIES } from './data/defaultTodos';
import { MobileFrame } from './components/MobileFrame';
import { TodoItemRow } from './components/TodoItemRow';
import { ReactNativeCodeModal } from './components/ReactNativeCodeModal';

const STORAGE_KEY = 'rn_todo_list_data_v1';

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from storage', e);
    }
    return INITIAL_TODOS;
  });

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFramed, setIsFramed] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // New task form state
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>('Personal');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [showFormOptions, setShowFormOptions] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save tasks to storage', e);
    }
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setNewTaskText('');
    setShowFormOptions(false);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Filtered todos calculation
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Status filter
      if (filterStatus === 'active' && todo.completed) return false;
      if (filterStatus === 'completed' && !todo.completed) return false;

      // Category filter
      if (selectedCategory !== 'All' && todo.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return todo.text.toLowerCase().includes(query);
      }

      return true;
    });
  }, [todos, filterStatus, selectedCategory, searchQuery]);

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <MobileFrame
      isFramed={isFramed}
      onToggleFrame={() => setIsFramed(!isFramed)}
      onOpenCode={() => setIsCodeModalOpen(true)}
    >
      {/* Mobile App Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar size={13} className="text-blue-600" />
            <span>{todayFormatted}</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            React Native
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>
          <span className="text-xs font-semibold text-slate-500">
            {completedCount}/{totalCount} done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 space-y-2 shrink-0">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="search-tasks-input"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Category Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {['All', 'Work', 'Personal', 'Shopping', 'Health', 'General'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs (All / Active / Completed) */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            {(['all', 'active', 'completed'] as const).map((s) => (
              <button
                key={s}
                id={`status-tab-${s}`}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer ${
                  filterStatus === s
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              id="clear-completed-btn"
              type="button"
              onClick={handleClearCompleted}
              className="text-[11px] font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Todo List Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-[320px]">
        {filteredTodos.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              {searchQuery ? 'No matching tasks' : 'No tasks here'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              {searchQuery
                ? 'Try searching for something else or clearing the search.'
                : 'Add a new task below to stay organized!'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItemRow
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        )}
      </div>

      {/* Mobile Bottom Input Dock */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0 shadow-lg">
        {showFormOptions && (
          <div className="mb-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Category Selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Category:</span>
              <div className="flex gap-1 overflow-x-auto max-w-[230px] no-scrollbar">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    id={`select-new-cat-${c.name.toLowerCase()}`}
                    type="button"
                    onClick={() => setNewTaskCategory(c.name)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                      newTaskCategory === c.name
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Priority:</span>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    id={`select-new-prio-${p}`}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                      newTaskPriority === p
                        ? p === 'high'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAddTodo} className="flex items-center gap-2">
          <button
            id="toggle-options-btn"
            type="button"
            onClick={() => setShowFormOptions(!showFormOptions)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              showFormOptions
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="Task details (priority, category)"
          >
            <SlidersHorizontal size={16} />
          </button>

          <input
            id="new-task-input"
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-sm bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/30 focus:outline-none transition-all placeholder-slate-400 text-slate-900"
          />

          <button
            id="add-task-submit-btn"
            type="submit"
            disabled={!newTaskText.trim()}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer"
            aria-label="Add Task"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* React Native Export Code Modal */}
      <ReactNativeCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </MobileFrame>
  );
}
