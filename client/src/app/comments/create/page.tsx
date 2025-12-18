// 댓글 목록 페이지
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { findAllComment } from "../lib/api";

export default function CommentCreatePage() {
  const router = useRouter();
  // const [comments, setComments] = useState<any[]>([]);

  // const createComment = () => { //TODO
  //   router.push("./comments/create");
  // };

  return (
    <div>
      {/* 댓글 작성 폼 */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          등록
        </button>
      </div>
    </div>
  );
}
