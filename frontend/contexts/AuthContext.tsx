'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export type UserRole = 'admin' | 'agent' | 'user' | 'visitor';

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  aadharNumber?: string | null;
  isVerified: boolean;
  upgradeRequested: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  savedListingIds: number[];
  toggleSave: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEMO_USERS = {
  'admin@propify.in': {
    password: 'admin123',
    role: 'admin' as UserRole,
    displayName: 'Admin User'
  },
  'visitor@propify.in': {
    password: 'visitor123',
    role: 'visitor' as UserRole,
    displayName: 'Visitor User'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [savedListingIds, setSavedListingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in via API
    const checkAuthState = async () => {
      try {
        const { data } = await api.get('/auth/me'); // Assuming /me endpoint exists and returns user data
        if (data) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name || 'User', // Fallback if name is somehow null
            role: (data.role || 'visitor').toLowerCase() as UserRole,
            avatar: data.avatar,
            phone: data.phone,
            bio: data.bio,
            aadharNumber: data.aadharNumber,
            isVerified: data.isVerified,
            upgradeRequested: data.upgradeRequested,
          });

          // Fetch saved listings
          const profileRes = await api.get('/users/profilePosts');
          if (profileRes.data && profileRes.data.savedListings) {
            setSavedListingIds(profileRes.data.savedListings.map((l: any) => l.id));
          }
        }
      } catch (error) {
        // Not logged in or token expired
        console.log("Not authenticated");
        setUser(null);
        setSavedListingIds([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      const userData: UserData = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role.toLowerCase() as UserRole,
        avatar: data.avatar,
        phone: data.phone,
        bio: data.bio,
        aadharNumber: data.aadharNumber,
        isVerified: data.isVerified,
        upgradeRequested: data.upgradeRequested,
      };


      setUser(userData);

      // Fetch saved listings on fresh login
      try {
        const profileRes = await api.get('/users/profilePosts');
        if (profileRes.data && profileRes.data.savedListings) {
          setSavedListingIds(profileRes.data.savedListings.map((l: any) => l.id));
        }
      } catch (err) {
        console.error("Failed to fetch saved listings on login", err);
      }

      // Dispatch custom event for navbar to listen
      window.dispatchEvent(new Event('userLoggedIn'));

      // Redirect based on role
      if (userData.role === 'admin' || userData.role === 'agent') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

    } catch (error: any) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setSavedListingIds([]);

      // Dispatch custom event for navbar to listen
      window.dispatchEvent(new Event('userLoggedOut'));

      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
      // Force logout on frontend anyway
      setUser(null);
      setSavedListingIds([]);
      router.push('/');
    }
  };

  const toggleSave = async (id: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await api.post('/users/save', { listingId: id });
      setSavedListingIds(prev =>
        prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
      );
    } catch (err) {
      console.error("Failed to toggle save", err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    savedListingIds,
    toggleSave
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};