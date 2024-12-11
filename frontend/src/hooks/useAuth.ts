import { create } from "zustand";
import { User } from "@/types";
import { apiClient } from "@/lib/apiClient";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (username: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await apiClient.post("/auth/login", {
                username,
                password,
            });
            localStorage.setItem("token", data.access_token);
            set({ user: data.user });
        } catch (error) {
            set({ error: "Ошибка авторизации" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
    },

    checkAuth: async () => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await apiClient.get("/auth/me");
            set({ user: data });
        } catch (error) {
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    },
}));

// Проверяем аутентификацию при инициализации
useAuth.getState().checkAuth();
