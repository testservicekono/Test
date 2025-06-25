// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { login, register, getAuthUser } from '../api/authService';
import type { User } from '../types';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export

// Define the shape of our authentication context
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  loadUser: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap our application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // For initial user load

  // Function to load user data based on token
  const loadUser = React.useCallback(async () => {
    if (token) {
      try {
        const decodedToken = jwtDecode<{ user: { id: string }, exp: number }>(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logoutUser(); // Token expired, log out
          setLoading(false);
          return;
        }

        const userData = await getAuthUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to load user or token invalid:', err);
        logoutUser(); // Invalid token, log out
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  // Run loadUser on initial component mount and when token changes
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Re-run if token state changes (e.g., after login/logout)


  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token); // This will trigger the useEffect to load user
      // No need to set isAuthenticated and user here, useEffect will handle it
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.msg || error.message);
      throw error; // Re-throw to be caught by UI
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await register(email, password);
      console.log('Registration successful:', data);
      localStorage.setItem('token', data.token);
      setToken(data.token); // This will trigger the useEffect to load user
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // No need to set loading here, as this is a direct user action
  };

  const contextValue: AuthContextType = {
    token,
    user,
    isAuthenticated,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    loadUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
