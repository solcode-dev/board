"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function TokenWatcher() {
  const { token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      
      // 이미 만료된 경우
      if (decoded.exp < currentTime) {
        handleLogout();
        return;
      }

      // 만료 시간까지 남은 시간 계산 (밀리초 단위)
      const timeLeft = (decoded.exp - currentTime) * 1000;

      // 만료 시간에 맞춰 로그아웃 예약
      const timer = setTimeout(() => {
        handleLogout();
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Token checking error:", error);
      // 토큰이 유효하지 않으면 로그아웃 처리
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogout = () => {
    logout();
    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
    router.push("/login");
  };

  return null; // UI를 렌더링하지 않음
}
