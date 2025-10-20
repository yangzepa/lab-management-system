# HTTPS 배포 빠른 시작 가이드

Lab Management System을 HTTPS 환경에서 배포하기 위한 빠른 시작 가이드입니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [빠른 배포](#빠른-배포)
3. [상세 가이드](#상세-가이드)
4. [문제 해결](#문제-해결)

---

## 사전 준비

### 필수 조건

- ✅ 서버 준비 (Ubuntu 20.04+ 또는 CentOS 8+ 권장)
- ✅ Docker 및 Docker Compose 설치
- ✅ 도메인: `ec.sch.ac.kr`
- ✅ DNS 설정: 도메인이 서버 공인 IP를 가리켜야 함
- ✅ 방화벽: 포트 80, 443 개방

### DNS 확인

```bash
# 도메인이 서버 IP를 올바르게 가리키는지 확인
nslookup ec.sch.ac.kr

# 또는
dig ec.sch.ac.kr
```

---

## 빠른 배포

### 1단계: 파일 업로드

```bash
# 로컬에서 서버로 파일 전송
scp labwebpage_deploy_*.tar.gz user@server:/home/user/

# 서버 접속
ssh user@server

# 압축 해제
cd /home/user
tar -xzf labwebpage_deploy_*.tar.gz
cd labwebpage
```

### 2단계: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집 (실제 값으로 변경)
nano .env
```

**.env 파일 내용**:
```bash
MYSQL_ROOT_PASSWORD=강력한_비밀번호_입력
JWT_SECRET=최소_32자_이상의_랜덤_문자열
JWT_EXPIRATION=86400000
DOMAIN=ec.sch.ac.kr
SPRING_PROFILES_ACTIVE=prod
```

**비밀번호 생성**:
```bash
# MySQL 비밀번호 (24자)
openssl rand -base64 24

# JWT Secret (32자)
openssl rand -base64 32
```

**권한 설정**:
```bash
chmod 600 .env
```

### 3단계: 임시 인증서 생성

```bash
# 디렉토리 생성
mkdir -p certbot/conf/live/ec.sch.ac.kr
mkdir -p certbot/www

# 임시 자체 서명 인증서 생성 (1일 유효)
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 1 \
  -keyout certbot/conf/live/ec.sch.ac.kr/privkey.pem \
  -out certbot/conf/live/ec.sch.ac.kr/fullchain.pem \
  -subj "/CN=ec.sch.ac.kr"
```

### 4단계: 초기 컨테이너 시작

```bash
# nginx.conf 백업
cp nginx/nginx.conf nginx/nginx.conf.https

# 임시 설정으로 변경
cp nginx/nginx.conf.initial nginx/nginx.conf

# 컨테이너 시작 (certbot 제외)
docker-compose -f docker-compose.prod.yml up -d mysql app frontend nginx

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

**확인사항**:
- MySQL: 정상 시작 및 health check 통과
- App: Spring Boot 애플리케이션 시작 완료
- Frontend: Nginx에서 정적 파일 서빙
- Nginx: HTTP(80) 포트로 접속 가능

### 5단계: Let's Encrypt 인증서 발급

```bash
# 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr \
  --agree-tos \
  --no-eff-email \
  -d ec.sch.ac.kr

# 성공 메시지 확인
# Successfully received certificate.
# Certificate is saved at: /etc/letsencrypt/live/ec.sch.ac.kr/fullchain.pem
```

### 6단계: HTTPS 설정 적용

```bash
# HTTPS 설정 복원
cp nginx/nginx.conf.https nginx/nginx.conf

# Nginx 재시작
docker-compose -f docker-compose.prod.yml restart nginx

# Certbot 자동 갱신 서비스 시작
docker-compose -f docker-compose.prod.yml up -d certbot
```

### 7단계: 데이터베이스 복원

```bash
# 최신 백업 파일 확인
ls -lh backups/

# DB 복원
docker exec -i lab-mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) lab_management < backups/lab_management_*.sql

# 복원 확인
docker exec lab-mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) -e "USE lab_management; SHOW TABLES;"
```

### 8단계: 배포 확인

```bash
# 전체 서비스 상태 확인
docker-compose -f docker-compose.prod.yml ps

# HTTPS 접속 테스트
curl -I https://ec.sch.ac.kr

# HTTP -> HTTPS 리다이렉트 확인
curl -I http://ec.sch.ac.kr
```

**브라우저 확인**:
- https://ec.sch.ac.kr 접속
- 로그인 테스트 (admin / admin123!)
- 주요 기능 테스트

---

## 상세 가이드

더 자세한 설정 방법과 옵션은 다음 문서를 참고하세요:

- **[SSL_SETUP_GUIDE.md](SSL_SETUP_GUIDE.md)**: SSL 인증서 설정 상세 가이드
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: 전체 배포 가이드
- **[BACKUP_GUIDE.md](BACKUP_GUIDE.md)**: 데이터베이스 백업/복원 가이드

---

## 문제 해결

### DNS 설정 문제

**증상**: 인증서 발급 실패 (`Failed authorization procedure`)

**해결**:
```bash
# DNS 전파 확인
nslookup ec.sch.ac.kr
dig ec.sch.ac.kr

# DNS 캐시 초기화 (Mac)
sudo dscacheutil -flushcache

# DNS 캐시 초기화 (Linux)
sudo systemd-resolve --flush-caches
```

### 포트 접근 문제

**증상**: 외부에서 서버 접속 불가

**해결**:
```bash
# 포트 개방 상태 확인
sudo ufw status

# 포트 개방 (Ubuntu/Debian)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 포트 개방 (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 포트 리스닝 확인
sudo netstat -tlnp | grep -E ':(80|443)'
```

### Nginx 시작 실패

**증상**: `cannot load certificate` 오류

**해결**:
```bash
# 인증서 파일 존재 확인
ls -la certbot/conf/live/ec.sch.ac.kr/

# 임시 인증서 재생성
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 1 \
  -keyout certbot/conf/live/ec.sch.ac.kr/privkey.pem \
  -out certbot/conf/live/ec.sch.ac.kr/fullchain.pem \
  -subj "/CN=ec.sch.ac.kr"

# Nginx 설정 테스트
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Nginx 재시작
docker-compose -f docker-compose.prod.yml restart nginx
```

### Docker 컨테이너 문제

**증상**: 컨테이너 시작 실패 또는 비정상 종료

**해결**:
```bash
# 전체 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 특정 서비스 로그
docker-compose -f docker-compose.prod.yml logs mysql
docker-compose -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs nginx

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart

# 완전히 재빌드
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### 인증서 갱신 문제

**증상**: 인증서 갱신 실패

**해결**:
```bash
# 인증서 상태 확인
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# 갱신 테스트 (실제 갱신 안 함)
docker-compose -f docker-compose.prod.yml run --rm certbot renew --dry-run

# 수동 갱신
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 유지보수

### 인증서 자동 갱신

Let's Encrypt 인증서는 90일마다 만료됩니다.
`docker-compose.prod.yml`의 Certbot 컨테이너가 **12시간마다** 자동으로 갱신을 시도합니다.

### 데이터베이스 백업

```bash
# 수동 백업
./backup_db.sh

# 자동 백업 설정 (cron)
crontab -e
# 추가: 0 3 * * * cd /home/user/labwebpage && ./backup_db.sh
```

### 모니터링

```bash
# 실시간 로그
docker-compose -f docker-compose.prod.yml logs -f

# 리소스 사용량
docker stats

# 디스크 사용량
df -h
du -sh certbot/ backups/
```

---

## 체크리스트

### 배포 전
- [ ] 서버 준비 완료
- [ ] Docker 및 Docker Compose 설치
- [ ] DNS 레코드 설정 완료 (ec.sch.ac.kr → 서버 IP)
- [ ] 방화벽 포트 개방 (80, 443)
- [ ] .env 파일 생성 및 설정

### 배포 중
- [ ] 파일 업로드 완료
- [ ] 임시 인증서 생성
- [ ] 컨테이너 시작 (mysql, app, frontend, nginx)
- [ ] Let's Encrypt 인증서 발급 성공
- [ ] HTTPS 설정 적용
- [ ] Certbot 자동 갱신 서비스 시작
- [ ] DB 복원 완료

### 배포 후
- [ ] HTTPS 접속 확인 (https://ec.sch.ac.kr)
- [ ] HTTP → HTTPS 리다이렉트 확인
- [ ] 로그인 테스트
- [ ] 주요 기능 테스트
- [ ] 인증서 자동 갱신 확인
- [ ] 데이터베이스 자동 백업 설정
- [ ] 모니터링 설정
- [ ] SSL Labs 테스트 (https://www.ssllabs.com/ssltest/)

---

## 보안 권장사항

1. **환경 변수 보안**
   - .env 파일 권한: `chmod 600 .env`
   - 강력한 비밀번호 사용 (최소 16자, 대소문자/숫자/특수문자 혼합)
   - 정기적인 비밀번호 변경

2. **SSH 보안**
   - SSH 키 기반 인증 사용
   - 루트 로그인 비활성화
   - SSH 포트 변경 고려

3. **방화벽 설정**
   - 필요한 포트만 개방 (80, 443, 22)
   - fail2ban 설치 및 설정

4. **업데이트 관리**
   - 정기적인 시스템 업데이트
   - Docker 이미지 업데이트
   - 의존성 패키지 업데이트

5. **백업 전략**
   - 일일 자동 백업 설정
   - 원격 백업 저장소 사용 (S3, NAS 등)
   - 백업 복원 테스트

---

## 추가 리소스

- Let's Encrypt 공식 문서: https://letsencrypt.org/docs/
- Nginx 공식 문서: https://nginx.org/en/docs/
- Docker 공식 문서: https://docs.docker.com/
- Spring Boot 배포 가이드: https://spring.io/guides/gs/spring-boot-docker/

---

## 지원

문제가 발생하면 다음을 확인하세요:

1. 로그 확인: `docker-compose -f docker-compose.prod.yml logs -f`
2. 상세 가이드 참고: [SSL_SETUP_GUIDE.md](SSL_SETUP_GUIDE.md)
3. 문제 해결 섹션 참고
4. GitHub Issues (있는 경우)

---

**배포 성공을 기원합니다! 🚀**
