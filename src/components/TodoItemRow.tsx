import React, { useState } from 'react';
import { Check, Trash2, Edit2, X, Save } from 'lucide-react';
import { TodoItem } from '../types';

interface TodoItemRowProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItemRow: React.FC<TodoItemRowProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getPriorityClasses = (p: TodoItem['priority']) => {
    switch (p) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getCategoryClasses = (c: TodoItem['category']) => {
    switch (c) {
      case 'Work':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Personal':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Shopping':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Health':
        return 'text-pink-700 bg-pink-50 border-pink-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div
      id={`todo-item-${todo.id}`}
      className={`group flex items-start gap-3 p-3.5 bg-white rounded-2xl border transition-all duration-150 ${
        todo.completed
          ? 'border-slate-200/70 bg-slate-50/70 opacity-75'
          : 'border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Checkbox button */}
      <button
        id={`todo-toggle-${todo.id}`}
        type="button"
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors border cursor-pointer ${
          todo.completed
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-slate-300 hover:border-blue-500 bg-white'
        }`}
        aria-label={todo.completed ? 'Mark uncompleted' : 'Mark completed'}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1.5 w-full">
            <input
              id={`edit-input-${todo.id}`}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full text-sm px-2 py-1 border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
            />
            <button
              id={`save-edit-${todo.id}`}
              type="button"
              onClick={handleSave}
              className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
              title="Save"
            >
              <Save size={16} />
            </button>
            <button
              id={`cancel-edit-${todo.id}`}
              type="button"
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <p
              onClick={() => onToggle(todo.id)}
              className={`text-[15px] leading-snug cursor-pointer break-words transition-colors ${
                todo.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-800 font-medium'
              }`}
            >
              {todo.text}
            </p>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryClasses(
                  todo.category
                )}`}
              >
                {todo.category}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getPriorityClasses(
                  todo.priority
                )}`}
              >
                {todo.priority}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-btn-${todo.id}`}
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Edit task"
          >
            <Edit2 size={15} />
          </button>
          <button
            id={`delete-btn-${todo.id}`}
            type="button"
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
