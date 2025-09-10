import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('finance-tracker-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('finance-tracker-user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('finance-tracker-users') || '[]');
      const userExists = existingUsers.find((u: User) => u.email === email);
      
      if (userExists) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Save user credentials (in real app, this would be hashed)
      const userCredentials = { email, password, userId: newUser.id };
      const credentials = JSON.parse(localStorage.getItem('finance-tracker-credentials') || '[]');
      credentials.push(userCredentials);
      localStorage.setItem('finance-tracker-credentials', JSON.stringify(credentials));

      // Save user data
      existingUsers.push(newUser);
      localStorage.setItem('finance-tracker-users', JSON.stringify(existingUsers));

      // Set current user
      setUser(newUser);
      localStorage.setItem('finance-tracker-user', JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check credentials
      const credentials = JSON.parse(localStorage.getItem('finance-tracker-credentials') || '[]');
      const userCredential = credentials.find((c: any) => c.email === email && c.password === password);
      
      if (!userCredential) {
        return false; // Invalid credentials
      }

      // Get user data
      const users = JSON.parse(localStorage.getItem('finance-tracker-users') || '[]');
      const userData = users.find((u: User) => u.id === userCredential.userId);
      
      if (!userData) {
        return false; // User data not found
      }

      // Set current user
      setUser(userData);
      localStorage.setItem('finance-tracker-user', JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance-tracker-user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};