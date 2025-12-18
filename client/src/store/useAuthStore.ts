// 로그인 상태 전역 관리
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null, // 처음에는 토큰 없음
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
