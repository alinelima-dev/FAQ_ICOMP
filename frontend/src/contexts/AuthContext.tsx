// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login as loginService } from '../services/authService';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (usuario: string, senha: string) => {
    const token = await loginService(usuario, senha); // Chama o serviço de login
    setToken(token); // Armazena o token no estado
    axios.defaults.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token no header para futuras requisições
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers['Authorization']; // Remove o token do header
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
