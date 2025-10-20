# Lab Management System - 배포 가이드

## 배포에 필요한 파일 목록

### 1. 필수 파일 및 폴더

```
labwebpage/
├── src/                          # 백엔드 소스 코드 (전체)
├── frontend/                     # 프론트엔드 소스 코드 (전체)
├── docker-compose.yml            # Docker 구성 파일
├── Dockerfile                    # 백엔드 Docker 이미지
├── pom.xml                       # Maven 설정
├── backups/                      # DB 백업 파일들
│   └── lab_management_*.sql     # 최신 백업 파일
├── backup_db.sh                  # DB 백업 스크립트
├── README.md                     # 프로젝트 문서
└── BACKUP_GUIDE.md              # 백업 가이드
```

### 2. 제외해도 되는 파일/폴더

```
target/                  # Maven 빌드 결과물 (자동 생성됨)
frontend/node_modules/   # npm 패키지 (자동 설치됨)
frontend/dist/          # 빌드 결과물 (자동 생성됨)
.git/                   # Git 저장소 (선택)
*.log                   # 로그 파일
```

---

## 배포 방법

### 방법 1: 전체 프로젝트 압축 (권장)

```bash
# 프로젝트 폴더로 이동
cd /Users/yangzepa/Documents

# 불필요한 파일 제외하고 압축
tar -czf labwebpage_deploy.tar.gz \
  --exclude='labwebpage/target' \
  --exclude='labwebpage/frontend/node_modules' \
  --exclude='labwebpage/frontend/dist' \
  --exclude='labwebpage/.git' \
  --exclude='labwebpage/*.log' \
  --exclude='labwebpage/backup' \
  --exclude='labwebpage/ExportBlock-*' \
  labwebpage/

# 압축 파일 크기 확인
ls -lh labwebpage_deploy.tar.gz
```

### 방법 2: Git 저장소 사용

```bash
# Git 저장소가 있다면
cd /Users/yangzepa/Documents/labwebpage

# .gitignore 확인
cat .gitignore

# 원격 저장소에 푸시
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 서버에서 배포하기

### 1. 파일 전송

#### 압축 파일 방식
```bash
# 서버로 파일 전송 (scp 사용)
scp labwebpage_deploy.tar.gz user@server:/home/user/

# 서버에서 압축 해제
ssh user@server
cd /home/user
tar -xzf labwebpage_deploy.tar.gz
cd labwebpage
```

#### Git 방식
```bash
# 서버에서 클론
ssh user@server
cd /home/user
git clone https://github.com/your-repo/labwebpage.git
cd labwebpage
```

### 2. 데이터베이스 복원

```bash
# Docker 컨테이너 시작 (MySQL만 먼저)
docker-compose up -d mysql

# MySQL 준비될 때까지 대기 (약 30초)
sleep 30

# DB 백업 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups/lab_management_20251013_125245.sql

# 복원 확인
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SHOW TABLES;"
```

### 3. 애플리케이션 시작

```bash
# 전체 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 컨테이너 상태 확인
docker-compose ps
```

### 4. 접속 확인

```bash
# 백엔드 API 테스트
curl http://localhost:8080/api/public/researchers

# 프론트엔드는 브라우저에서
# http://localhost:3000
```

---

## HTTPS 프로덕션 배포

프로덕션 환경에서는 `docker-compose.prod.yml`을 사용하여 HTTPS를 설정합니다.

### 사전 요구사항

1. **도메인 DNS 설정**: `ec.sch.ac.kr`이 서버 IP를 가리켜야 함
2. **포트 개방**: 80, 443 포트가 외부에서 접근 가능해야 함
3. **SSL 인증서**: Let's Encrypt를 통해 무료 인증서 발급

### 배포 방법

#### 1. 환경 변수 설정

`.env` 파일 생성 (프로젝트 루트):

```bash
# .env
MYSQL_ROOT_PASSWORD=your_secure_password_here_change_this
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long_change_this
DOMAIN=ec.sch.ac.kr
```

**중요**: `.env` 파일은 Git에 커밋하지 마세요!

#### 2. SSL 인증서 설정

상세한 SSL 설정 방법은 **[SSL_SETUP_GUIDE.md](SSL_SETUP_GUIDE.md)**를 참고하세요.

**간단 요약**:

```bash
# 1. 임시 설정으로 컨테이너 시작
cp nginx/nginx.conf.initial nginx/nginx.conf
docker-compose -f docker-compose.prod.yml up -d mysql app frontend nginx

