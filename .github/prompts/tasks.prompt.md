---
description: Generate an actionable, dependency-ordered task list for a feature based on its specification and plan.
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

## Project Context

Jekyll ~4.3 기반 기술 블로그:
- **테스트**: Jest 29.7.0 (jsdom), `tests/` 디렉토리, `npm test`
- **빌드**: Gulp + esbuild, `./dev.sh build`
- **CI/CD**: GitHub Actions (`test.yml`, `deploy.yml`)

## Task Generation Workflow

1. **컨텍스트 로딩**:
   - `docs/features/` 에서 대상 명세서 및 구현 계획 로딩
   - 기존 테스트 구조 확인 (`tests/` 디렉토리)
   - 현재 빌드 설정 확인 (`gulpfile.js`, `package.json`)

2. **태스크 생성 규칙**:
   - **Setup 태스크**: 의존성 설치, 설정 파일, 기본 구조
   - **Test 태스크 [P]**: 각 기능별 테스트 파일 (TDD)
   - **Core 태스크**: 핵심 구현 (컴포넌트, 플러그인, 스타일)
   - **Integration 태스크**: 기존 시스템 통합 (레이아웃, 빌드 파이프라인)
   - **Polish 태스크 [P]**: 최적화, 문서 업데이트

3. **의존성 기반 정렬**:
   - Setup → Tests → Core → Integration → Polish
   - 같은 파일 수정 = 순차적 (no [P])
   - 다른 파일 수정 = 병렬 가능 [P]
   - 테스트 먼저 작성 (TDD approach)

4. **태스크 형식**:
   ```
   ### T001: [태스크 제목]
   - **Phase**: Setup | Test | Core | Integration | Polish
   - **Files**: 영향받는 파일 경로
   - **Parallel**: [P] 또는 Sequential
   - **Depends on**: T000 (의존 태스크)
   - **Description**: 구체적인 작업 내용
   ```

5. **MANDATORY Post-Work Actions**:
   - Commit task breakdown atomically
   - Ensure tasks align with `docs/guidelines/TESTING_STRATEGY.md`
   - Verify tasks follow `docs/guidelines/PERFORMANCE_GUIDELINES.md`
