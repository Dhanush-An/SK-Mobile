import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthUser } from '../types/auth.types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  simulateRole: (role: 'admin' | 'technician' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await storage.delete('token');
    await storage.delete('user');
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await axiosClient.get('/auth/profile');
      const userData = res.data.data.user;
      setUser(userData);
      await storage.set('user', JSON.stringify(userData));
    } catch (err) {
      logout();
    }
  }, [logout]);
  useEffect(() => {
    const loadStorage = async () => {
      const storedToken = await storage.getString('token');
      const storedUser = await storage.getString('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          refreshProfile();
        } catch (e) {
          console.error('Error parsing stored user:', e);
          logout();
        }
      }
      setLoading(false);
    };
    loadStorage();
  }, [refreshProfile, logout]);

  const login = async (email: string, password: string) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    setToken(newToken);
    setUser(newUser);
    await storage.set('token', newToken);
    await storage.set('user', JSON.stringify(newUser));
  };

  const register = async (data: any) => {
    const res = await axiosClient.post('/auth/register', data);
    const { token: newToken, user: newUser } = res.data.data;
    setToken(newToken);
    setUser(newUser);
    await storage.set('token', newToken);
    await storage.set('user', JSON.stringify(newUser));
  };

  const simulateRole = (role: 'admin' | 'technician' | 'customer') => {
    if (user) {
      setUser({ ...user, role });
    } else {
      setUser({ _id: 'mock', name: 'MOCK USER', email: 'mock@sktech.com', role } as AuthUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile, simulateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
