# 배포 환경 구성 가이드

이 프로젝트는 여러 환경에서의 배포를 지원합니다.

## 📋 환경별 파일 매핑

### 개발 환경 (Development)
- **Docker Compose**: `docker-compose.yml`
- **Caddyfile**: `Caddyfile`
- **포트**: 8081 (HTTP), 2019 (관리자)
- **용도**: 로컬 개발 및 테스트

### 테스트 환경 (Test)
- **Docker Compose**: `docker-compose.yml` 
- **Caddyfile**: `Caddyfile.test`
- **포트**: 8082 (HTTP)
- **용도**: 배포 전 최종 테스트

### 홈서버 환경 (Homeserver)
- **Docker Compose**: `docker-compose.homeserver.yml`
- **Caddyfile**: `Caddyfile.homeserver`
- **포트**: 8443 (HTTPS), 8080 (HTTP 리다이렉트)
- **용도**: 가정용 서버 배포 (DDNS + Let's Encrypt)

## 🚀 배포 방법

### 개발 환경
```bash
# 방법 1: Makefile 사용
make dev                    # Jekyll 개발 서버
make deploy                 # Docker 컨테이너 배포

# 방법 2: 직접 명령어
bundle exec jekyll serve --watch --drafts
docker-compose up -d
```

### 홈서버 환경
```bash
# 방법 1: 전용 스크립트 사용 (권장)
./deploy-homeserver.sh                  # 전체 배포
./deploy-homeserver.sh --build-only     # Jekyll 빌드만
./deploy-homeserver.sh --deploy-only    # Docker 배포만
./deploy-homeserver.sh --status         # 상태 확인

# 방법 2: Makefile 사용
make homeserver-deploy      # 전체 배포
make homeserver-status      # 상태 확인
make homeserver-logs        # 로그 확인

# 방법 3: 수동 배포
JEKYLL_ENV=production bundle exec jekyll build
docker-compose -f docker-compose.homeserver.yml up -d
```

## ⚙️ 홈서버 설정 가이드

### 1. 도메인 및 DDNS 설정
1. **Caddyfile.homeserver 수정**:
   ```
   yourdomain.com → 실제 도메인으로 변경
   your-email@example.com → 실제 이메일로 변경
   ```

2. **Namecheap DDNS 설정** (동적 IP 사용 시):
   - Domain List → Manage → Advanced DNS → Dynamic DNS → ON
   - Dynamic DNS Password 복사
   - ddclient 설정:
     ```bash
     sudo apt install ddclient
     sudo nano /etc/ddclient.conf
     ```

### 2. 포트 포워딩 설정
라우터에서 다음 포트를 포워딩하세요:
- **8443** (외부) → **443** (내부 서버) - HTTPS
- **8080** (외부) → **80** (내부 서버) - HTTP 리다이렉트 (선택사항)

### 3. 방화벽 설정
```bash
# Ubuntu/Debian
sudo ufw allow 8443
sudo ufw allow 8080

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### 4. 서비스 접근
- **HTTPS**: `https://yourdomain.com:8443`
- **HTTP**: `http://yourdomain.com:8080` (자동으로 HTTPS로 리다이렉트)

## 🔧 유지보수

### 콘텐츠 업데이트
```bash
# 홈서버
./deploy-homeserver.sh --build-only && ./deploy-homeserver.sh --restart
```

### 로그 확인
```bash
# 홈서버
./deploy-homeserver.sh --logs
docker-compose -f docker-compose.homeserver.yml logs -f
```

### 문제 해결
1. **TLS 핸드셰이크 타임아웃**: 포트 8443이 제대로 포워딩되었는지 확인
2. **잘못된 인증서**: 도메인 설정과 DNS 동기화 확인
3. **사이트가 서빙되지 않음**: `_site` 디렉토리가 존재하는지 확인

## 📦 의존성

- **Ruby & Bundler**: Jekyll 빌드용
- **Docker & Docker Compose**: 컨테이너 배포용
- **Make**: 빌드 자동화용 (선택사항)