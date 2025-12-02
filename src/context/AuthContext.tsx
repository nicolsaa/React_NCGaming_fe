import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: { email: string; password: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      const authData = await authService.login({ email: payload.email, password: payload.password });
      const userData: User = {
        id: String(authData.id),
        username: authData.username,
        email: authData.email,
        role: authData.role,
        name: authData.username
      } as User;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (payload.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('token');
  };

  // Verify if a user exists in localStorage on load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
