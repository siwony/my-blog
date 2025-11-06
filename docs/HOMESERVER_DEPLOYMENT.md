# 🏠 홈서버 Jekyll 블로그 배포 가이드

이 가이드는 Jekyll 정적 블로그를 홈서버에 HTTPS와 함께 배포하는 방법을 설명합니다.

## 📋 개요

- **웹 서버**: Caddy (자동 HTTPS)
- **컨테이너**: Docker + Docker Compose
- **HTTPS**: Let's Encrypt (TLS-ALPN-01 챌린지)
- **포트**: 8443 (HTTPS), 8080 (HTTP 리다이렉트)
- **특징**: 포트 80 없이도 자동 HTTPS 지원

## 🛠️ 필수 준비사항

### 1. 소프트웨어 설치
```bash
# Docker & Docker Compose 설치 (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io docker-compose

# Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER
# 로그아웃 후 다시 로그인 필요
```

### 2. Ruby & Jekyll 환경 (빌드용)
```bash
# Ruby 설치
sudo apt install ruby-full build-essential zlib1g-dev

# Bundler 설치
gem install bundler

# Jekyll 의존성 설치 (프로젝트 디렉토리에서)
bundle install
```

## 🌐 도메인 및 DNS 설정

### 1. 도메인 구매 및 설정
1. **도메인 구매** (예: Namecheap, GoDaddy, Cloudflare)
2. **DNS A 레코드 설정**:
   - `yourdomain.com` → `당신의 공인 IP 주소`

### 2. 동적 IP용 DDNS 설정 (권장)

**Namecheap DDNS 설정**:
1. Namecheap 계정 로그인
2. Domain List → Manage → Advanced DNS
3. Dynamic DNS → **ON**
4. Dynamic DNS Password 복사

**ddclient 설치 및 설정**:
```bash
# ddclient 설치
sudo apt install ddclient

# 설정 파일 편집
sudo nano /etc/ddclient.conf
```

`/etc/ddclient.conf` 내용:
```
protocol=namecheap
ssl=yes
server=dynamicdns.park-your-domain.com
login=yourdomain.com
password='your-ddns-password'
@
```

**ddclient 테스트 및 시작**:
```bash
# 테스트
sudo ddclient -daemon=0 -verbose

# 서비스 시작
sudo systemctl start ddclient
sudo systemctl enable ddclient
```

## 🔧 홈서버 설정

### 1. 프로젝트 설정
`Caddyfile.homeserver` 파일에서 도메인과 이메일을 실제 값으로 변경:

```bash
# 파일 편집
nano Caddyfile.homeserver
```

다음 부분을 수정:
```
yourdomain.com:443 → 실제-도메인.com:443
your-email@example.com → 실제-이메일@example.com
```

### 2. 라우터 포트 포워딩 설정
라우터 관리 페이지에서 다음 포트를 설정:

| 외부 포트 | 내부 포트 | 프로토콜 | 대상 IP |
|----------|----------|---------|---------|
| 8443     | 443      | TCP     | 홈서버 IP |
| 8080     | 80       | TCP     | 홈서버 IP |

### 3. 방화벽 설정
```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 8443/tcp
sudo ufw allow 8080/tcp
sudo ufw reload

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

## 🚀 배포 실행

### 방법 1: 자동 배포 스크립트 (권장)
```bash
# 실행 권한 부여 (최초 1회)
chmod +x deploy-homeserver.sh

# 전체 배포 (Jekyll 빌드 + Docker 시작)
./deploy-homeserver.sh

# 단계별 배포
./deploy-homeserver.sh --build-only   # Jekyll 빌드만
./deploy-homeserver.sh --deploy-only  # Docker 시작만
```

### 방법 2: Makefile 사용
```bash
make homeserver-deploy    # 전체 배포
make homeserver-status    # 상태 확인
make homeserver-logs      # 로그 확인
```

### 방법 3: 수동 배포
```bash
# 1. Jekyll 사이트 빌드
JEKYLL_ENV=production bundle exec jekyll build

# 2. Docker 컨테이너 시작
docker-compose -f docker-compose.homeserver.yml up -d
```

## 🔍 배포 확인

### 1. 컨테이너 상태 확인
```bash
# 상태 확인
./deploy-homeserver.sh --status

# 또는
docker-compose -f docker-compose.homeserver.yml ps
```

### 2. 로그 확인
```bash
# 실시간 로그
./deploy-homeserver.sh --logs

