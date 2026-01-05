import { createContext, useState, useEffect } from 'react';
import * as mockAuth from '../utils/mockAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await mockAuth.login(email, password);
    if (result.success) {
      setUser(result.data);
      return { success: true };
    }
    return { success: false, message: result.message || 'Login failed' };
  };

  const signup = async (name, email, password) => {
    const result = await mockAuth.signup(name, email, password);
    if (result.success) {
      setUser(result.data);
      return { success: true };
    }
    return { success: false, message: result.message || 'Signup failed' };
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
