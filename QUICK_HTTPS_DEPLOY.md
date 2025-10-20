# HTTPS 빠른 배포 가이드 (자체 서명 인증서)

DNS 설정 없이 즉시 HTTPS로 배포하는 방법입니다.

⚠️ **자체 서명 인증서 사용**: 브라우저에서 "안전하지 않음" 경고가 표시됩니다.

---

## Linux/Mac 서버 배포

### 1단계: 파일 업로드

```bash
# 서버로 파일 전송
scp labwebpage_deploy_final_*.tar.gz user@server:/home/user/

# 서버 접속 및 압축 해제
ssh user@server
cd /home/user
tar -xzf labwebpage_deploy_final_*.tar.gz
cd labwebpage
```

### 2단계: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
nano .env  # 또는 vi, vim
```

**.env 파일 내용**:
```bash
MYSQL_ROOT_PASSWORD=강력한_비밀번호_32자_이상
JWT_SECRET=랜덤_문자열_32자_이상
JWT_EXPIRATION=86400000
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

### 3단계: 자체 서명 인증서 생성

```bash
# 실행 권한 부여
chmod +x setup_self_signed_ssl.sh

# 인증서 생성
./setup_self_signed_ssl.sh
```

### 4단계: Docker 컨테이너 시작

```bash
# 모든 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 5단계: 데이터베이스 복원

```bash
# MySQL이 준비될 때까지 대기 (약 30초)
sleep 30

# DB 백업 복원
docker exec -i lab-mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) lab_management < backups/lab_management_20251014_final.sql

# 복원 확인
docker exec lab-mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) -e "USE lab_management; SHOW TABLES;"
```

### 6단계: 접속 확인

```bash
# 서비스 상태 확인
docker-compose -f docker-compose.prod.yml ps

# HTTPS 접속 테스트 (자체 서명 인증서이므로 -k 옵션 필요)
curl -k -I https://localhost

# 또는 서버 IP로
curl -k -I https://your-server-ip
```

**브라우저 접속**:
- https://your-server-ip
- 또는 https://ec.sch.ac.kr (hosts 파일 수정 시)

---

## Windows 서버 배포

### 1단계: 파일 압축 해제

7-Zip으로 `labwebpage_deploy_final_*.tar.gz` 압축 해제

### 2단계: 환경 변수 설정

`.env` 파일 생성:
```
MYSQL_ROOT_PASSWORD=강력한_비밀번호
JWT_SECRET=랜덤_문자열_32자_이상
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=prod
```

### 3단계: 자체 서명 인증서 생성

```cmd
cd C:\path\to\labwebpage

REM 인증서 생성
setup_self_signed_ssl.bat
```

### 4단계: Docker 컨테이너 시작

```cmd
REM 모든 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

REM 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 5단계: 데이터베이스 복원

```cmd
REM 30초 대기
timeout /t 30

REM DB 복원 (컨테이너 내부에서)
docker cp backups\lab_management_20251014_final.sql lab-mysql:/tmp/backup.sql
docker exec lab-mysql sh -c "mysql -u root -pYOUR_PASSWORD lab_management < /tmp/backup.sql"

REM 복원 확인
docker exec lab-mysql mysql -u root -pYOUR_PASSWORD -e "USE lab_management; SHOW TABLES;"
```

### 6단계: 접속 확인

**브라우저 접속**:
- https://localhost
- 또는 https://서버IP

---

## 브라우저 경고 우회 방법

### Chrome/Edge
1. "연결이 비공개로 설정되어 있지 않습니다" 페이지 표시
2. **"고급"** 클릭
3. **"안전하지 않음(진행)"** 또는 **"계속 진행"** 클릭

### Firefox
1. "경고: 잠재적인 보안 위험이 있습니다" 페이지 표시
2. **"고급..."** 클릭
3. **"위험을 감수하고 계속"** 클릭

### Safari
1. "이 연결은 비공개 연결이 아닙니다" 페이지 표시
2. **"자세히 보기"** 클릭
3. **"웹 사이트 방문"** 클릭

---

## 테스트 계정

**Admin 계정**:
- ID: admin
- Password: admin123!

---

## 문제 해결

### 포트 개방 확인

```bash
# 포트 80, 443 개방 (Ubuntu/Debian)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 포트 80, 443 개방 (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 컨테이너 로그 확인

```bash
# 전체 로그
docker-compose -f docker-compose.prod.yml logs

# 특정 서비스
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs mysql
```

### 컨테이너 재시작

```bash
# 전체 재시작
docker-compose -f docker-compose.prod.yml restart

# 특정 서비스 재시작
docker-compose -f docker-compose.prod.yml restart nginx
```

### 완전 재빌드

```bash
# 컨테이너 중지 및 삭제
docker-compose -f docker-compose.prod.yml down

# 재빌드 및 시작
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 나중에 Let's Encrypt로 전환

DNS 설정이 완료되면 Let's Encrypt로 전환할 수 있습니다:

```bash
# 1. 기존 자체 서명 인증서 백업
mv certbot/conf/live/ec.sch.ac.kr certbot/conf/live/ec.sch.ac.kr.backup

# 2. Let's Encrypt 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr --agree-tos --no-eff-email \
  -d ec.sch.ac.kr

# 3. Nginx 재시작
docker-compose -f docker-compose.prod.yml restart nginx

# 4. Certbot 자동 갱신 활성화
docker-compose -f docker-compose.prod.yml up -d certbot
```

---

## 체크리스트

배포 전:
- [ ] .env 파일 생성 및 설정
- [ ] 강력한 비밀번호 사용
- [ ] 방화벽 포트 개방 (80, 443)

배포 중:
- [ ] 자체 서명 인증서 생성 완료
- [ ] Docker 컨테이너 시작 완료
- [ ] DB 백업 복원 완료
- [ ] 서비스 상태 확인 (모두 Up)

배포 후:
- [ ] https://서버IP 접속 확인
- [ ] 브라우저 경고 우회
- [ ] 로그인 테스트 (admin / admin123!)
- [ ] 주요 기능 테스트
- [ ] 로그 모니터링 설정

---

**배포 완료 후 브라우저 경고는 감수하고 사용하시면 됩니다!** 🚀

DNS 설정 후 Let's Encrypt로 전환하면 경고 없이 사용 가능합니다.
