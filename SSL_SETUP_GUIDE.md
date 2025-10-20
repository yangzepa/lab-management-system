# SSL/HTTPS 설정 가이드

## 개요

이 가이드는 Lab Management System을 HTTPS 환경에서 실행하기 위한 SSL 인증서 설정 방법을 설명합니다.

**도메인**: ec.sch.ac.kr

## 사전 요구사항

### 1. DNS 설정
도메인이 서버의 공인 IP 주소를 가리켜야 합니다.

```bash
# DNS 레코드 확인
nslookup ec.sch.ac.kr

# 또는
dig ec.sch.ac.kr
```

**필수 DNS 레코드**:
- A 레코드: `ec.sch.ac.kr` → 서버 공인 IP 주소
- (선택) AAAA 레코드: IPv6 지원 시

### 2. 방화벽 설정
서버에서 다음 포트가 열려 있어야 합니다:
- 포트 80 (HTTP): Let's Encrypt 인증서 발급 및 자동 리다이렉트
- 포트 443 (HTTPS): 보안 연결

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 초기 배포 및 인증서 발급

### 1단계: 프로젝트 배포

```bash
# 서버에 파일 업로드
scp labwebpage_deploy_*.tar.gz user@server:/home/user/

# 서버 접속 및 압축 해제
ssh user@server
tar -xzf labwebpage_deploy_*.tar.gz
cd labwebpage
```

### 2단계: 환경 변수 설정

`.env` 파일 생성:

```bash
# .env 파일 생성
cat > .env << 'EOF'
# MySQL 설정
MYSQL_ROOT_PASSWORD=your_secure_password_here_change_this

# JWT 설정
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long_change_this

# 도메인 설정
DOMAIN=ec.sch.ac.kr
EOF

# 권한 설정 (중요!)
chmod 600 .env
```

### 3단계: 임시 인증서로 첫 시작

Let's Encrypt 인증서를 받기 전에 임시 인증서를 생성하여 Nginx가 시작될 수 있도록 합니다.

```bash
# 인증서 디렉토리 생성
mkdir -p certbot/conf/live/ec.sch.ac.kr
mkdir -p certbot/www

# 임시 자체 서명 인증서 생성
sudo openssl req -x509 -nodes -newkey rsa:2048 \
  -days 1 \
  -keyout certbot/conf/live/ec.sch.ac.kr/privkey.pem \
  -out certbot/conf/live/ec.sch.ac.kr/fullchain.pem \
  -subj "/CN=ec.sch.ac.kr"
```

### 4단계: Nginx 설정 임시 수정

인증서를 받기 전에는 HTTP만 사용하도록 Nginx를 설정합니다.

`nginx/nginx.conf.initial` 생성:

```bash
cat > nginx/nginx.conf.initial << 'EOF'
server {
    listen 80;
    server_name ec.sch.ac.kr;

    # Let's Encrypt 인증서 갱신용
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 임시로 모든 요청 허용 (인증서 발급용)
    location / {
        proxy_pass http://frontend:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 백엔드 API
    location /api/ {
        proxy_pass http://app:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 업로드된 파일 서빙
    location /uploads/ {
        proxy_pass http://app:8080/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
```

### 5단계: 초기 컨테이너 시작

```bash
# 기존 nginx.conf 백업
cp nginx/nginx.conf nginx/nginx.conf.https

# 임시 설정으로 교체
cp nginx/nginx.conf.initial nginx/nginx.conf

# 컨테이너 시작 (certbot 제외)
docker-compose -f docker-compose.prod.yml up -d mysql app frontend nginx
```

### 6단계: Let's Encrypt 인증서 발급

```bash
# Certbot을 통한 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr \
  --agree-tos \
  --no-eff-email \
  -d ec.sch.ac.kr

# 발급 성공 메시지 확인
# Successfully received certificate.
# Certificate is saved at: /etc/letsencrypt/live/ec.sch.ac.kr/fullchain.pem
# Key is saved at: /etc/letsencrypt/live/ec.sch.ac.kr/privkey.pem
```

### 7단계: HTTPS 설정으로 전환

```bash
# HTTPS 설정 복원
cp nginx/nginx.conf.https nginx/nginx.conf

# Nginx 재시작
docker-compose -f docker-compose.prod.yml restart nginx

# Certbot 자동 갱신 서비스 시작
docker-compose -f docker-compose.prod.yml up -d certbot
```

### 8단계: 확인

