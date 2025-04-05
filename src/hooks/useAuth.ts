import { useState, useEffect } from 'react';
import { users } from '@/data/mockDatabase';

interface AuthUser {
  id: string;
  name: string;
  role: 'employee' | 'hr';
  position: string;
  department: string;
  image: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (id: string, password: string) => {
    try {
      const foundUser = users.find(
        (user) => user.id === id && user.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    logout,
  };
} 