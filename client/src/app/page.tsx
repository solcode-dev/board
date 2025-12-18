"use client";
import { useAuthStore } from "@/store/useAuthStore";
import LoginPage from "./login/page";
import IsLoggedIn from "./token/page";
import PostListPage from "./posts/page";

export default function Home() {
  const { token, logout } = useAuthStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Jungle Board</h1>

      {token ? (
        <div>
          <IsLoggedIn></IsLoggedIn>
          <br/>
          <PostListPage></PostListPage>
        </div>
      ) : (
        <div>
          <LoginPage></LoginPage>
        </div>
      )}
      
    </main>
  );
}
