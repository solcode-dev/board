const BASE_URL = "http://localhost:4000";

export async function findAllComment(postId: string) {
  const response = await fetch(`${BASE_URL}/comments/findAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("댓글 조회 실패");
  }
  return response.json();
}

export async function getPostCount() {
  const response = await fetch(`${BASE_URL}/posts/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("글 개수 조회 실패");
  }
  return response.json();
}

export async function findOnePost(id: string) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("글목록 조회 실패");
  }
  return response.json();
}

export async function findAllPost(page: number) {
  const response = await fetch(`${BASE_URL}/posts/findAll/${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("글목록 조회 실패");
  }
  return response.json();
}

export async function createPost(
  title: string,
  content: string,
  token: string
) {
  const response = await fetch(`${BASE_URL}/posts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("글쓰기 실패");
  }
  return response.json();
}

export async function signupUser(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("회원가입 에러 상세:", errorData);
    throw new Error(errorData.message || "회원가입 실패");
  }

  return response.json();
}

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("로그인 실패");
  }

  return response.json();
}

export async function createComment(
  postId: string,
  content: string,
  token: string
) {
  const response = await fetch(`${BASE_URL}/comments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, content }),
  });

  if (!response.ok) {
    console.log("API 응답 데이터 확인:", response);
    throw new Error("댓글 작성 실패");
  }
  return response.json();
}

export async function deletePost(id: string, token: string) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 삭제 실패");
  }
  
  // 204 No Content인 경우 처리
  if (response.status === 204) {
      return {};
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function deleteComment(id: string, token: string) {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 삭제 실패");
  }

  if (response.status === 204) {
    return {};
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
