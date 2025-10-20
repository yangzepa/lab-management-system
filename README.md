# Lab Management System

순천향대학교 Efficient Computing Lab (효율컴퓨팅 연구실) 관리 시스템

## 📋 개요

연구실 운영을 위한 종합 관리 시스템으로, 프로젝트, 태스크, 연구원 정보를 효율적으로 관리할 수 있습니다.

## ✨ 주요 기능

### 🔐 인증 & 권한
- JWT 기반 인증 시스템
- Admin / Researcher 역할 기반 권한 관리
- 프로필 사진 업로드

### 📊 프로젝트 관리
- 프로젝트 생성, 수정, 삭제
- 상태 추적 (PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED)
- 우선순위 설정 (HIGH, MEDIUM, LOW)
- 진행률 관리 (0-100%)

### 📝 태스크 관리
- 드래그 앤 드롭 칸반 보드 (@dnd-kit)
- 상태별 태스크 관리 (TODO, IN_PROGRESS, DONE, BLOCKED)
- 실시간 검색 & 필터링
- 담당자 배정 및 마감일 관리

### 👥 연구원 관리
- 연구원 프로필 관리
- 연구 분야 태그
- 프로젝트/태스크 배정 현황

### 🎨 UI/UX
- 다크 모드 지원
- 반응형 디자인 (모바일/태블릿/데스크톱)
- Framer Motion 애니메이션
- Tailwind CSS 스타일링

### 🌐 공개 랜딩 페이지
- 연구실 소개
- 팀 멤버 소개
- 프로젝트 쇼케이스
- 연락처 정보

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Security**: Spring Security + JWT
- **Build**: Gradle
- **Utilities**: Lombok, MapStruct

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State**: Zustand
- **UI Library**: 
  - Tailwind CSS
  - Framer Motion
  - Headless UI
  - @dnd-kit
  - Lucide Icons
- **Forms**: React Hook Form
- **API**: Axios

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (개발 환경에서는 Vite dev server)

## 🚀 시작하기

### 필수 요구사항

- Docker & Docker Compose
- Node.js 18+ (프론트엔드 개발 시)
- Java 17+ (백엔드 개발 시)

### 설치 및 실행

#### 1. Docker로 전체 실행 (권장)

```bash
# 레포지토리 클론
git clone <repository-url>
cd labwebpage

# Docker Compose로 실행
docker-compose up -d

# 실행 확인
docker ps
```

#### 2. 개발 환경 설정

**Backend (Spring Boot)**
```bash
# Gradle 빌드
./gradlew build

# 로컬 실행
./gradlew bootRun
```

**Frontend (React)**
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📍 접속 주소

- **공개 랜딩 페이지**: http://localhost:5173/
- **로그인 페이지**: http://localhost:5173/login
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 🔑 초기 계정

### Admin 계정
- **Username**: admin
- **Password**: demo123

### Sample User 계정
- **Username**: user1 / user2 / user3 / user4 / user5 / user6
- **Password**: demo123

**⚠️ 주의**: 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!

## 📁 프로젝트 구조

```
labwebpage/
├── src/                          # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/
│   │   │   └── com/lab/management/
│   │   │       ├── config/       # 설정
│   │   │       ├── controller/   # REST API 컨트롤러
│   │   │       ├── dto/          # Data Transfer Objects
│   │   │       ├── entity/       # JPA 엔티티
│   │   │       ├── repository/   # JPA 레포지토리
│   │   │       ├── security/     # 인증/보안
│   │   │       └── service/      # 비즈니스 로직
│   │   └── resources/
│   │       └── application.yml   # 설정 파일
│   └── test/                     # 테스트
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── contexts/             # React Context (Theme)
│   │   ├── pages/                # 페이지 컴포넌트
│   │   ├── services/             # API 서비스
│   │   ├── store/                # Zustand 스토어
│   │   ├── types/                # TypeScript 타입
│   │   └── App.tsx               # 메인 앱
│   ├── public/                   # 정적 파일
│   └── package.json
├── docker-compose.yml            # Docker Compose 설정
├── Dockerfile                    # Backend Docker 이미지
└── README.md
```

## 🔧 주요 API 엔드포인트

### Public APIs
- `GET /api/public/lab/info` - 연구실 정보
- `GET /api/public/researchers` - 연구원 목록
- `GET /api/public/projects` - 프로젝트 목록

### Auth APIs
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

### Admin APIs
- `/api/admin/researchers` - 연구원 관리
- `/api/admin/projects` - 프로젝트 관리
- `/api/admin/tasks` - 태스크 관리
- `/api/admin/users` - 사용자 관리
- `/api/admin/upload` - 파일 업로드

### User APIs
- `GET /api/user/my-profile` - 내 프로필 조회
- `PUT /api/user/my-profile` - 내 프로필 수정
- `GET /api/user/my-tasks` - 내 태스크 조회

## 🎯 개발 로드맵

- [x] 기본 인증 시스템
- [x] 프로젝트 관리
- [x] 태스크 관리 (칸반 보드)
- [x] 연구원 관리
- [x] 다크 모드
- [x] 공개 랜딩 페이지
- [x] 파일 업로드
- [x] 프로필 관리
- [ ] 알림 시스템
- [ ] 실시간 채팅
- [ ] 일정 관리 (캘린더)
- [ ] 통계 대시보드 개선

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 개발자

순천향대학교 Efficient Computing Lab (효율컴퓨팅 연구실)

---

**Built with ❤️ by Efficient Computing Lab**
