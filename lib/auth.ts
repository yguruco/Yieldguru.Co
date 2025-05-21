import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, deleteCookie } from './cookies';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Investor' | 'Operator';
  status: 'Active' | 'Inactive' | 'Pending';
  token?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: AuthUser) => {
        // Set auth token in cookie for server-side authentication
        if (user.token) {
          setCookie('auth-token', user.token, 1); // 1 day expiration
        }
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        // Remove auth token from cookies
        deleteCookie('auth-token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Authentication API functions
export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login');
  }

  return response.json();
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  role: 'Admin' | 'Investor' | 'Operator' = 'Investor'
): Promise<AuthUser> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to signup');
  }

  return response.json();
}

export async function validateToken(token: string): Promise<AuthUser> {
  const response = await fetch('/api/auth/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to validate token');
  }

  return response.json();
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  const { user } = useAuthStore.getState();
  return user?.token || null;
}

// Helper function to check if user has specific role
export function hasRole(role: 'Admin' | 'Investor' | 'Operator'): boolean {
  const { user } = useAuthStore.getState();
  return user?.role === role;
}
