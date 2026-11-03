'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/types/brandVault';

export interface DemoUser {
  email: string;
  name: string;
  displayName: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  avatarInitials: string;
}

export interface DemoAccountCredential {
  email: string;
  password: string;
  user: DemoUser;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoAccountCredential> = {
  creator: {
    email: 'creator@seadra.internal',
    password: 'demo@creator2026',
    user: {
      email: 'creator@seadra.internal',
      name: 'Suresh',
      displayName: 'Suresh (Creator)',
      role: 'creator',
      roleLabel: 'Content Creator',
      department: 'Marketer / Copywriter',
      avatarInitials: 'SC',
    },
  },
  reviewer: {
    email: 'reviewer@seadra.internal',
    password: 'demo@reviewer2026',
    user: {
      email: 'reviewer@seadra.internal',
      name: 'Brand Reviewer',
      displayName: 'Brand Reviewer (Compliance)',
      role: 'reviewer',
      roleLabel: 'Authorised Reviewer',
      department: 'Brand Manager / Compliance',
      avatarInitials: 'BR',
    },
  },
};

const SESSION_STORAGE_KEY = 'seadra_demo_session';

interface AuthContextType {
  user: DemoUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  quickLogin: (role: UserRole) => void;
  switchRole: (targetRole?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(SESSION_STORAGE_KEY) as UserRole | null;
      if (savedRole && (savedRole === 'creator' || savedRole === 'reviewer')) {
        setUser(DEMO_CREDENTIALS[savedRole].user);
      }
    } catch (err) {
      console.error('Failed to restore demo session from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const quickLogin = useCallback((targetRole: UserRole) => {
    const selected = DEMO_CREDENTIALS[targetRole].user;
    setUser(selected);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, targetRole);
    } catch (err) {
      console.error('Failed to persist session to localStorage:', err);
    }
  }, []);

  const loginWithCredentials = useCallback(
    (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput.trim();

      if (
        email === DEMO_CREDENTIALS.creator.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.creator.password
      ) {
        quickLogin('creator');
        return { success: true };
      }

      if (
        email === DEMO_CREDENTIALS.reviewer.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.reviewer.password
      ) {
        quickLogin('reviewer');
        return { success: true };
      }

      return {
        success: false,
        error: 'Invalid demo credentials. Please use the pre-configured Codex 48 demo credentials below.',
      };
    },
    [quickLogin]
  );

  const switchRole = useCallback(
    (targetRole?: UserRole) => {
      const nextRole: UserRole = targetRole || (user?.role === 'creator' ? 'reviewer' : 'creator');
      quickLogin(nextRole);
    },
    [user, quickLogin]
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear session from localStorage:', err);
    }
  }, []);

  const value: AuthContextType = {
    user,
    role: user?.role ?? 'creator',
    isAuthenticated: Boolean(user),
    isLoading,
    loginWithCredentials,
    quickLogin,
    switchRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

