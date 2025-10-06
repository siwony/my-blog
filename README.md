# 🚀 My Tech Blog

바이브코딩(Vibe Coding)으로 만든 개인 기술 블로그입니다.

## 📚 기술 스택

### 핵심 기술
- **Jekyll 3.9.5** - 정적 사이트 생성기
- **Ruby** - Jekyll 런타임 환경
- **Prism.js 1.29.0** - 구문 하이라이팅 (200+ 언어 지원)

### 개발 & 테스트
- **Jest 29.7.0** - JavaScript 테스트 프레임워크
- **Node.js 20.x** - 테스트 환경
- **GitHub Actions** - CI/CD 파이프라인

### 스타일링 & UI
- **GitHub Theme** - Prism.js 테마
- **반응형 디자인** - 모바일 친화적
- **라인 번호 & 복사 버튼** - 코드 블록 기능

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

### 5. 테스트 실행
```bash
# 전체 테스트
npm test

# 커버리지 포함 테스트
npm run test:coverage

# CI 환경용 테스트
npm run test:ci
```

## 📁 프로젝트 구조

```
├── _config.yml          # Jekyll 설정
├── _layouts/            # 레이아웃 템플릿
├── _posts/              # 블로그 포스트
├── assets/              # 정적 자산
├── tests/               # Jest 테스트
├── scripts/             # 빌드 스크립트
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

## 🔧 개발 환경

- **Ruby** 2.7.0 이상
- **Node.js** 20.x 이상
- **Bundler** 2.0 이상

## 📄 라이선스

이 프로젝트는 개인 블로그용으로 제작되었습니다.

---

💻 **Made with Vibe Coding** - 바이브코딩으로 제작된 프로젝트입니다.