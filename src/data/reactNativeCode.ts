export const REACT_NATIVE_CODE = `import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type Priority = 'low' | 'medium' | 'high';
type Category = 'Personal' | 'Work' | 'Shopping' | 'Health' | 'General';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

const STORAGE_KEY = '@rn_todos_list_v1';

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Personal');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load from local storage on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Save to local storage on update
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTodos(JSON.parse(stored));
      } else {
        // Initial sample todos
        setTodos([
          { id: '1', text: 'Review sprint deliverables', completed: false, priority: 'high', category: 'Work', createdAt: Date.now() },
          { id: '2', text: 'Pick up fresh groceries', completed: false, priority: 'medium', category: 'Shopping', createdAt: Date.now() },
          { id: '3', text: 'Daily 30 min walk', completed: true, priority: 'low', category: 'Health', createdAt: Date.now() },
        ]);
      }
    } catch (e) {
      console.error('Failed to load todos', e);
    }
  };

  const saveTodos = async (items: TodoItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  };

  const addTodo = () => {
    if (!inputText.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to remove this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setTodos(todos.filter(t => t.id !== id)) }
    ]);
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>{completedCount} of {todos.length} completed</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Todo List */}
        <FlatList
          data={filteredTodos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <TouchableOpacity
                onPress={() => toggleTodo(item.id)}
                style={[styles.checkbox, item.completed && styles.checkboxActive]}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <View style={styles.todoInfo}>
                <Text style={[styles.todoText, item.completed && styles.todoTextDone]}>
                  {item.text}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.categoryBadge}>{item.category}</Text>
                  <Text style={[
                    styles.priorityBadge,
                    item.priority === 'high' ? styles.priorityHigh :
                    item.priority === 'medium' ? styles.priorityMed : styles.priorityLow
                  ]}>
                    {item.priority}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardContainer: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  headerSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#e2e8f0' },
  filterChipActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTextActive: { color: '#ffffff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  checkmark: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  todoInfo: { flex: 1 },
  todoText: { fontSize: 15, color: '#1e293b' },
  todoTextDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  categoryBadge: { fontSize: 11, color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityBadge: { fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: '600' },
  priorityHigh: { color: '#ef4444', backgroundColor: '#fee2e2' },
  priorityMed: { color: '#f59e0b', backgroundColor: '#fef3c7' },
  priorityLow: { color: '#3b82f6', backgroundColor: '#dbeafe' },
  deleteBtn: { padding: 8 },
  deleteText: { color: '#94a3b8', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#f1f5f9',
    borderRadius: 23,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
});
`;
