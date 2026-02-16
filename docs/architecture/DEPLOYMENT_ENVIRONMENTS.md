# 배포 환경 구성 가이드

이 프로젝트는 GitHub Actions를 통한 자동 배포와 로컬 개발 환경을 지원합니다.

## 📋 환경별 구성

### 개발 환경 (Development)
- **설정 파일**: `_config.yml` + `_config_development.yml`
- **URL**: `http://localhost:4000`
- **특징**: 초안 포함, 증분 빌드, 라이브 리로드
- **용도**: 로컬 개발 및 테스트

### 프로덕션 환경 (Production)
- **설정 파일**: `_config.yml` + `_config_production.yml`
- **URL**: `https://blog.siwony.xyz`
- **호스팅**: AWS S3 + CloudFront
- **배포**: GitHub Actions (OIDC 인증)
- **특징**: 최적화된 빌드, 초안 미포함, 캐시 무효화

## 🚀 배포 방법

### 프로덕션 자동 배포
`main` 브랜치에 푸시하면 GitHub Actions가 자동으로 배포합니다:

```
1. 카테고리 페이지 자동 동기화 (scripts/sync_categories.sh)
2. Jekyll 프로덕션 빌드
3. AWS S3에 동기화
4. RSS content-type 수정
5. CloudFront 캐시 무효화
```

### 개발 환경
```bash
# 방법 1: dev.sh 사용 (권장)
./dev.sh serve                    # 기본 개발 서버 (포트 4000)
./dev.sh serve --port 3000        # 특정 포트로 실행
./dev.sh serve --drafts           # 초안 포함

# 방법 2: 직접 명령어
bundle exec jekyll serve --config _config.yml,_config_development.yml
```

### 프로덕션 로컬 테스트
```bash
# 프로덕션 빌드 후 로컬에서 테스트 (포트 8080)
./dev.sh test-prod
```

## ⚙️ 설정 파일 구성

### _config.yml (공통)
- 사이트 기본 설정 (title, author, URL)
- Kramdown 설정 (GFM, syntax_highlighter: none)
- 퍼머링크 패턴: `/:categories/:title/`
- 기본 레이아웃: `post`
- 제외 파일 목록

### _config_development.yml
```yaml
url: "http://localhost:4000"
show_drafts: true
incremental: true
livereload: true
```

### _config_production.yml
```yaml
url: "https://blog.siwony.xyz"
show_drafts: false
incremental: false
future: false
unpublished: false
```

## 📦 빌드 파이프라인

### 개발 빌드
```bash
./dev.sh build
# → npm run bundle:all (esbuild)
# → Jekyll build (dev config)
# → gulp build:dev (sourcemaps 포함)
```

### 프로덕션 빌드
```bash
./dev.sh build --production
# → npm run bundle:all (esbuild)
# → Jekyll build (production config)
# → gulp build:prod (minify + critical CSS)
```

### Gulp 태스크
| 태스크 | 설명 |
|--------|------|
| `clean` | `_site/` 정리 (search-data.json 보존) |
| `js` | JS 최적화 (프로덕션: uglify, 개발: sourcemaps) |
| `css` | CSS 최적화 (프로덕션: cleanCSS level 2) |
| `bundlePrism` | Prism.js 6개 플러그인 → 단일 번들 |
| `html` | HTML 최적화 (프로덕션: htmlmin) |
| `extractCritical` | Critical CSS 추출 → `_includes/critical.css` |

## 🔧 CI/CD 워크플로우

### 배포 워크플로우 (deploy.yml)
```
트리거: main 브랜치 push
├── Checkout
├── Ruby 3.3 설정
├── 카테고리 동기화 + 자동 커밋
├── Jekyll 프로덕션 빌드
├── AWS OIDC 인증
├── S3 동기화 (--delete --size-only)
├── RSS content-type 수정
└── CloudFront 캐시 무효화
```

### 테스트 워크플로우 (test.yml)
```
트리거: push / pull request
├── Node.js 설정
├── npm install
├── Jest 테스트 실행
└── Codecov 커버리지 업로드
```

## 📦 의존성

- **Ruby 3.x+**: Jekyll 빌드
- **Bundler 2.0+**: Ruby 의존성 관리
- **Node.js 20.x+**: 테스트 및 빌드 도구 (Jest, Gulp, esbuild)
- **AWS CLI**: S3 동기화 및 CloudFront 관리 (CI/CD 환경)

---

📅 마지막 업데이트: 2026년 2월