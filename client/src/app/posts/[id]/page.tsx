"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  findOnePost,
  createComment,
  findAllComment,
  deletePost,
  deleteComment, // deleteComment 추가
} from "../../lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
// import CommentListPage from "@/app/comments/page"; // Removed as comments are now rendered directly

interface TokenPayload {
  username: string;
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const { token } = useAuthStore();
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setCurrentUser(decoded.username);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [token]);

  const fetchPostAndComments = useCallback(async () => {
    if (params?.id) {
      try {
        const data = await findOnePost(params.id);
        setPost(data);
        const commentsData = await findAllComment(params.id);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      }
    }
  }, [params?.id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      if (token) {
        await deletePost(params.id, token);
        alert("게시글이 삭제되었습니다.");
        router.push("/");
      }
    } catch (err: any) {
      alert(err.message || "삭제 실패");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      if (token) {
        await deleteComment(commentId, token);
        alert("댓글이 삭제되었습니다.");
        fetchPostAndComments(); // 목록 갱신
      }
    } catch (err: any) {
      alert(err.message || "삭제 실패");
    }
  };

  const handleCreateComment = async () => {
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login"); // 로그인 페이지로 이동
      return;
    }

    try {
      await createComment(params.id, commentContent, token);
      setCommentContent(""); // 입력창 초기화
      // 댓글 목록 다시 불러오기
      const commentsData = await findAllComment(params.id);
      setComments(commentsData);
    } catch (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  if (!post) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            {currentUser === post?.author?.username && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                type="button"
              >
                삭제
              </button>
            )}
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>작성자: {post?.author?.username}</span>
            <span>
              {post?.createdAt && new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="min-h-[200px] text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">댓글</h3>

        {/* 댓글 작성 폼 */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateComment();
            }}
          />
          <button
            onClick={handleCreateComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            type="button"
          >
            등록
          </button>
        </div>

        {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <div key={comment._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900">
                    {comment.author?.username || "익명"}
                    <span className="text-gray-500 text-sm ml-2 font-normal">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {currentUser === comment.author?.username && (
                    <button
                      onClick={() => handleCommentDelete(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      type="button"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                첫 번째 댓글을 남겨보세요!
              </p>
            )}
          </div>
      </div>
      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 border-t pt-4 mt-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          type="button"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}
