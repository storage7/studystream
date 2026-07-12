import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { getToken, setToken, getStoredUser, setStoredUser, clearAll } from '../utils/storage';
import { login as apiLogin, verifyToken } from '../utils/api';
import { useToast } from './ToastContext';

interface AuthContextType extends AuthState {
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const { addToast } = useToast();

  // Verify existing token on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setState({
        user: storedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Background verify
      verifyToken()
        .then(({ user }) => {
          setStoredUser(user);
          setState(prev => ({ ...prev, user, isLoading: false }));
        })
        .catch(() => {
          clearAll();
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(mobile, password);
      setToken(response.token);
      setStoredUser(response.user);
      setState({
        user: response.user as User,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
      addToast({ type: 'success', message: `Welcome back, ${response.user.name}! 🎓` });
      return true;
    } catch {
      // On failure, redirect to Google immediately
      window.location.href = 'https://google.com';
      return false;
    }
  }, [addToast]);

  const logout = useCallback(() => {
    clearAll();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    addToast({ type: 'info', message: 'You have been logged out.' });
  }, [addToast]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
