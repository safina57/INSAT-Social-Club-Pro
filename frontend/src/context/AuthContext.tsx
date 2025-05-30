import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('accessToken'));
  const [isAdmin, setIsAdmin] = useState<boolean>(Cookies.get('userRole') === 'admin');

  useEffect(() => {
    setIsAuthenticated(!!Cookies.get('accessToken'));
    setIsAdmin(Cookies.get('userRole') === 'admin');
  }, []);
  
  const login = (token: string, role: string) => {
    Cookies.set('accessToken', token, { 
      path: '/', 
      secure: false,  
      sameSite: 'Strict', 
      expires: 1  
    });
  
    Cookies.set('userRole', role, { 
      path: '/', 
      secure: false,  
      sameSite: 'Strict', 
      expires: 1  
    });
  
    setIsAuthenticated(true);
    setIsAdmin(role === 'admin');
  };
  

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userRole');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const setRole = (role: string) => {
    Cookies.set('userRole', role, { path: '/', secure: false, sameSite: 'Lax' });
    setIsAdmin(role === 'admin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, setRole }}>
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