import React, { createContext, useContext, useState, useEffect } from 'react';
// Importaciones eliminadas para Firebase Auth

interface User {
  uid: string;
  email: string;
  role: 'doctor' | 'patient';
  name: string;
  surname: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<Date | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    try {
      setError(null);
      
      // Verificar si hay usuario en localStorage
      const userId = localStorage.getItem('current_user_id');
      if (userId) {
        const role = localStorage.getItem(`user_role_${userId}`) as 'doctor' | 'patient' || 'patient';
        const name = localStorage.getItem(`user_name_${userId}`) || '';
        const surname = localStorage.getItem(`user_surname_${userId}`) || '';
        const email = localStorage.getItem(`user_email_${userId}`) || '';
        
        setUser({
          uid: userId,
          email,
          role,
          name,
          surname
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      setError('Error loading user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = async (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => {
    try {
      // Verificar si el email ya está registrado
      const existingRoleKeys = Object.keys(localStorage).filter(key => key.startsWith('user_role_'));
      const existingEmails = existingRoleKeys.map(key => {
        const uid = key.replace('user_role_', '');
        return localStorage.getItem(`user_email_${uid}`);
      });
      
      if (existingEmails.includes(email)) {
        return { success: false, error: "Este correo electrónico ya está registrado." };
      }

      // Generar ID único
      const userId = Date.now().toString();
      
      // Guardar datos en localStorage
      localStorage.setItem(`user_role_${userId}`, role);
      localStorage.setItem(`user_name_${userId}`, name);
      localStorage.setItem(`user_surname_${userId}`, surname);
      localStorage.setItem(`user_email_${userId}`, email);
      localStorage.setItem(`user_password_${userId}`, password);
      
      setUser({ uid: userId, email, role, name, surname });
      return { success: true };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error: "Error al registrar usuario." };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Buscar usuario por email
      const existingRoleKeys = Object.keys(localStorage).filter(key => key.startsWith('user_email_'));
      const userId = existingRoleKeys.find(key => localStorage.getItem(key) === email)?.replace('user_email_', '');
      
      if (!userId) {
        return { success: false, error: "El correo electrónico no existe." };
      }
      
      // Verificar contraseña
      const storedPassword = localStorage.getItem(`user_password_${userId}`);
      if (storedPassword !== password) {
        return { success: false, error: "La contraseña es incorrecta." };
      }
      
      // Obtener datos del usuario
      const role = localStorage.getItem(`user_role_${userId}`) as 'doctor' | 'patient' || 'patient';
      const name = localStorage.getItem(`user_name_${userId}`) || '';
      const surname = localStorage.getItem(`user_surname_${userId}`) || '';
      
      setUser({
        uid: userId,
        email,
        role,
        name,
        surname
      });
      return { success: true };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: "Error al iniciar sesión." };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return ( 
    <AuthContext.Provider value={{ user, register, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
