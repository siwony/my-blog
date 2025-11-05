# 보안 헤더 설정 가이드

## 개요

이 문서는 Jekyll 블로그의 Caddy 웹서버에서 사용하는 보안 헤더 설정에 대해 설명합니다.

## 현재 적용된 보안 헤더

### 1. 필수 보안 헤더

#### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
- **목적**: MIME 타입 스니핑 공격 방지
- **설명**: 브라우저가 Content-Type 헤더를 무시하고 파일 내용을 기반으로 MIME 타입을 추측하는 것을 방지

#### X-Frame-Options
```
X-Frame-Options: DENY
```
- **목적**: 클릭재킹(Clickjacking) 공격 방지
- **설명**: 페이지가 frame, iframe, embed, object 태그 내에서 로드되는 것을 완전히 차단

#### Content-Security-Policy (CSP)
```
Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; ..."
```
- **목적**: XSS 공격 방지 및 리소스 로드 제어
- **설명**: 페이지에서 로드할 수 있는 리소스의 출처를 제한

#### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
- **목적**: 리퍼러 정보 노출 제어
- **설명**: 동일 출처로의 요청에는 전체 URL을, 크로스 오리진 요청에는 출처만 전송

### 2. 고급 보안 헤더 (프로덕션)

#### Strict-Transport-Security (HSTS)
```
Strict-Transport-Security: "max-age=31536000; includeSubDomains; preload"
```
- **목적**: HTTPS 강제 적용
- **설명**: 브라우저가 해당 도메인을 HTTPS로만 접근하도록 강제

#### Permissions-Policy
```
Permissions-Policy: "accelerometer=(), ambient-light-sensor=(), ..."
```
- **목적**: 브라우저 기능 사용 제한
- **설명**: 카메라, 마이크, 위치 정보 등 민감한 브라우저 기능을 비활성화

#### Cross-Origin 정책들
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: cross-origin
```
- **목적**: 크로스 오리진 공격 방지
- **설명**: 다른 출처의 리소스 로드 및 창 간 상호작용을 제어

## X-XSS-Protection 헤더가 제거된 이유

### 기존 설정 (비권장)
```
X-XSS-Protection: "1; mode=block"
```

### 제거 이유
1. **브라우저 지원 중단**: 최신 브라우저들이 이 헤더를 무시하기 시작
2. **보안 취약점**: 일부 경우에 XSS 공격을 더 쉽게 만들 수 있음
3. **CSP로 대체**: Content-Security-Policy가 더 강력하고 유연한 XSS 방지 메커니즘 제공
4. **웹 표준**: W3C와 WHATWG에서 더 이상 권장하지 않음

### 현대적 대안
- **Content-Security-Policy**: 스크립트 실행을 세밀하게 제어
- **Trusted Types**: DOM XSS 방지
- **SameSite 쿠키**: CSRF 공격 방지

## 환경별 설정 차이

### 개발 환경 (Caddyfile)
- HSTS 미적용 (HTTP 사용)
- 더 관대한 CSP 설정 (개발 편의성)
- WebSocket 연결 허용 (라이브 리로드)

### 프로덕션 환경 (Caddyfile.prod)
- 완전한 보안 헤더 세트
- 엄격한 CSP 정책
- HSTS 적용
- 고급 크로스 오리진 정책

## 보안 헤더 검증

### 자동 검증 스크립트
```bash
# 로컬 개발 서버 검증
./scripts/check_security_headers.sh http://localhost

# 프로덕션 서버 검증
./scripts/check_security_headers.sh https://your-domain.com
```

### 온라인 도구
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## CSP 정책 상세 설명

### 현재 CSP 정책 분석
```
default-src 'self'
```
기본적으로 동일 출처의 리소스만 허용

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com
```
- `'self'`: 동일 출처 스크립트
- `'unsafe-inline'`: 인라인 스크립트 허용 (Jekyll/Prism.js용)
- `'unsafe-eval'`: eval() 함수 허용 (일부 라이브러리용)
- 특정 CDN 허용

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net
```
스타일시트 로드 정책

```
img-src 'self' data: https: blob:
```
이미지 로드 정책 (모든 HTTPS 이미지 허용)

## 보안 헤더 모니터링

### 로그 확인
```bash
# Caddy 접근 로그에서 보안 관련 요청 확인
tail -f /var/log/caddy/access.log | grep -E "(403|404|CSP)"
```

### 정기 검토
1. **월간**: CSP 위반 로그 검토
2. **분기별**: 보안 헤더 정책 업데이트
3. **연간**: 전체 보안 설정 감사

## 추가 권장사항

### 1. 컨텐츠 보안
- 정기적인 의존성 업데이트
- 신뢰할 수 있는 CDN 사용
- 사용자 생성 컨텐츠 검증

### 2. 서버 보안
- 정기적인 Caddy 업데이트
- 최소 권한 원칙 적용
- 방화벽 설정

### 3. 모니터링
- 보안 헤더 위반 모니터링
- CSP 리포트 분석
- 정기적인 보안 스캔

## 참고 자료

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Caddy Security Headers](https://caddyserver.com/docs/caddyfile/directives/header)
- [CSP Reference](https://content-security-policy.com/)