# 2. Let's Encrypt 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr \
  --agree-tos \
  --no-eff-email \
  -d ec.sch.ac.kr

# 3. HTTPS 설정으로 전환
cp nginx/nginx.conf.https nginx/nginx.conf
docker-compose -f docker-compose.prod.yml restart nginx
docker-compose -f docker-compose.prod.yml up -d certbot
```

#### 3. 프로덕션 서비스 시작

```bash
# 전체 서비스 시작 (프로덕션 구성)
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 서비스 상태 확인
docker-compose -f docker-compose.prod.yml ps
```

#### 4. HTTPS 접속 확인

```bash
# HTTPS 접속 테스트
curl -I https://ec.sch.ac.kr

# HTTP -> HTTPS 리다이렉트 확인
curl -I http://ec.sch.ac.kr

# 브라우저에서 접속
# https://ec.sch.ac.kr
```

### 인증서 자동 갱신

Let's Encrypt 인증서는 90일마다 만료됩니다.
`docker-compose.prod.yml`의 Certbot 컨테이너가 12시간마다 자동으로 갱신을 시도합니다.

```bash
# 수동 갱신 (필요시)
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# 갱신 상태 확인
docker-compose -f docker-compose.prod.yml run --rm certbot certificates
```

### 프로덕션 vs 개발 환경 차이

| 항목 | 개발 (docker-compose.yml) | 프로덕션 (docker-compose.prod.yml) |
|------|---------------------------|-------------------------------------|
| 프론트엔드 | Vite dev server (HMR) | Nginx (정적 빌드) |
| HTTPS | ❌ | ✅ |
| 포트 노출 | 8080, 3000, 3306 | 80, 443 |
| Nginx 프록시 | ❌ | ✅ |
| SSL 인증서 | ❌ | ✅ (Let's Encrypt) |
| 환경 변수 | 하드코딩 | .env 파일 |

---

## 프로덕션 배포 시 주의사항

### 1. 환경 변수 설정

`docker-compose.yml` 수정:
```yaml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}  # 강력한 비밀번호 사용
      MYSQL_DATABASE: lab_management

  app:
    environment:
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # JWT_SECRET, ADMIN_PASSWORD 등 환경변수로 관리
```

`.env` 파일 생성:
```bash
# .env (Git에 커밋하지 말 것!)
MYSQL_ROOT_PASSWORD=your_strong_password_here
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here
```

### 2. 포트 변경 (필요시)

`docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "8080:8080"  # 8080을 다른 포트로 변경 가능
```

### 3. 프록시 설정 (Nginx 권장)

```nginx
# /etc/nginx/sites-available/lab-management
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. SSL 인증서 (HTTPS)

