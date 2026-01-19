# 🚀 My Tech Blog

Prism.js 구문 강조와 웹 컴포넌트를 활용한 모던 기술 블로그입니다.

## ✨ 주요 특징

- 🎨 **Prism.js 구문 강조** - Material Design 테마 기반 코드 하이라이팅
- 🧩 **웹 컴포넌트** - 모듈식 아키텍처의 재사용 가능한 컴포넌트
- ⚡ **명령 팔레트** - VS Code 스타일 실시간 검색 (Cmd+K)
- 📱 **반응형 디자인** - 모든 기기에서 최적화된 사용자 경험
- 🧪 **완전한 테스트 커버리지** - Jest 기반 품질 보증
- 📑 **자동 TOC** - 포스트 목차 자동 생성
- 🖼️ **이미지 자동 리사이징** - 반응형 이미지 최적화

## 📚 종합 문서 가이드

프로젝트의 모든 문서는 [`docs/`](./docs/) 디렉토리에 체계적으로 정리되어 있습니다.

### 🎯 빠른 시작 가이드

- **AI 작업자**: [`docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`](./docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md) ⚠️ **필수 읽기**
- **개발자**: [`docs/architecture/SYSTEM_ARCHITECTURE.md`](./docs/architecture/SYSTEM_ARCHITECTURE.md)에서 시스템 전체 이해
- **배포 담당자**: [`docs/architecture/DEPLOYMENT_ENVIRONMENTS.md`](./docs/architecture/DEPLOYMENT_ENVIRONMENTS.md)에서 배포 옵션 확인

### 📖 문서 카테고리

#### 🔧 [Features](./docs/features/) - 시스템 기능
- **[Prism.js 구문 강조](./docs/features/PRISM_FEATURES.md)** - 코드 하이라이팅 시스템 전체 개요
- **[웹 컴포넌트](./docs/features/WEB_COMPONENTS.md)** - CategorySidebar 등 모듈식 컴포넌트
- **[호스팅 기능](./docs/features/HOSTING_FEATURE.md)** - 로컬/홈서버 호스팅 설정
- **[구문 강조 스펙](./docs/features/SPEC_PRISM_HIGHLIGHTING.md)** - Prism.js 상세 기술 스펙
- **[TOC 기능](./docs/features/TOC_FEATURE.md)** - 목차 자동 생성 기능
- **[이미지 자동 리사이징](./docs/features/IMG_AUTO_RESIZE.md)** - 반응형 이미지 처리
- **[HTML 특수문자 처리](./docs/features/HTML_특수문자_FEAETURE.md)** - 특수문자 이스케이프 처리

