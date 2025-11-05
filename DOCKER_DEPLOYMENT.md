# Docker Deployment for Jekyll Blog with Caddy

이 프로젝트는 Jekyll로 작성된 기술 블로그를 Caddy 웹서버를 통해 Docker 환경에서 서빙하는 설정을 포함합니다.

## 🚀 빠른 시작

### 필수 요구사항
- Docker
- Docker Compose

### 배포 방법

1. **간편 배포 (권장)**
   ```bash
   ./deploy.sh
   ```

2. **수동 배포**
   ```bash
   # 이미지 빌드
   docker-compose build
   
   # 컨테이너 시작
   docker-compose up -d
   
   # 브라우저에서 http://localhost:8080 접속
   ```

## 📁 Docker 관련 파일들

- `Dockerfile`: Multi-stage 빌드로 Jekyll 사이트를 빌드하고 Caddy로 서빙
- `Caddyfile`: Caddy 웹서버 설정 (압축, 캐싱, 보안 헤더 포함)
- `docker-compose.yml`: Docker Compose 서비스 정의
- `.dockerignore`: Docker 빌드에서 제외할 파일들
- `deploy.sh`: 배포 자동화 스크립트

## 🔧 주요 기능

### Caddy 웹서버 특징
- **자동 HTTPS**: 프로덕션에서 자동으로 SSL 인증서 발급
- **HTTP/2 지원**: 빠른 페이지 로딩
- **Gzip 압축**: 대역폭 절약
- **정적 파일 캐싱**: 성능 최적화
- **보안 헤더**: XSS, CSRF 등 보안 강화

### Docker 구성
- **Multi-stage 빌드**: 최종 이미지 크기 최소화
- **Health Check**: 컨테이너 상태 모니터링
- **로그 관리**: 표준 출력으로 로그 수집

## 📊 유용한 명령어

```bash
# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down

# 재빌드 후 시작
docker-compose up --build -d

# 컨테이너 내부 접속
docker-compose exec blog sh

# 컨테이너 상태 확인
docker-compose ps

# 사용 중인 포트 확인
docker-compose port blog 80
```

## 🌐 접속 정보

- **로컬 개발**: http://localhost:8080
- **Health Check**: 30초마다 자동 확인

## 🔒 보안 설정

Caddyfile에 다음 보안 기능이 포함되어 있습니다:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📈 성능 최적화

- **정적 파일 캐싱**: CSS, JS, 이미지 파일 1년 캐시
- **HTML 캐싱**: HTML 파일 1시간 캐시
- **Gzip 압축**: 모든 응답에 대해 압축 적용

## 🐛 문제 해결

### 컨테이너가 시작되지 않는 경우
```bash
# 로그 확인
docker-compose logs

# 이미지 재빌드
docker-compose build --no-cache
```

### 포트 충돌 시
`docker-compose.yml`에서 포트를 변경:
```yaml
ports:
  - "8081:80"  # 8080 대신 8081 사용
```

### Jekyll 빌드 오류 시
```bash
# 로컬에서 Jekyll 빌드 테스트
bundle install
bundle exec jekyll build
```

## 📝 프로덕션 배포

프로덕션 환경에서는:
1. 도메인에 맞게 Caddyfile 수정
2. 환경 변수로 설정 관리
3. 로그 볼륨 마운트 고려
4. 백업 및 모니터링 설정

```bash
# 프로덕션용 Caddyfile 예시
your-domain.com {
    root * /usr/share/caddy
    file_server
    encode gzip
}
```