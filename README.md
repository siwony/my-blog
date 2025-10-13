# 🚀 Tech Blog

바이브코딩(Vibe Coding)으로 만든 개인 기술 블로그입니다.

## 🛠️ 개발 스크립트

빠른 개발을 위한 편의 스크립트들을 제공합니다:

### 🚀 서버 실행
```bash
# 기본 서버 실행 (포트: 4000)
./serve.sh

# 특정 포트로 실행
./serve.sh --port 3000

# 초안 포함 + 라이브 리로드
./serve.sh --drafts --livereload

# 프로덕션 모드
./serve.sh --production
```

### 🔨 빌드
```bash
# 개발 빌드
./build.sh

# 프로덕션 빌드
./build.sh --production

# 캐시 정리 후 빌드
./build.sh --clean --production
```

### 🛠️ 개발 도구
```bash
# 종합 개발 도구 (추천)
./dev.sh

# 블로그 통계 확인
./dev.sh stats

# 새 포스트 생성
./dev.sh new-post

# 새 카테고리 생성
./dev.sh new-category

# 캐시 정리
./dev.sh clean

# 의존성 업데이트
./dev.sh deps
```

## 📖 주요 문서

- 📝 **[Markdown 메타데이터 작성 규칙](docs/MARKDOWN_METADATA.md)** - Jekyll Front Matter 작성 가이드
- 🧩 **[웹 컴포넌트 아키텍처](docs/WEB_COMPONENTS.md)** - 모듈식 컴포넌트 구현 내용
- 🛡️ **[CSS 충돌 방지 가이드](docs/CSS_CONFLICT_PREVENTION.md)** - 라이브러리 간 CSS 충돌 방지 전략Tech Blog

바이브코딩(Vibe Coding)으로 만든 개인 기술 블로그입니다.

## � 주요 문서

- 📝 **[Markdown 메타데이터 작성 규칙](docs/MARKDOWN_METADATA.md)** - Jekyll Front Matter 작성 가이드
- 🧩 **[웹 컴포넌트 아키텍처](docs/WEB_COMPONENTS.md)** - 모듈식 컴포넌트 구현 내용

## �📚 기술 스택

### 핵심 기술
- **Jekyll 3.9.5** - 정적 사이트 생성기
- **Rub```bash
ruby scripts/generate_search_data.rb
```

## 🏷️ 카테고리 관리

### 📝 Markdown 메타데이터 작성 규칙

Jekyll Front Matter 작성 방법과 규칙은 별도 문서를 참조하세요:  
👉 **[Markdown 메타데이터 작성 규칙](docs/MARKDOWN_METADATA.md)**

### 새 카테고리 생성

**자동 생성 스크립트 사용:**
```bash
# 단일 단어 카테고리
ruby scripts/create_category.rb tutorial

# 공백이 있는 카테고리
ruby scripts/create_category.rb "Web Development"

# 기존 카테고리 목록 확인
ruby scripts/create_category.rb --list
```

**수동 생성:**
1. `/category/` 폴더에 새 HTML 파일 생성
2. Front matter 설정:
```yaml
---
layout: category
category: 카테고리명
title: 카테고리 제목 Posts
permalink: /category/카테고리명/
---
```

### 포스트에 카테고리 지정
포스트 작성 시 front matter에 카테고리 추가:
```yaml
---
layout: post
title: "포스트 제목"
date: YYYY-MM-DD
categories: 카테고리명
---
```

## 🧩 웹 컴포넌트 아키텍처

이 블로그는 모던한 웹 컴포넌트 기술을 활용하여 구축되었습니다.

### CategorySidebar 컴포넌트

카테고리 사이드바는 커스텀 웹 컴포넌트로 구현되어 재사용성과 유지보수성을 향상시켰습니다.

#### 특징
- ✨ **자동 렌더링** - Jekyll 데이터를 동적으로 받아 카테고리 목록 생성
- 🎯 **타입 안전성** - JSON 스키마 검증 및 에러 핸들링
- � **반응형 디자인** - 기존 CSS와 완벽 호환
- 🔄 **실시간 업데이트** - 속성 변경 시 자동 리렌더링

#### 사용법
```html
```

## 🧩 웹 컴포넌트 아키텍처

이 블로그는 모던한 웹 컴포넌트 기술을 활용한 모듈식 아키텍처로 구축되었습니다.  
자세한 구현 내용과 사용법은 별도 문서를 참조하세요:  
👉 **[웹 컴포넌트 아키텍처](docs/WEB_COMPONENTS.md)**

## 🔧 개발 환경
```

#### 파일 구조
```
assets/js/
├── category-sidebar.js    # 웹 컴포넌트 구현
├── command-palette.js     # 명령 팔레트
└── blog-pagination.js     # 페이지네이션

