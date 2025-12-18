// 게시글 목록 페이지
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { findAllPost, getPostCount} from "../lib/api";

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

export default function PostListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //컴포넌트가 처음 뜰 때 딱 한번 실행된다
  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await findAllPost(page);
        setPosts(posts); 

        const postCount = await getPostCount();
        setTotalPages(Math.ceil(postCount/10));
      } catch (err) {
        console.error("실패.", err);
      }
    };
    fetchData();
  }, [page]);

  const createPost = () => {
    router.push("./posts/create");
  };

  const handlePostClick = (postId: string) => {
    router.push(`./posts/${postId}`);
  };

  const handlePageClick = (page: number) => {

      try {
        setPage(page);

      } catch (err) {
        console.error("실패.", err);
      }
  
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">게시글 목록</h1>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                작성자
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                날짜
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr
                key={post._id}
                onClick={() => handlePostClick(post._id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {post.author.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {formatDate(post.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative flex justify-center items-center mt-6 min-h-[40px]">
        {/* 페이지네이션 (중앙 정렬) */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={()=>handlePageClick(pageNum)}
              className={`px-3 py-1 border rounded ${
                pageNum === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* 글쓰기 버튼 (우측 정렬) */}
        <div className="absolute right-0">
          <button
            onClick={createPost}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            글쓰기
          </button>
        </div>
      </div>
    </div>
  );
}
