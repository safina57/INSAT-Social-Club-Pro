import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/store';
import { clearUser } from '@/state';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.global.user);
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);

  };

  const logout = () => {
    localStorage.removeItem('access_token');
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
