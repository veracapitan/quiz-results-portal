
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('vitalytics-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // For demo purposes, we're using a mock login
    // In a real app, you would validate credentials against a backend
    if (email && password.length >= 6) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('vitalytics-user', JSON.stringify(newUser));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${newUser.name}`,
      });
      
      navigate('/');
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales inválidas. La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vitalytics-user');
    localStorage.removeItem('vitalytics-questionnaires');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
