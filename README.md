# 프로젝트 아키텍처 문서
이 문서는 **Jungle Board** 프로젝트의 전체 시스템 아키텍처를 설명합니다.
## 시스템 개요
이 프로젝트는 게시판 기능을 제공하는 웹 애플리케이션으로, 클라이언트-서버 구조로 분리되어 있습니다.
- **Client**: 사용자 인터페이스 및 상태 관리 (Next.js)
- **Server**: 비즈니스 로직 및 데이터 처리 (NestJS)
- **Database**: 데이터 영속성 (MongoDB)
## 기술 스택
### Client
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand (클라이언트 상태)
- **Styling**: Tailwind CSS, shadcn/ui
- **HTTP Client**: Fetch API (or Axios)
### Server
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database ODM**: Mongoose (MongoDB)
- **Authentication**: Passport, JWT (Strategy: Local, JWT)
## 아키텍처 다이어그램
아래 다이어그램은 시스템의 주요 컴포넌트와 데이터 흐름을 나타냅니다.
<img width="1382" height="549" alt="image" src="https://github.com/user-attachments/assets/3f9f9ed4-3965-4dab-bb97-c939debc7433" />


## 주요 데이터 흐름
1.  **회원가입 (Signup)**
    -   **Client**: 사용자가 회원가입 폼을 제출합니다.
    -   **Server (UsersModule)**: `UsersController`가 요청을 받아 `UsersService`로 전달합니다. 비밀번호는 bcrypt로 암호화되어 MongoDB에 저장됩니다.
2.  **로그인 및 인증 (Login & Authentication)**
    -   **Client**: 사용자가 이메일/비밀번호로 로그인을 요청합니다.
    -   **Server (AuthModule)**: `AuthService`가 `LocalStrategy`를 통해 자격 증명을 검증합니다.
    -   **Token Issue**: 검증 성공 시 `JwtService`가 JWT(Access Token)를 생성하여 반환합니다.
    -   **State**: Client는 토큰을 안전하게 저장하고(예: LocalStorage/Cookie), Zustand 스토어에 로그인 상태를 업데이트합니다.
3.  **게시글 및 댓글 작성 (Posts & Comments)**
    -   **Guard**: 보호된 라우트 요청 시 `JwtAuthGuard`가 헤더의 토큰을 검증합니다.
    -   **Service Logic**: 유효한 토큰의 `userId`를 사용하여 `PostsService` 또는 `CommentsService`가 데이터를 생성하고 MongoDB에 저장합니다.
    -   **Response**: 생성된 데이터가 Client로 실시간 반영(Invalidate Queries)됩니다.

## 회고
- 기능 요구사항은 개발계획문서가 아니다. 한 가지 기능이라도 개발해야 할 요소는 여러 개이고, 어떤 방식으로 구현해야 할지 결정 후 구현해야한다.
- 일정보다 1-2d 빠르게 개발하자. 어떤 문제가 생길지 모른다.