# 또는
docker-compose -f docker-compose.homeserver.yml logs -f
```

### 3. 웹사이트 접속 테스트
- **HTTPS**: `https://yourdomain.com:8443`
- **HTTP**: `http://yourdomain.com:8080` (자동으로 HTTPS로 리다이렉트)

## 🔄 유지보수

### 콘텐츠 업데이트
새 게시물이나 콘텐츠 변경 후:
```bash
# 빌드 + 재시작
./deploy-homeserver.sh --build-only
./deploy-homeserver.sh --restart

# 또는 한 번에
./deploy-homeserver.sh
```

### 컨테이너 관리
```bash
# 컨테이너 재시작
./deploy-homeserver.sh --restart

# 컨테이너 중지
./deploy-homeserver.sh --stop

# 컨테이너 시작
./deploy-homeserver.sh --deploy-only
```

### 인증서 관리
Caddy가 자동으로 Let's Encrypt 인증서를 갱신합니다. 수동 개입이 필요하지 않습니다.

## 🚨 문제 해결

### 일반적인 문제들

#### 1. TLS 핸드셰이크 타임아웃
**증상**: 브라우저에서 "연결 시간 초과" 오류  
**해결책**:
- 포트 포워딩 확인 (8443 → 443)
- 방화벽 설정 확인
- 공인 IP 주소 확인

#### 2. 잘못된 인증서 오류
**증상**: "인증서가 신뢰할 수 없음" 오류  
**해결책**:
- 도메인 설정 확인
- DNS 전파 대기 (최대 24시간)
- DDNS 동기화 확인

#### 3. 사이트가 표시되지 않음
**증상**: 빈 페이지 또는 404 오류  
**해결책**:
```bash
# _site 디렉토리 확인
ls -la _site/

# Jekyll 다시 빌드
./deploy-homeserver.sh --build-only

# 컨테이너 재시작
./deploy-homeserver.sh --restart
```

#### 4. Docker 권한 오류
**증상**: "permission denied" Docker 오류  
**해결책**:
```bash
# 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER
# 로그아웃 후 다시 로그인

# 또는 sudo 사용
sudo ./deploy-homeserver.sh
```

### 로그 분석
```bash
# Caddy 로그 확인
docker-compose -f docker-compose.homeserver.yml logs caddy

# 시스템 로그 확인
journalctl -u docker

# ddclient 로그 확인 (DDNS 사용 시)
sudo journalctl -u ddclient
```

## 📊 성능 최적화

### 1. 리소스 제한 조정
`docker-compose.homeserver.yml`에서 메모리/CPU 제한 조정:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'        # CPU 제한 증가
      memory: 512M       # 메모리 제한 증가
```

### 2. 캐시 설정 최적화
`Caddyfile.homeserver`에서 캐시 헤더 조정:
```
# 정적 파일 캐시 기간 (현재: 1년)
Cache-Control "public, max-age=31536000, immutable"

# HTML 파일 캐시 기간 (현재: 1시간)
Cache-Control "public, max-age=3600"
```

## 🔐 보안 강화

### 1. 추가 보안 헤더
`Caddyfile.homeserver`에 이미 포함된 보안 헤더들:
- X-Frame-Options: 클릭재킹 방지
- X-Content-Type-Options: MIME 타입 스니핑 방지
- X-XSS-Protection: XSS 공격 방지
- Content-Security-Policy: 콘텐츠 보안 정책

### 2. 서버 정보 숨김
```
-Server  # 서버 정보 헤더 제거
```

### 3. 정기 업데이트
```bash
# Docker 이미지 업데이트
docker-compose -f docker-compose.homeserver.yml pull
docker-compose -f docker-compose.homeserver.yml up -d

# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade
```

## 📞 추가 도움

- **Docker 문제**: [Docker 공식 문서](https://docs.docker.com/)
- **Caddy 설정**: [Caddy 공식 문서](https://caddyserver.com/docs/)
- **Let's Encrypt**: [Let's Encrypt 가이드](https://letsencrypt.org/docs/)
- **Jekyll 빌드**: [Jekyll 공식 문서](https://jekyllrb.com/docs/)

---

🎉 **축하합니다!** 홈서버에서 HTTPS Jekyll 블로그가 성공적으로 실행 중입니다!