---
description: Global instructions for GitHub Copilot when working in this Jekyll tech blog project.
---

# Project Context

이 프로젝트는 Jekyll ~4.3 기반 기술 블로그입니다.

## 기술 스택
- **Jekyll ~4.3** + Kramdown (GFM) + Liquid
- **Prism.js 1.29.0** - 구문 강조 (로컬 호스팅, Gulp 번들)
- **Gulp 4.0.2** - CSS/JS 빌드 자동화 (minify, bundling, critical CSS)
- **esbuild** - JS 번들링 (Ninja Keys, PhotoSwipe)
- **Jest 29.7.0** - 테스트 (jsdom 환경)
- **Ruby 3.3** / **Node.js 20.x**

## 배포 환경
- **AWS S3 + CloudFront** - 정적 사이트 호스팅
- **GitHub Actions** - CI/CD (OIDC 인증, 자동 배포)

## 프로젝트 구조 핵심
- `_posts/` - 블로그 포스트 (Markdown)
- `_layouts/` - Jekyll 레이아웃 (default, post, category)
- `_plugins/` - Ruby 플러그인 (autolink_scrub, excerpt_filter, search_data_generator)
- `assets/js/` - JavaScript (웹 컴포넌트, 명령 팔레트, Prism.js 번들)
- `assets/css/` - 페이지별 분할 CSS (common, home, post, category)
- `tests/` - Jest 테스트 파일 (7개)
- `scripts/` - 자동화 스크립트
- `docs/` - 프로젝트 문서

## 필수 준수 사항
1. `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` - **모든 작업 전 필수 읽기**
2. 원자적 커밋 (하나의 목적, 명확한 메시지)
3. 아키텍처 변경 시 `docs/architecture/SYSTEM_ARCHITECTURE.md` 즉시 업데이트
4. CSS 작업 시 `docs/TYPOGRAPHY_SYSTEM.md` 토큰 시스템 필수 참조
5. 테스트 코드 작성 시 `docs/guidelines/TESTING_STRATEGY.md` 참조

## 개발 도구
- `./dev.sh serve` - 개발 서버 (포트 4000)
- `./dev.sh build --production` - 프로덕션 빌드
- `npm test` - Jest 테스트 실행
- `npm run test:coverage` - 커버리지 포함 테스트
