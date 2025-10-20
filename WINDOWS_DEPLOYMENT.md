# Windows 환경 배포 가이드

Lab Management System을 Windows 환경에서 배포하기 위한 가이드입니다.

## 배포 패키지 정보

**최신 패키지**: `labwebpage_deploy_20251014_130943.tar.gz` (67MB)

**포함된 내용**:
- ✅ 모든 소스 코드 (백엔드 + 프론트엔드)
- ✅ Docker 구성 파일 (개발/프로덕션)
- ✅ HTTPS 설정 파일 (Nginx, SSL)
- ✅ 데이터베이스 백업 파일
- ✅ 배포 가이드 문서

---

## Windows 로컬 개발 환경 (현재 작업 중)

### 문제: 백업 파일 오류 해결

**증상**:
```
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax
```

**원인**: 백업 파일에 경고 메시지가 포함됨

**해결 방법 1 - 새로운 깨끗한 백업 생성**:

```cmd
REM Windows에서 새 백업 생성
cd C:\Users\yangzepa\Documents\labwebpage
backup_db.bat

REM 생성된 파일 확인
dir backups\

REM 새 백업으로 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups\lab_management_[새타임스탬프].sql
```

**해결 방법 2 - 기존 백업 파일 수정**:

PowerShell에서:
```powershell
# 첫 줄(경고 메시지) 제거
Get-Content backups\lab_management_20251013_125245.sql | Select-Object -Skip 1 | Set-Content backups\lab_management_20251013_125245_fixed.sql

# 수정된 파일로 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups\lab_management_20251013_125245_fixed.sql
```

### 복원 확인

```cmd
REM 테이블 확인
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SHOW TABLES;"

REM 데이터 확인
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SELECT COUNT(*) FROM user;"
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SELECT COUNT(*) FROM researcher;"
```

---

## 프로덕션 서버 배포 (HTTPS)

### 1. 서버 환경 준비

**필수 조건**:
- Ubuntu 20.04+ 또는 Windows Server with Docker
- Docker 및 Docker Compose 설치
- 도메인: ec.sch.ac.kr → 서버 IP
- 방화벽: 포트 80, 443 개방

### 2. 파일 전송

#### Windows → Linux 서버

```powershell
# PowerShell에서
scp C:\Users\yangzepa\Documents\labwebpage_deploy_20251014_130943.tar.gz user@server:/home/user/
```

#### Windows → Windows 서버

- WinSCP 사용
- 원격 데스크톱으로 직접 복사
- 공유 폴더 사용

### 3. 서버에서 압축 해제

```bash
# Linux 서버
cd /home/user
tar -xzf labwebpage_deploy_20251014_130943.tar.gz
cd labwebpage
```

```powershell
# Windows 서버 (7-Zip 필요)
cd C:\deploy
7z x labwebpage_deploy_20251014_130943.tar.gz
7z x labwebpage_deploy_20251014_130943.tar
cd labwebpage
```

### 4. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
nano .env  # 또는 vim, vi
```

**.env 파일 내용**:
```bash
MYSQL_ROOT_PASSWORD=강력한_비밀번호_32자_이상
JWT_SECRET=랜덤_문자열_32자_이상
JWT_EXPIRATION=86400000
DOMAIN=ec.sch.ac.kr
SPRING_PROFILES_ACTIVE=prod
```

**비밀번호 생성** (Linux/Mac):
```bash
# MySQL 비밀번호
openssl rand -base64 24