tests/
├── category-sidebar.test.js  # 컴포넌트 테스트
└── ...
```

## 🔧 개발 환경
- **Prism.js 1.29.0** - 구문 하이라이팅 (200+ 언어 지원)

### 개발 & 테스트
- **Jest 29.7.0** - JavaScript 테스트 프레임워크
- **Node.js 20.x** - 테스트 환경
- **GitHub Actions** - CI/CD 파이프라인

### 스타일링 & UI
- **GitHub Theme** - Prism.js 테마
- **반응형 디자인** - 모바일 친화적
- **라인 번호 & 복사 버튼** - 코드 블록 기능
- **Ninja Keys** - 명령 팔레트 (Command+K 검색)
- **Web Components** - 모듈식 카테고리 사이드바

## ⚡ Quick Start

### 1. 저장소 클론
```bash
git clone <repository-url>
cd my-tech-blog
```

### 2. Ruby 의존성 설치
```bash
bundle install
```

### 3. Node.js 의존성 설치
```bash
npm install
```

### 4. 개발 서버 실행
```bash
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`으로 접속하세요.

## 🧪 테스트

### 단위 테스트 실행
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

### 테스트 범위
- ✅ **Prism.js 구문 하이라이팅** - 코드 블록 렌더링 및 기능 테스트
- ✅ **블로그 기능** - 카테고리 시스템, 명령 팔레트, 레이아웃 검증
- ✅ **웹 컴포넌트** - CategorySidebar 컴포넌트 로직 및 렌더링 테스트
- ✅ **파일 구조** - 필수 파일 존재 및 구조 검증
- ✅ **설정 검증** - Jekyll 설정 및 front matter 검증

### 테스트 커버리지
현재 테스트는 주요 기능의 존재 및 구조를 검증합니다:
- 검색 데이터 생성 및 구조
- 카테고리 생성 스크립트
- 명령 팔레트 통합
- 웹 컴포넌트 로직 (카테고리 사이드바)
- 반응형 레이아웃

## 📁 프로젝트 구조

```
├── _config.yml          # Jekyll 설정
├── _layouts/            # 레이아웃 템플릿
├── _posts/              # 블로그 포스트
├── assets/              # 정적 자산
│   ├── css/            # 스타일시트
│   └── js/             # JavaScript (명령 팔레트 포함)
├── docs/                # 프로젝트 문서
│   ├── MARKDOWN_METADATA.md  # 메타데이터 작성 규칙
│   └── WEB_COMPONENTS.md      # 웹 컴포넌트 아키텍처
├── tests/               # Jest 테스트
├── scripts/             # 빌드 스크립트
│   ├── generate_posts.rb      # 포스트 생성
│   └── generate_search_data.rb # 검색 데이터 생성
└── .github/workflows/   # GitHub Actions
```

## 🎨 특징

- ✨ **200+ 언어** 구문 하이라이팅 지원
- 📱 **반응형 디자인** - 모든 기기에서 최적화
- 🔍 **검색 엔진 최적화** - SEO 친화적
- 🧪 **완전한 테스트 커버리지** - Jest로 검증된 코드
- 🚀 **자동 배포** - GitHub Actions CI/CD
- 🧩 **웹 컴포넌트** - 모듈식 아키텍처
- ⚡ **VS Code 스타일 검색** - 명령 팔레트 (Cmd+K)

## 📝 포스트 작성

새 포스트는 `_posts/` 디렉토리에 다음 형식으로 작성하세요:

```
YYYY-MM-DD-제목.md
```

포스트 상단에 Front Matter를 포함하세요:

```yaml
---
layout: post
title: "포스트 제목"
date: YYYY-MM-DD
categories: [카테고리]
---
```

## � 명령 팔레트 (Command Palette)

이 블로그는 VS Code 스타일의 명령 팔레트 기능을 제공합니다.

### 사용법
- **단축키**: `Cmd+K` (Mac) 또는 `Ctrl+K` (Windows/Linux)
- **기능**: 블로그 포스트 실시간 검색
- **검색 대상**: 제목, 내용, 카테고리

### 특징
- ⚡ **실시간 검색** - 타이핑과 동시에 결과 표시
- 🎯 **퍼지 검색** - 부분 일치 및 유사 검색 지원
- 📱 **반응형 디자인** - 모바일 친화적
- 🇷 **한글 지원** - 완벽한 한글 검색

### 검색 데이터 업데이트
새 포스트 추가 후 검색 데이터를 업데이트하려면:

```bash
ruby scripts/generate_search_data.rb
```

## �🔧 개발 환경

- **Ruby** 2.7.0 이상
- **Node.js** 20.x 이상
- **Bundler** 2.0 이상

## 📄 라이선스

이 프로젝트는 개인 블로그용으로 제작되었습니다.

---

💻 **Made with Vibe Coding** - 바이브코딩으로 제작된 프로젝트입니다.