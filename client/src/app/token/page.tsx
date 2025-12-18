import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

export default function IsLoggedIn() {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className=" bg-gray-50 relative">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-800 font-semibold" suppressHydrationWarning>
            {username ? `${username}님` : "로그인 상태"}
          </p>
          <p className="text-xs text-green-600">● 로그인 중</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
