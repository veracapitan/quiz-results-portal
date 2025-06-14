import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  email: string;
  role: 'doctor' | 'patient';
  name: string;
  surname: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null; // Mantener esta línea para compatibilidad
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use named function declaration for the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Mantener el estado de error

  useEffect(() => {
    try {
      // Verificar si hay un usuario en localStorage
      const storedUser = localStorage.getItem('vitalytics-user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          // Si hay un error al parsear, simplemente limpiar el localStorage
          console.error('Error parsing stored user:', err);
          localStorage.removeItem('vitalytics-user');
          // No establecer error aquí para evitar pantalla en blanco
        }
      }
    } catch (err) {
      console.error('Error checking localStorage:', err);
      // No establecer error aquí para evitar pantalla en blanco
    } finally {
      // Siempre establecer isLoading a false para continuar con la aplicación
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null); // Resetear error
      
      // Buscar usuario en localStorage
      const storedUsers = localStorage.getItem('vitalytics-users');
      const users: (User & { password: string })[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('vitalytics-user', JSON.stringify(userWithoutPassword));
        return { success: true };
      }
      
      // No establecer error en el estado, solo devolverlo en la respuesta
      return { success: false, error: 'Credenciales incorrectas' };
    } catch (err) {
      console.error('Error during login:', err);
      // No establecer error en el estado, solo devolverlo en la respuesta
      return { success: false, error: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => {
    try {
      setIsLoading(true);
      
      // Verificar si el usuario ya existe
      const storedUsers = localStorage.getItem('vitalytics-users');
      const users: (User & { password: string })[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'El correo electrónico ya está registrado' };
      }
      
      // Crear nuevo usuario
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        name,
        surname,
        role,
        password
      };
      
      // Guardar en localStorage
      users.push(newUser);
      localStorage.setItem('vitalytics-users', JSON.stringify(users));
      
      // Establecer usuario actual (sin contraseña)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('vitalytics-user', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (err) {
      console.error('Error during registration:', err);
      return { success: false, error: 'Error al registrar usuario. Por favor, inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null); // Resetear error
    localStorage.removeItem('vitalytics-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Use named function declaration for the hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
