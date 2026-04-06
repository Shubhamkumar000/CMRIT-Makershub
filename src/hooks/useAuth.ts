import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isCmritStudent?: boolean;
  usn?: string;
  branch?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      fetchUserProfile(token);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // Token invalid, clear it
        clearAuth();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      clearAuth();
    }
  };

  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
      const payload = isAdmin ? { username: email, password } : { email, password };
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
        const text = await response.text();
        throw new Error(text || 'Login failed');
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('admin_logged_in');
      sessionStorage.removeItem('admin_logged_in');

      // Store token persistently for both students and admins
      const storage = localStorage;
      storage.setItem('authToken', token);
      if (user.role === 'admin') {
        localStorage.setItem('admin_logged_in', 'true');
      }

      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof TypeError
        ? 'Cannot reach backend API. Ensure backend is running on port 5000.'
        : error instanceof Error
          ? error.message
          : 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        const text = await response.text();
        throw new Error(text || 'Registration failed');
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('admin_logged_in');
      sessionStorage.removeItem('admin_logged_in');
      localStorage.setItem('authToken', token);

      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error instanceof TypeError
        ? 'Cannot reach backend API. Ensure backend is running on port 5000.'
        : error instanceof Error
          ? error.message
          : 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_logged_in');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
