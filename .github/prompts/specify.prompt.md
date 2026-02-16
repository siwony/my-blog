---
description: Create or update the feature specification from a natural language feature description.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` and ensure compliance with:
   - Guidelines adherence protocols
   - Atomic commit strategies
   - Architecture documentation requirements

2. **REQUIRED**: Review related documentation:
   - `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state
   - `docs/features/` - Existing feature documentation

## Project Context

Jekyll ~4.3 기반 기술 블로그:
- **프론트엔드**: Prism.js 구문 강조(로컬 번들), 웹 컴포넌트(CategorySidebar, PostMetadata), Ninja Keys, PhotoSwipe
- **빌드**: Gulp(CSS/JS minify, Prism 번들링, Critical CSS), esbuild(JS 번들링)
- **테스트**: Jest 29.7.0 (jsdom), 7개 테스트 파일
- **배포**: GitHub Actions → AWS S3 + CloudFront (OIDC)

## Specification Workflow

Given the feature description from the user:

1. **기능 분석**:
   - 기능의 목적과 범위 파악
   - 기존 시스템과의 관계 분석 (`docs/architecture/SYSTEM_ARCHITECTURE.md` 참조)
   - 영향받는 파일 및 컴포넌트 식별

2. **명세서 작성** (`docs/features/` 디렉토리에 생성):
   - **개요**: 기능 설명, 문제 정의, 해결 방안
   - **기능 요구사항**: 구체적이고 측정 가능한 요구사항 목록
   - **비기능 요구사항**: 성능, 접근성, 브라우저 호환성
   - **기술 스펙**: 영향받는 파일, 의존성, 구현 방식
   - **테스트 기준**: 검증 방법 및 성공 기준
   - **구현 계획**: 단계별 작업 분해

3. **파일 명명 규칙**: `UPPER_SNAKE_CASE.md` (예: `SEARCH_FEATURE.md`)

4. **MANDATORY Post-Work Actions** (per AI_DEVELOPMENT_GUIDELINES.md):
   - Commit specification atomically (예: `docs: add SEARCH_FEATURE specification`)
   - Update `docs/features/README.md` index with new feature entry

5. Report completion with:
   - Spec file path
   - Confirmation of guideline compliance
   - Suggested next step
