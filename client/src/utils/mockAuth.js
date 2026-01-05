// Simple mock auth service using localStorage

const USERS_KEY = 'mockUsers';

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const findUserByEmail = (email) => {
  return loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const signup = async (name, email, password) => {
  const existing = findUserByEmail(email);
  if (existing) {
    return { success: false, message: 'Email already registered' };
  }

  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
    name,
    email,
    // Note: For demo only. Do NOT store plaintext passwords in production.
    password,
    createdAt: new Date().toISOString(),
    token: Math.random().toString(36).slice(2),
  };

  const users = loadUsers();
  users.push(user);
  saveUsers(users);

  const { password: _, ...safeUser } = user;
  localStorage.setItem('userInfo', JSON.stringify(safeUser));
  return { success: true, data: safeUser };
};

export const login = async (email, password) => {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid email or password' };
  }

  const { password: _, ...safeUser } = user;
  localStorage.setItem('userInfo', JSON.stringify(safeUser));
  return { success: true, data: safeUser };
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem('userInfo');
  return raw ? JSON.parse(raw) : null;
};
