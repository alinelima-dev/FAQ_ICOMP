import React, { createContext, useState, useContext, ReactNode } from "react";
import { login as loginService } from "../services/authService";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  usuario: string | null;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [usuario, setUsuario] = useState<string | null>(
    localStorage.getItem("usuario")
  );

  const login = async (usuario: string, senha: string) => {
    const token = await loginService(usuario, senha);
    setToken(token);
    setUsuario(usuario); // salva usuário no estado

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", usuario);

    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);

    delete axios.defaults.headers["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
