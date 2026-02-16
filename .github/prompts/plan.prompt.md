---
description: Generate an implementation plan from a feature specification, producing architecture decisions and task breakdown.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`
2. **REQUIRED**: Review related documentation:
   - `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state
   - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - Performance standards

## Project Context

Jekyll ~4.3 기반 기술 블로그:
- **구조**: `_layouts/`, `_posts/`, `_plugins/`, `assets/js/`, `assets/css/`, `tests/`
- **빌드**: Gulp(CSS/JS minify, Prism 번들링, Critical CSS), esbuild(JS 번들링)
- **테스트**: Jest 29.7.0 (jsdom), `tests/` 디렉토리
- **배포**: GitHub Actions → AWS S3 + CloudFront
- **개발**: `./dev.sh serve` (포트 4000), `npm test`

## Planning Workflow

1. **명세서 분석**:
   - `docs/features/` 에서 대상 명세서 로딩
   - 기능 요구사항, 비기능 요구사항, 성공 기준 파악
   - 기술적 제약 및 의존성 확인

2. **아키텍처 결정**:
   - 영향받는 레이어 식별 (Jekyll 빌드, 프론트엔드, 빌드 파이프라인, 테스트)
   - 기존 컴포넌트와의 통합 방식 결정
   - 파일 구조 및 네이밍 계획
   - 성능 영향 평가 (`docs/guidelines/PERFORMANCE_GUIDELINES.md` 기준)

3. **구현 계획 작성** (명세서 파일에 `## Implementation Plan` 섹션 추가):
   - **Phase 1: Setup** - 의존성, 설정, 기본 구조
   - **Phase 2: Core** - 핵심 기능 구현
   - **Phase 3: Integration** - 기존 시스템과의 통합
   - **Phase 4: Testing** - 테스트 작성 및 검증
   - **Phase 5: Polish** - 최적화, 문서화

4. **태스크 분해**:
   - 각 Phase별 구체적인 태스크 목록 생성
   - 태스크 간 의존성 명시
   - 병렬 실행 가능한 태스크 표시 `[P]`
   - 각 태스크에 예상 영향 파일 명시

5. **MANDATORY Post-Work Actions**:
   - Commit planning artifacts atomically
   - Update `docs/architecture/SYSTEM_ARCHITECTURE.md` if new architecture decisions
   - Update relevant feature documentation in `docs/features/`

6. Report results with:
   - Generated artifacts summary
   - Phase별 태스크 수
   - Confirmation of guideline compliance
