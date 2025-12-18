"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "../lib/api";

export default function SingupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signupUser(username, password);
      alert("회원가입 성공! 로그인해주세요.");
      router.push("/login");
    } catch (err: any) {
      console.error("회원가입 실패.", err);
      // api.ts에서 던진 에러 메시지(서버 응답)를 표시
      alert(err.message || "회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          회원가입
        </h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              아이디
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
              id="userId"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="userPw"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
              id="userPw"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
            가입하기
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:underline font-medium"
              type="button"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
