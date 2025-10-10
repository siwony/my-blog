# 🚀 My Tech Blog

바이브코딩(Vibe Coding)으로 만든 개인 기술 블로그입니다.

## 📚 기술 스택

### 핵심 기술
- **Jekyll 3.9.5** - 정적 사이트 생성기
- **Rub```bash
ruby scripts/generate_search_data.rb
```

## 🏷️ 카테고리 관리

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

## 🔧 개발 환경 Jekyll 런타임 환경
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
- ✅ **파일 구조** - 필수 파일 존재 및 구조 검증
- ✅ **설정 검증** - Jekyll 설정 및 front matter 검증

### 테스트 커버리지
현재 테스트는 주요 기능의 존재 및 구조를 검증합니다:
- 검색 데이터 생성 및 구조
- 카테고리 생성 스크립트
- 명령 팔레트 통합
- 반응형 레이아웃

## 📁 프로젝트 구조

```
├── _config.yml          # Jekyll 설정
├── _layouts/            # 레이아웃 템플릿
├── _posts/              # 블로그 포스트
├── assets/              # 정적 자산
│   ├── css/            # 스타일시트
│   └── js/             # JavaScript (명령 팔레트 포함)
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