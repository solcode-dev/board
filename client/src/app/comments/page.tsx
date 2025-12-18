// 댓글 목록 페이지
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { findAllComment } from "../lib/api";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간제 (오전/오후 빼기)
  });
};

export default function CommentListPage({ page }) {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);

  //컴포넌트가 처음 뜰 때 딱 한번 실행된다
  useEffect(() => {
    const fetchData = async () => {
      try {
        const comments = await findAllComment(page);
        setComments(comments); 
      } catch (err) {
        console.error("실패.", err);
      }
    };
    fetchData();
  }, [page]);

  // const createComment = () => { //TODO
  //   router.push("./comments/create");
  // };

  return (
    <>
      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">
                {comment.author?.username || "익명"}
              </span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </>
  );
}
