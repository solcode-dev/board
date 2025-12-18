"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { createPost } from "../../lib/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  username: string;
}

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState<string>("");
  const { token, logout } = useAuthStore();
  const router = useRouter();

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      if (token) {
        await createPost(title, content, token);
        alert("게시글이 등록되었습니다.");
        router.push("/");
      } else {
        alert("로그인이 필요합니다.");
        router.push("/login");
      }
    } catch (err) {
      console.error("실패.", err);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 상단 로그인 상태 헤더 */}
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

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">게시글 작성</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                제목
              </label>
              <input
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                내용
              </label>
              <textarea
                id="content"
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                목록으로
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