# JWT Secret
openssl rand -base64 32
```

**비밀번호 생성** (Windows PowerShell):
```powershell
# 랜덤 문자열 생성
-join ((65..90) + (97..122) + (48..57) + (33,35,36,37,38,42,43,45,61,63,64) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 5. HTTPS 배포

**상세 가이드 참고**:
- **HTTPS_DEPLOYMENT_README.md** - 8단계 빠른 가이드
- **SSL_SETUP_GUIDE.md** - SSL 인증서 설정
- **DEPLOYMENT_GUIDE.md** - 전체 배포 가이드

**요약**:

```bash
# 1. 임시 인증서 생성
mkdir -p certbot/conf/live/ec.sch.ac.kr certbot/www
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout certbot/conf/live/ec.sch.ac.kr/privkey.pem \
  -out certbot/conf/live/ec.sch.ac.kr/fullchain.pem \
  -subj "/CN=ec.sch.ac.kr"

# 2. 임시 설정으로 시작
cp nginx/nginx.conf nginx/nginx.conf.https
cp nginx/nginx.conf.initial nginx/nginx.conf
docker-compose -f docker-compose.prod.yml up -d mysql app frontend nginx

# 3. Let's Encrypt 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr --agree-tos --no-eff-email \
  -d ec.sch.ac.kr

# 4. HTTPS 설정 적용
cp nginx/nginx.conf.https nginx/nginx.conf
docker-compose -f docker-compose.prod.yml restart nginx
docker-compose -f docker-compose.prod.yml up -d certbot

# 5. DB 복원
docker exec -i lab-mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) lab_management < backups/lab_management_[최신].sql

# 6. 접속 확인
curl -I https://ec.sch.ac.kr
```

---

## Windows 개발 환경 유용한 명령어

### Docker 관리

```cmd
REM 컨테이너 상태 확인
docker-compose ps

REM 로그 확인
docker-compose logs -f

REM 특정 서비스 로그
docker-compose logs -f app

REM 컨테이너 재시작
docker-compose restart

REM 컨테이너 중지 및 삭제
docker-compose down

REM 완전 재빌드
docker-compose down
docker-compose up -d --build
```

### 데이터베이스 관리

```cmd
REM DB 백업
backup_db.bat

REM DB 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups\lab_management_[타임스탬프].sql

REM MySQL 접속
docker exec -it lab-mysql mysql -u root -proot lab_management

REM 테이블 목록
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SHOW TABLES;"
```

### 애플리케이션 확인

```cmd
REM 백엔드 API 테스트
curl http://localhost:8080/api/public/researchers

REM 프론트엔드 접속
start http://localhost:3000
```

---

## 문제 해결

### 포트 충돌

```cmd
REM 포트 사용 확인
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306

REM 프로세스 종료
taskkill /PID [PID번호] /F
```

### Docker 데이터 초기화

```cmd
REM 주의: 모든 데이터가 삭제됩니다!
docker-compose down -v
docker-compose up -d
```

### 로그 파일 위치

```cmd
REM Docker 로그
docker-compose logs > logs.txt

REM Nginx 로그 (프로덕션)
docker-compose -f docker-compose.prod.yml exec nginx cat /var/log/nginx/lab_access.log
docker-compose -f docker-compose.prod.yml exec nginx cat /var/log/nginx/lab_error.log
```

---

## 체크리스트

### Windows 로컬 개발
- [ ] Docker Desktop 실행 중
- [ ] docker-compose.yml 설정 확인
- [ ] 컨테이너 시작 (mysql, app)
- [ ] 깨끗한 DB 백업 생성
- [ ] DB 복원 성공
- [ ] http://localhost:8080/api/public/researchers 접속 확인
- [ ] http://localhost:3000 접속 확인

### 프로덕션 서버 배포
- [ ] DNS 레코드 설정 (ec.sch.ac.kr → 서버 IP)
- [ ] 방화벽 포트 개방 (80, 443)
- [ ] .env 파일 생성 및 설정
- [ ] docker-compose.prod.yml 확인
- [ ] SSL 인증서 발급 완료
- [ ] https://ec.sch.ac.kr 접속 확인
- [ ] HTTP → HTTPS 리다이렉트 확인
- [ ] DB 복원 완료
- [ ] 로그인 테스트
- [ ] 주요 기능 테스트

---

## 추가 리소스

### Windows용 도구

- **Docker Desktop**: https://www.docker.com/products/docker-desktop/
- **Git for Windows**: https://git-scm.com/download/win
- **7-Zip**: https://www.7-zip.org/
- **WinSCP**: https://winscp.net/
- **PuTTY**: https://www.putty.org/

### 문서

- **HTTPS_DEPLOYMENT_README.md** - HTTPS 배포 빠른 시작
- **SSL_SETUP_GUIDE.md** - SSL 인증서 상세 가이드
- **DEPLOYMENT_GUIDE.md** - 전체 배포 가이드
- **BACKUP_GUIDE.md** - 백업/복원 가이드

---

## 지원

문제 발생 시:
1. 로그 확인: `docker-compose logs -f`
2. 컨테이너 상태: `docker-compose ps`
3. 문제 해결 섹션 참고
4. 상세 가이드 문서 확인