#### 🏗️ [Architecture](./docs/architecture/) - 시스템 설계
- **[시스템 아키텍처](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - 전체 시스템 구조 및 컴포넌트
- **[배포 환경](./docs/architecture/DEPLOYMENT_ENVIRONMENTS.md)** - 다양한 배포 옵션 (Local/Homeserver/Cloud)
- **[홈서버 배포](./docs/architecture/HOMESERVER_DEPLOYMENT.md)** - 홈서버 전용 배포 가이드
- **[보안 헤더](./docs/architecture/SECURITY_HEADERS.md)** - Caddy 보안 설정
- **[Prism 배포](./docs/architecture/PRISM_DEPLOYMENT.md)** - Prism.js 통합 배포 전략

#### 📋 [Guidelines](./docs/guidelines/) - 개발 가이드라인
- **[프로젝트 헌법](./docs/guidelines/PROJECT_CONSTITUTION.md)** - 핵심 개발 원칙
- **[AI 개발 가이드라인](./docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md)** - AI 작업자 필수 준수사항
- **[테스팅 전략](./docs/guidelines/TESTING_STRATEGY.md)** - Jest 기반 테스트 접근법
- **[성능 가이드라인](./docs/guidelines/PERFORMANCE_GUIDELINES.md)** - 최적화 전략
- **[CSS 충돌 방지](./docs/guidelines/CSS_CONFLICT_PREVENTION.md)** - 라이브러리 간 CSS 충돌 방지
- **[Markdown 메타데이터](./docs/guidelines/MARKDOWN_METADATA.md)** - Jekyll Front Matter 작성 규칙

## 🛠️ 개발 스크립트

`./dev.sh` 통합 개발 도구를 통해 모든 개발 작업을 수행할 수 있습니다:

### 🚀 서버 실행
```bash
# 개발 서버 시작 (포트: 4000)
./dev.sh serve

# 특정 포트로 실행
./dev.sh serve --port 3000

# 초안 포함 + 라이브 리로드
./dev.sh serve --drafts --livereload
```

### 🔨 빌드
```bash
# 개발 빌드
./dev.sh build

# 프로덕션 빌드
./dev.sh build --production

# 캐시 정리 후 빌드
./dev.sh build --clean --production

# 프로덕션 빌드 후 로컬 테스트 (포트 8080)
./dev.sh test-prod
```

### 📝 콘텐츠 관리
```bash
# 새 포스트 생성
./dev.sh new-post

# 블로그 통계 확인
./dev.sh stats
```

### 🧹 유지보수
```bash
# 캐시 정리
./dev.sh clean

# 의존성 업데이트
./dev.sh deps

# 의존성 설치
./dev.sh install
```
## 📚 기술 스택

### 핵심 기술
- **Jekyll 4.3.x** - 정적 사이트 생성기
- **Ruby 3.x** - Jekyll 실행 환경
- **Node.js 20.x** - 테스트 및 빌드 도구
- **Prism.js** - 구문 강조 라이브러리

### 프론트엔드 기술
- **웹 컴포넌트** - CategorySidebar 모듈식 아키텍처
- **명령 팔레트** - Ninja Keys 기반 VS Code 스타일 검색
- **반응형 CSS** - 모바일 친화적 디자인
- **Material Design** - Prism.js 테마 기반 UI

### 개발 및 테스트 도구
- **Jest 29.7.0** - JavaScript 테스트 프레임워크
- **Gulp 4.0.2** - 빌드 자동화 도구 (CSS/JS 최적화)
- **Ruby 스크립트** - 콘텐츠 생성 및 검색 데이터 자동화

### 배포 환경
- **Caddy Server** - HTTP/2, HTTPS 자동 인증서
- **Docker** - 컨테이너화 배포
- **홈서버** - 자체 호스팅 옵션## ⚡ Quick Start

### 1. 저장소 클론 및 의존성 설치
```bash
git clone <repository-url>
cd my-tech-blog

# Ruby 의존성 설치
bundle install

# Node.js 의존성 설치
npm install
```

### 2. 개발 서버 실행
```bash
# 통합 개발 도구 사용 (추천)
./dev.sh serve

# 또는 직접 Jekyll 실행
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`으로 접속하세요.

### 3. 새 포스트 작성
```bash
# 자동 포스트 생성 도구
./dev.sh new-post

# 수동으로 _posts/ 폴더에 파일 생성
# 형식: YYYY-MM-DD-제목.md
```

## 🏷️ 콘텐츠 관리

### 📝 포스트 작성
새 포스트는 `_posts/` 디렉토리에 다음 형식으로 작성하세요:
- **파일명**: `YYYY-MM-DD-제목.md`
- **Front Matter**: [`docs/guidelines/MARKDOWN_METADATA.md`](./docs/guidelines/MARKDOWN_METADATA.md) 참조

### 📂 카테고리 관리
```bash
# 새 카테고리 자동 생성
ruby scripts/create_category.rb "카테고리명"

# 기존 카테고리 목록 확인
ruby scripts/create_category.rb --list
```

### 🔍 검색 데이터 업데이트
```bash
# 새 포스트 추가 후 검색 데이터 갱신
ruby scripts/generate_search_data.rb
```

## 🧪 테스트 및 품질 보증

### Jest 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# 테스트 감시 모드 (개발 시)
npm run test:watch

# CI 환경용 테스트
npm run test:ci
```

### 테스트 전략
상세한 테스트 접근법은 [`docs/guidelines/TESTING_STRATEGY.md`](./docs/guidelines/TESTING_STRATEGY.md)를 참조하세요.

#### 테스트 범위
- ✅ **Prism.js 구문 하이라이팅** - 코드 블록 렌더링 및 플러그인 기능
- ✅ **웹 컴포넌트** - CategorySidebar 컴포넌트 로직 및 렌더링
- ✅ **명령 팔레트** - VS Code 스타일 검색 기능
- ✅ **파일 구조** - 필수 파일 존재 및 구조 검증
- ✅ **설정 검증** - Jekyll 설정 및 front matter 유효성

### 성능 최적화
성능 가이드라인은 [`docs/guidelines/PERFORMANCE_GUIDELINES.md`](./docs/guidelines/PERFORMANCE_GUIDELINES.md)를 참조하세요.

## 📁 프로젝트 구조

```
├── _config.yml          # Jekyll 메인 설정
├── _config_development.yml  # 개발 환경 설정
├── _config_production.yml   # 프로덕션 환경 설정
├── _layouts/            # 레이아웃 템플릿
│   ├── default.html    # 기본 레이아웃
│   ├── post.html       # 포스트 레이아웃
│   └── category.html   # 카테고리 레이아웃
├── _includes/           # 재사용 가능한 HTML 조각
├── _posts/              # 블로그 포스트 (Markdown)
├── _plugins/            # Jekyll 플러그인
│   ├── autolink_scrub.rb       # 자동 링크 처리
│   └── search_data_generator.rb # 검색 데이터 생성
├── assets/              # 정적 자산
│   ├── css/            # 스타일시트
│   ├── js/             # JavaScript (웹 컴포넌트, 명령 팔레트)
│   │   ├── category-sidebar.js   # 카테고리 사이드바 컴포넌트
│   │   ├── command-palette.js    # 명령 팔레트 컴포넌트
│   │   ├── blog-pagination.js    # 블로그 페이지네이션
│   │   ├── post-metadata.js      # 포스트 메타데이터
│   │   └── prism/                # Prism.js 구문 강조 라이브러리
│   └── images/         # 이미지 자산
├── docs/                # 📚 종합 프로젝트 문서
│   ├── features/       # 시스템 기능 문서
│   ├── architecture/   # 시스템 설계 문서
│   └── guidelines/     # 개발 가이드라인
├── tests/               # Jest 테스트 파일
├── scripts/             # 자동화 스크립트
│   ├── generate_posts.rb         # 포스트 생성 도구
│   ├── create_category.rb        # 카테고리 생성 도구
│   ├── generate_search_data.rb   # 검색 데이터 생성
│   └── css-conflict-detector.js  # CSS 충돌 감지
├── category/            # 카테고리 페이지
├── dev.sh              # 📦 통합 개발 도구 스크립트
├── deploy.sh           # 배포 스크립트
├── deploy-homeserver.sh # 홈서버 배포 스크립트
├── docker-compose.yml  # Docker 배포 설정
├── docker-compose.homeserver.yml # 홈서버 Docker 설정
├── Caddyfile           # Caddy 웹서버 설정
├── gulpfile.js         # Gulp 빌드 자동화
└── Makefile            # Make 명령어
```

## 🎨 핵심 기능

### ⚡ VS Code 스타일 명령 팔레트
- **단축키**: `Cmd+K` (Mac) 또는 `Ctrl+K` (Windows/Linux)
- **실시간 검색**: 타이핑과 동시에 결과 표시
- **퍼지 검색**: 부분 일치 및 유사 검색 지원
- **한글 완전 지원**: 완벽한 한글 검색 경험

### 🎨 Prism.js 구문 강조
- **Material Design 테마**: 모던한 코드 블록 디자인
- **라인 번호 표시**: 코드 라인 번호 자동 생성
- **복사 버튼**: 원클릭 클립보드 복사
- **20+ 언어 지원**: JavaScript, Python, Java, CSS 등
- **로컬 호스팅**: 안정적인 CDN 대신 로컬 파일 사용

### 🧩 웹 컴포넌트
- **CategorySidebar**: 동적 카테고리 네비게이션
- **모듈식 설계**: 재사용 가능한 컴포넌트
- **Jekyll 데이터 통합**: 서버사이드 데이터와 클라이언트 컴포넌트 연동

## 배포 옵션

다양한 배포 환경을 지원합니다. 자세한 내용은 [`docs/architecture/DEPLOYMENT_ENVIRONMENTS.md`](./docs/architecture/DEPLOYMENT_ENVIRONMENTS.md)를 참조하세요.

### 📱 로컬 개발
```bash
./dev.sh serve                # 기본 개발 서버
./dev.sh build --production   # 프로덕션 모드 빌드
./dev.sh test-prod            # 프로덕션 빌드 후 로컬 테스트
```

### 🏠 홈서버 배포
```bash
# Docker Compose로 배포
docker-compose up -d

# 홈서버 전용 설정으로 배포
docker-compose -f docker-compose.homeserver.yml up -d

# 배포 스크립트 사용
./deploy-homeserver.sh
```

상세한 홈서버 배포 가이드: [`docs/architecture/HOMESERVER_DEPLOYMENT.md`](./docs/architecture/HOMESERVER_DEPLOYMENT.md)

## 🔧 개발 환경 요구사항

- **Ruby** 3.x+ (Jekyll 실행)
- **Bundler** 2.0+ (Ruby 의존성 관리)
- **Node.js** 20.x+ (테스트 및 빌드 도구)
- **Docker** (선택적, 컨테이너 배포용)

## 🤝 기여 가이드

1. **문서 우선**: 새로운 기능이나 변경사항은 [`docs/`](./docs/) 폴더의 해당 문서를 먼저 업데이트
2. **테스트 작성**: 모든 코드 변경은 해당하는 Jest 테스트와 함께 제출
3. **AI 가이드라인 준수**: [`docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`](./docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md) 필수 확인
4. **성능 고려**: [`docs/guidelines/PERFORMANCE_GUIDELINES.md`](./docs/guidelines/PERFORMANCE_GUIDELINES.md) 지침 준수

## 📄 라이선스

이 프로젝트는 개인 기술 블로그용으로 제작되었습니다.

---

🎯 **더 자세한 정보**가 필요하다면 [`docs/`](./docs/) 폴더의 종합 문서를 참조하세요.  
💻 **Made with Jekyll 4 + Prism.js** - 모던 기술 스택으로 구축된 프로젝트입니다.