---
description: Perform a non-destructive cross-artifact consistency and quality analysis across feature spec, plan, and tasks.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`
2. **REQUIRED**: Review related documentation:
   - `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state
   - `docs/guidelines/TESTING_STRATEGY.md` - Testing standards

## Analysis Workflow

Goal: 기능 명세서, 구현 계획, 태스크 목록 간의 일관성, 중복, 모호성, 누락 사항을 식별합니다.

**STRICTLY READ-ONLY**: 파일을 수정하지 않습니다. 구조화된 분석 리포트만 출력합니다.

1. **아티팩트 로딩**:
   - `docs/features/` 에서 대상 명세서 로딩
   - 명세서 내 구현 계획 및 태스크 목록 파싱
   - 기존 구현 코드와 대조 (해당되는 경우)

2. **분석 카테고리**:
   - **중복 탐지**: 유사/중복 요구사항 식별
   - **모호성 탐지**: 측정 기준 없는 모호한 표현 (빠른, 안정적, 직관적 등)
   - **미명세**: 동사만 있고 측정 가능한 결과가 없는 요구사항
   - **커버리지 갭**: 태스크에 매핑되지 않은 요구사항, 요구사항 없는 태스크
   - **비일관성**: 용어 차이, 데이터 모델 불일치, 태스크 순서 모순
   - **프로젝트 정합성**: 기존 아키텍처/가이드라인과의 충돌

3. **심각도 분류**:
   - **CRITICAL**: 핵심 요구사항 누락, 요구사항 간 충돌
   - **HIGH**: 중복 요구사항, 테스트 불가능한 기준
   - **MEDIUM**: 용어 불일치, 비기능 태스크 누락
   - **LOW**: 문체 개선, 경미한 중복

4. **분석 리포트 출력**:

   ### Analysis Report
   | ID | Category | Severity | Location | Summary | Recommendation |
   |----|----------|----------|----------|---------|----------------|

   ### Coverage Summary
   | Requirement | Has Task? | Task IDs | Notes |
   
   ### Metrics
   - Total Requirements / Total Tasks
   - Coverage % 
   - Ambiguity Count / Critical Issues Count

5. **Next Actions**:
   - CRITICAL 이슈가 있으면: 구현 전 해결 권장
   - LOW/MEDIUM만 있으면: 구현 진행 가능, 개선 제안 제공
   - 구체적인 수정 명령어 제안

Behavior rules:
- NEVER modify files
- 발견사항이 없으면 성공 리포트 + 커버리지 통계 출력
- 최대 50개 발견사항, 초과분은 요약 처리
