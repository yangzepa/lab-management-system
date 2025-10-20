# Lab Management System - Frontend

React + TypeScript + Vite 기반 연구실 관리 시스템 프론트엔드

## 🚀 빠른 시작

### 1. 패키지 설치

```bash
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 3. 백엔드 서버 확인

백엔드 서버가 http://localhost:8080에서 실행 중이어야 합니다.

```bash
# 다른 터미널에서 백엔드 실행
cd ..
docker-compose up -d
# 또는
./gradlew bootRun
```

## 📋 기본 로그인 정보

**관리자 계정**
- Username: `admin`
- Password: `admin123!`

**연구원 계정**
- Username: `park` / `choi` / `hwang` / `kim.b` / `kang` / `kim.k`
- Password: `admin123!`

## 🎯 주요 기능

### 1. 대시보드
- 연구실 통계 한눈에 보기
- 프로젝트 진행 현황
- 태스크 완료율

### 2. 프로젝트 관리
- 프로젝트 목록 및 상세 정보
- 프로젝트별 칸반 보드
- 진행률 추적

### 3. 칸반 보드
- 드래그 앤 드롭으로 태스크 상태 변경
- 4개 컬럼: To Do, In Progress, Done, Blocked
- 실시간 업데이트

### 4. 태스크 관리
- 태스크 생성/수정/삭제
- 담당자 배정
- 마감일 및 우선순위 설정

### 5. 연구원 관리
- 연구원 목록 및 상세 정보
- 연구 분야별 분류
- 연락처 정보

## 🛠 기술 스택

- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **React Router**: 라우팅
- **React Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Axios**: HTTP 클라이언트
- **React Hook Form**: 폼 관리
- **React Beautiful DnD**: 드래그 앤 드롭
- **Tailwind CSS**: 스타일링
- **Lucide React**: 아이콘

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskModal.tsx
│   │   └── Layout.tsx
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   └── ResearchersPage.tsx
│   ├── services/        # API 서비스
│   │   └── api.ts
│   ├── store/           # 상태 관리
│   │   └── authStore.ts
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 엔트리 포인트
│   └── index.css        # 글로벌 스타일
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 프리뷰
npm run preview

# 타입 체크
tsc --noEmit

# Lint
npm run lint
```

## 🌐 API 엔드포인트

모든 API는 `/api` 프리픽스를 가집니다.

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

### 프로젝트
- `GET /api/admin/projects` - 프로젝트 목록
- `GET /api/admin/projects/:id` - 프로젝트 상세
- `POST /api/admin/projects` - 프로젝트 생성
- `PUT /api/admin/projects/:id` - 프로젝트 수정
- `DELETE /api/admin/projects/:id` - 프로젝트 삭제

### 태스크
- `GET /api/admin/tasks` - 태스크 목록
- `GET /api/admin/tasks/:id` - 태스크 상세
- `POST /api/admin/tasks` - 태스크 생성
- `PUT /api/admin/tasks/:id` - 태스크 수정
- `DELETE /api/admin/tasks/:id` - 태스크 삭제

### 연구원
- `GET /api/admin/researchers` - 연구원 목록
- `GET /api/admin/researchers/:id` - 연구원 상세
- `POST /api/admin/researchers` - 연구원 생성
- `PUT /api/admin/researchers/:id` - 연구원 수정
- `DELETE /api/admin/researchers/:id` - 연구원 삭제

### 대시보드
- `GET /api/admin/dashboard/stats` - 통계 정보

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크 모드 준비**: Tailwind CSS로 쉽게 추가 가능
- **직관적인 네비게이션**: 사이드바와 브레드크럼
- **실시간 피드백**: 로딩 상태, 에러 메시지
- **드래그 앤 드롭**: 자연스러운 태스크 관리

## 🔐 인증 흐름

1. 로그인 페이지에서 사용자명/비밀번호 입력
2. 백엔드에서 JWT 토큰 발급
3. 토큰을 localStorage에 저장
4. 이후 모든 API 요청에 토큰 포함
5. 401 에러 시 자동 로그아웃

## 🚨 트러블슈팅

### 백엔드 연결 오류

```bash
# 백엔드가 실행 중인지 확인
curl http://localhost:8080/api/public/lab/info
```

### CORS 오류

vite.config.ts의 proxy 설정 확인:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

### 패키지 설치 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📝 라이선스

MIT License

## 👥 개발자

Medical AI Research Lab, Soonchunhyang University
