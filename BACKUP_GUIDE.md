# 데이터베이스 백업 가이드

## 현재 백업 상태

✅ **백업 완료**: `backups/lab_management_20251013_125245.sql` (33KB)

---

## 수동 백업 방법

### 1. 백업 스크립트 사용
```bash
cd /Users/yangzepa/Documents/labwebpage
./backup_db.sh
```

### 2. 직접 백업 명령어
```bash
docker exec lab-mysql mysqldump -u root -proot lab_management > backup.sql
```

---

## 자동 백업 설정 (매일 새벽 3시)

### Mac용 - Cron 설정

1. **crontab 편집**:
```bash
crontab -e
```

2. **다음 라인 추가** (매일 새벽 3시):
```
0 3 * * * /Users/yangzepa/Documents/labwebpage/backup_db.sh >> /Users/yangzepa/Documents/labwebpage/backups/backup.log 2>&1
```

3. **저장 후 확인**:
```bash
crontab -l
```

### Mac용 - launchd 설정 (권장)

Mac에서는 launchd가 cron보다 안정적입니다.

1. **plist 파일 생성**:
```bash
nano ~/Library/LaunchAgents/com.lab.backup.plist
```

2. **다음 내용 입력**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.lab.backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/yangzepa/Documents/labwebpage/backup_db.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>3</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/Users/yangzepa/Documents/labwebpage/backups/backup.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/yangzepa/Documents/labwebpage/backups/backup_error.log</string>
</dict>
</plist>
```

3. **launchd 등록**:
```bash
launchctl load ~/Library/LaunchAgents/com.lab.backup.plist
```

4. **상태 확인**:
```bash
launchctl list | grep com.lab.backup
```

5. **즉시 테스트**:
```bash
launchctl start com.lab.backup
```

### 서버 배포 시 (Linux)

1. **Cron 설정** (Ubuntu/CentOS):
```bash
sudo crontab -e
```

2. **추가**:
```
0 3 * * * cd /path/to/labwebpage && ./backup_db.sh >> backups/backup.log 2>&1
```

---

## 백업 복원 방법

### 1. 백업 파일 확인
```bash
ls -lh backups/
```

### 2. 복원 실행
```bash
# 특정 백업 파일 복원
docker exec -i lab-mysql mysql -u root -proot lab_management < backups/lab_management_20251013_125245.sql
```

### 3. 복원 확인
```bash
docker exec lab-mysql mysql -u root -proot -e "USE lab_management; SHOW TABLES;"
```

---

## 백업 파일 관리

### 자동 정리
스크립트는 **30일 이상 된 백업을 자동 삭제**합니다.

### 수동 정리
```bash
# 7일 이상 된 백업 삭제
find backups/ -name "lab_management_*.sql" -mtime +7 -delete
```

### 원격 백업 (선택)
```bash
# AWS S3로 업로드 (예시)
aws s3 cp backups/ s3://your-bucket/lab-backups/ --recursive

# rsync로 다른 서버에 복사
rsync -av backups/ user@remote-server:/backup/lab-management/
```

---

## 주의사항

1. **Docker 실행 확인**: 백업 전 Docker 컨테이너가 실행 중인지 확인
2. **디스크 용량**: 백업 폴더 용량 정기 점검
3. **테스트**: 정기적으로 복원 테스트 수행
4. **보안**: 백업 파일에는 민감한 데이터가 포함되므로 접근 권한 관리
5. **버전 관리**: 중요한 변경 전에는 수동 백업 권장

---

## 트러블슈팅

### "docker: command not found"
```bash
# Docker 경로 확인
which docker

# cron에 PATH 추가
0 3 * * * PATH=/usr/local/bin:/usr/bin:/bin /path/to/backup_db.sh
```

### "Access denied"
- MySQL 비밀번호 확인: `docker-compose.yml`에서 MYSQL_ROOT_PASSWORD 확인

### 백업 파일이 비어있음
```bash
# 로그 확인
cat backups/backup.log
cat backups/backup_error.log
```
