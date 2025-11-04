import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Company {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    company: Company;
    userGroup: string | null;
    authProvider: string;
    googleId: string | null;
    emailVerified: boolean;
    isActive: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
    tags: string[];
}

export interface AuthResponse {
    status: string;
    data: Array<{
        token: string;
        user: User;
    }>;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            login: (user: User, token: string) =>
                set({ user, token, isAuthenticated: true }),
            logout: () =>
                set({ user: null, token: null, isAuthenticated: false }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
