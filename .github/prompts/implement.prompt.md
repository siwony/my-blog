---
description: Execute the implementation by processing tasks from the feature plan, following TDD and atomic commits.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`
2. **REQUIRED**: Review related documentation:
   - `docs/guidelines/TESTING_STRATEGY.md` - Testing approaches
   - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - Performance standards
   - `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state
   - `docs/TYPOGRAPHY_SYSTEM.md` - **타이포그래피 토큰 시스템 (CSS 작업 시 필수)**

## Project Context

Jekyll ~4.3 기반 기술 블로그:
- **레이아웃**: `_layouts/default.html`, `_layouts/post.html`, `_layouts/category.html`
- **JS**: `assets/js/` (웹 컴포넌트, 명령 팔레트, Prism 번들)
- **CSS**: `assets/css/` (common, home, post, category - 페이지별 분할)
- **테스트**: `tests/` (Jest 29.7.0, jsdom)
- **빌드**: `gulpfile.js` (JS uglify, CSS cleanCSS, HTML minify, Prism bundling, Critical CSS)
- **개발**: `./dev.sh serve` (포트 4000), `npm test`

## Implementation Workflow

1. **컨텍스트 로딩**:
   - `docs/features/` 에서 대상 명세서, 계획, 태스크 목록 로딩
   - 영향받는 기존 파일 읽기

2. **Phase별 실행**:
   - **Setup**: 프로젝트 구조, 의존성, 설정
   - **Tests**: TDD - 테스트 먼저 작성 (`tests/` 디렉토리)
   - **Core**: 핵심 기능 구현
   - **Integration**: 기존 시스템과 통합 (레이아웃, Gulp, etc.)
   - **Polish**: 최적화, 문서화

3. **구현 규칙**:
   - 의존성 순서 준수 (순차 태스크는 순서대로)
   - 병렬 태스크 [P]는 동시 실행 가능
   - 각 태스크 완료 후 진행 상황 보고
   - 실패 시 명확한 에러 메시지와 디버깅 컨텍스트 제공

4. **코딩 표준**:
   - JavaScript: ES6+, 웹 컴포넌트는 Light DOM 사용
   - CSS: `docs/TYPOGRAPHY_SYSTEM.md` 토큰 시스템 준수, `docs/guidelines/CSS_CONFLICT_PREVENTION.md` 참조
   - Ruby: Jekyll 플러그인은 `_plugins/` 디렉토리
   - 테스트: Jest + jsdom, `tests/setup.js` 활용

5. **검증**:
   - `npm test` 실행하여 모든 테스트 통과 확인
   - `./dev.sh serve` 로 로컬에서 동작 확인
   - 성능 영향 평가 (`docs/guidelines/PERFORMANCE_GUIDELINES.md` 기준)

6. **MANDATORY Post-Work Actions** (per AI_DEVELOPMENT_GUIDELINES.md):
   - Commit changes atomically by logical units
   - Update `docs/architecture/SYSTEM_ARCHITECTURE.md` if architecture changed
   - Update `docs/features/` documentation for new features
   - Run tests and ensure they pass: `npm test`

7. Report final status with:
   - Summary of completed work
   - Test results
   - Confirmation of guideline compliance
   - Links to updated documentation
