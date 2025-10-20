# 🚀 빠른 시작 가이드

## 자동 실행 (권장)

### Mac/Linux

```bash
./start.sh
```

### Windows

```bash
# PowerShell에서
.\start.ps1
```

스크립트가 자동으로:
1. Docker Compose로 백엔드 시작 (MySQL + Spring Boot)
2. 프론트엔드 의존성 설치 (처음만)
3. 프론트엔드 개발 서버 시작

## 수동 실행

### 1단계: 백엔드 시작

```bash
# Docker Compose 사용 (권장)
docker-compose up -d

# 또는 Gradle 직접 사용
./gradlew bootRun
```

### 2단계: 프론트엔드 시작

```bash
cd frontend
npm install
npm run dev
```

## 접속 정보

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html

## 로그인

**관리자 계정**
- Username: `admin`
- Password: `admin123!`

**연구원 계정**
- Username: `park`, `choi`, `hwang`, `kim.b`, `kang`, `kim.k`
- Password: `admin123!`

## 주요 기능

1. **대시보드** - 연구실 통계 및 현황
2. **프로젝트** - 프로젝트 관리 및 칸반 보드
3. **연구원** - 연구원 정보 관리

## 칸반 보드 사용법

1. 대시보드에서 프로젝트 클릭
2. 칸반 보드에서 태스크 드래그 앤 드롭
3. 태스크 클릭하여 상세 정보 수정
4. "태스크 추가" 버튼으로 새 태스크 생성

## 문제 해결

### 백엔드 연결 안 됨

```bash
# 백엔드 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f app

# 재시작
docker-compose restart
```

### 프론트엔드 오류

```bash
# 의존성 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install

# 개발 서버 재시작
npm run dev
```

### 포트 충돌

다른 애플리케이션이 포트를 사용 중인 경우:

**백엔드 (8080)**
```yaml
# docker-compose.yml에서 포트 변경
ports:
  - "8081:8080"  # 8081로 변경
```

**프론트엔드 (3000)**
```typescript
// vite.config.ts에서 포트 변경
server: {
  port: 3001  // 3001로 변경
}
```

## 도움말

상세한 문서:
- [백엔드 README](README.md)
- [프론트엔드 README](frontend/README.md)

문제 발생 시:
- Email: yangzepa@sch.ac.kr
- Website: http://yangzepa.com