```bash
# HTTPS 접속 테스트
curl -I https://ec.sch.ac.kr

# HTTP -> HTTPS 리다이렉트 확인
curl -I http://ec.sch.ac.kr

# SSL 인증서 정보 확인
openssl s_client -connect ec.sch.ac.kr:443 -servername ec.sch.ac.kr
```

## 인증서 자동 갱신

### 갱신 주기

Let's Encrypt 인증서는 **90일**마다 만료됩니다.

docker-compose.prod.yml에 설정된 Certbot 컨테이너가 **12시간마다** 자동으로 갱신을 시도합니다.

### 수동 갱신

필요시 수동으로 갱신할 수 있습니다:

```bash
# 인증서 갱신 시도
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Nginx 재로드 (새 인증서 적용)
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### 갱신 확인

```bash
# 인증서 만료일 확인
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# 갱신 테스트 (실제 갱신은 하지 않음)
docker-compose -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

## 문제 해결

### 인증서 발급 실패

**증상**: `Failed authorization procedure` 오류

**해결 방법**:
1. DNS 레코드가 올바르게 설정되었는지 확인
2. 포트 80이 외부에서 접근 가능한지 확인
3. 방화벽 설정 확인

```bash
# 포트 확인
sudo netstat -tlnp | grep :80

# 외부에서 접근 테스트
curl http://ec.sch.ac.kr/.well-known/acme-challenge/test
```

### Nginx 시작 실패

**증상**: `cannot load certificate` 오류

**해결 방법**:
- 인증서 파일 존재 확인
- 임시 설정 파일 사용

```bash
# 인증서 파일 확인
ls -la certbot/conf/live/ec.sch.ac.kr/

# 임시 설정으로 복원
cp nginx/nginx.conf.initial nginx/nginx.conf
docker-compose -f docker-compose.prod.yml restart nginx
```

### HTTPS 접속 안 됨

**증상**: `SSL_ERROR_BAD_CERT_DOMAIN` 또는 연결 타임아웃

**해결 방법**:

```bash
# Nginx 로그 확인
docker-compose -f docker-compose.prod.yml logs nginx

# 인증서 상태 확인
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# Nginx 설정 문법 확인
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Rate Limit 초과

**증상**: `too many certificates already issued` 오류

**해결 방법**:
- Let's Encrypt는 도메인당 주당 50개의 인증서 발급 제한이 있습니다
- 테스트 시에는 `--staging` 플래그를 사용하세요

```bash
# 스테이징 환경에서 테스트
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email yangzepa@sch.ac.kr \
  --agree-tos \
  --staging \
  -d ec.sch.ac.kr
```

## 보안 강화 (선택 사항)

### 1. DH 파라미터 생성

더 강력한 암호화를 위해 DH 파라미터를 생성합니다:

```bash
# DH 파라미터 생성 (약 5-10분 소요)
sudo openssl dhparam -out certbot/conf/ssl-dhparams.pem 2048
```

nginx.conf에 추가:
```nginx
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
```

### 2. OCSP Stapling

nginx.conf에 추가:
```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/ec.sch.ac.kr/chain.pem;
```

### 3. SSL Labs 테스트

배포 후 보안 등급 확인:
https://www.ssllabs.com/ssltest/analyze.html?d=ec.sch.ac.kr

## 인증서 백업

중요한 인증서 파일을 주기적으로 백업하세요:

```bash
# 인증서 백업
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz certbot/conf/

# 안전한 위치로 복사
scp ssl-backup-*.tar.gz backup-server:/secure/location/
```

## 체크리스트

초기 설정 완료 확인:

- [ ] DNS 레코드 설정 완료 (ec.sch.ac.kr → 서버 IP)
- [ ] 방화벽 포트 80, 443 개방
- [ ] .env 파일 생성 및 보안 설정
- [ ] 임시 인증서로 Nginx 시작
- [ ] Let's Encrypt 인증서 발급 성공
- [ ] HTTPS 설정으로 전환
- [ ] HTTP → HTTPS 리다이렉트 작동 확인
- [ ] Certbot 자동 갱신 서비스 실행 중
- [ ] 브라우저에서 HTTPS 접속 확인
- [ ] SSL Labs 테스트 통과 (A 등급 이상)

## 추가 참고 자료

- Let's Encrypt 공식 문서: https://letsencrypt.org/docs/
- Certbot 사용 가이드: https://certbot.eff.org/
- Nginx SSL 설정: https://nginx.org/en/docs/http/configuring_https_servers.html