프로덕션 환경에서 HTTPS를 설정하려면 위의 **[HTTPS 프로덕션 배포](#https-프로덕션-배포)** 섹션과 **[SSL_SETUP_GUIDE.md](SSL_SETUP_GUIDE.md)**를 참고하세요.

`docker-compose.prod.yml`을 사용하면 Nginx와 Certbot이 자동으로 구성됩니다.

### 5. 방화벽 설정

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable

# 포트 확인
sudo ufw status
```

---

## 자동 백업 설정 (프로덕션 필수)

### Cron 설정
```bash
# 서버에서 crontab 편집
crontab -e

# 매일 새벽 3시 백업
0 3 * * * cd /home/user/labwebpage && ./backup_db.sh >> backups/backup.log 2>&1
```

### 원격 백업 (AWS S3 예시)
```bash
# AWS CLI 설치
sudo apt install awscli

# S3 버킷 생성
aws s3 mb s3://lab-management-backups

# 백업 스크립트에 추가
aws s3 cp backups/lab_management_$(date +%Y%m%d).sql s3://lab-management-backups/
```

---

## 업데이트 방법

### 1. 새 버전 배포

```bash
# 서버에서
cd /home/user/labwebpage

# Git 사용 시
git pull origin main

# 압축 파일 사용 시
scp labwebpage_deploy.tar.gz user@server:/home/user/
tar -xzf labwebpage_deploy.tar.gz

# 컨테이너 재시작
docker-compose down
docker-compose up -d --build
```

### 2. DB 마이그레이션

```bash
# DB 변경사항이 있다면
docker exec -i lab-mysql mysql -u root -proot lab_management < migration.sql
```

---

## 트러블슈팅

### Docker 이미지 빌드 실패
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
```

### MySQL 연결 실패
```bash
# MySQL 로그 확인
docker-compose logs mysql

# 컨테이너 재시작
docker-compose restart mysql
```

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
sudo lsof -i :8080
sudo lsof -i :3306

# 프로세스 종료
sudo kill -9 <PID>
```

### 디스크 용량 부족
```bash
# Docker 정리
docker system prune -a

# 오래된 백업 삭제
find backups/ -name "*.sql" -mtime +30 -delete
```

---

## 롤백 방법

### 1. 애플리케이션 롤백
```bash
# 이전 버전으로 Git 되돌리기
git checkout <previous-commit-hash>
docker-compose up -d --build
```

### 2. 데이터베이스 롤백
```bash
# 백업 목록 확인
ls -lh backups/

# 이전 백업으로 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups/lab_management_20251012_030000.sql
```

---

## 모니터링

### 로그 확인
```bash
# 실시간 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f app
docker-compose logs -f mysql
```

### 헬스 체크
```bash
# 컨테이너 상태
docker-compose ps

# API 헬스 체크
curl http://localhost:8080/actuator/health
```

### 리소스 사용량
```bash
# Docker 리소스 사용량
docker stats

# 디스크 사용량
df -h
du -sh backups/
```

---

## 체크리스트

### 개발 환경 배포
- [ ] 최신 DB 백업 생성
- [ ] docker-compose.yml 설정 확인
- [ ] 컨테이너 시작 (mysql, app, frontend)
- [ ] DB 복원 확인
- [ ] API 접속 테스트 (http://localhost:8080)
- [ ] 프론트엔드 접속 테스트 (http://localhost:3000)
- [ ] 로그인 테스트

### 프로덕션 환경 배포 (HTTPS)
배포 전:
- [ ] 최신 DB 백업 생성
- [ ] .env 파일 생성 및 보안 설정
- [ ] DNS 레코드 설정 (ec.sch.ac.kr → 서버 IP)
- [ ] 방화벽 포트 개방 (80, 443)
- [ ] docker-compose.prod.yml 설정 확인

배포 후:
- [ ] DB 복원 확인
- [ ] SSL 인증서 발급 (Let's Encrypt)
- [ ] HTTPS 접속 테스트 (https://ec.sch.ac.kr)
- [ ] HTTP → HTTPS 리다이렉트 확인
- [ ] API 접속 테스트
- [ ] 프론트엔드 접속 테스트
- [ ] 로그인 테스트
- [ ] 인증서 자동 갱신 확인
- [ ] 자동 백업 스케줄 설정 (cron/launchd)
- [ ] 모니터링 설정
- [ ] SSL Labs 테스트 (A 등급 이상)

---

## 참고 자료

- Docker 공식 문서: https://docs.docker.com/
- Spring Boot 배포: https://spring.io/guides/gs/spring-boot-docker/
- Nginx 설정: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
