// Local task storage per user (by email)
import { getCurrentUser } from './mockAuth';

const keyFor = (email) => `tasks:${email.toLowerCase()}`;

const loadTasks = (email) => {
  try {
    const raw = localStorage.getItem(keyFor(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTasks = (email, tasks) => {
  localStorage.setItem(keyFor(email), JSON.stringify(tasks));
};

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`);

export const getTasks = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  return loadTasks(user.email).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createTask = async (payload) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const tasks = loadTasks(user.email);
  const task = {
    _id: newId(),
    title: payload.title.trim(),
    description: payload.description?.trim() || '',
    category: payload.category || 'Other',
    status: 'pending',
    reminderTime: payload.reminderTime || null,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  saveTasks(user.email, tasks);
  return task;
};

export const updateTask = async (id, updates) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const tasks = loadTasks(user.email);
  const idx = tasks.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error('Task not found');
  const updated = { ...tasks[idx], ...updates };
  tasks[idx] = updated;
  saveTasks(user.email, tasks);
  return updated;
};

export const deleteTask = async (id) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const tasks = loadTasks(user.email).filter((t) => t._id !== id);
  saveTasks(user.email, tasks);
  return { success: true };
};

export const getStats = async () => {
  const user = getCurrentUser();
  if (!user) return { total: 0, completed: 0, pending: 0 };
  const tasks = loadTasks(user.email);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  return { total, completed, pending };
};
