---
description: Create or update the project development principles and guidelines documentation.
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

Jekyll ~4.3 기반 기술 블로그의 개발 원칙 및 가이드라인을 관리합니다.

현재 가이드라인 문서:
- `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` - AI 개발 작업 필수 지침
- `docs/guidelines/PERFORMANCE_GUIDELINES.md` - 성능 최적화 가이드
- `docs/guidelines/TESTING_STRATEGY.md` - Jest 테스팅 전략
- `docs/guidelines/CSS_CONFLICT_PREVENTION.md` - CSS 충돌 방지
- `docs/guidelines/MARKDOWN_METADATA.md` - Markdown 메타데이터 표준

## Guidelines Update Workflow

1. **현재 상태 분석**:
   - 기존 가이드라인 문서 전체 읽기
   - 사용자 요청과 현재 문서 간 차이 파악
   - 프로젝트 실제 코드와 가이드라인의 정합성 확인

2. **원칙 수집/정리**:
   - 사용자 입력에서 원칙 추출
   - 기존 레포 컨텍스트(README, docs, 코드)에서 추론
   - 각 원칙은 명확하고 측정 가능해야 함 (모호한 표현 금지)

3. **가이드라인 업데이트**:
   - 적절한 가이드라인 문서에 내용 추가/수정
   - 새로운 카테고리가 필요하면 `docs/guidelines/` 에 새 파일 생성
   - 파일 명명: `UPPER_SNAKE_CASE.md`

4. **일관성 검증**:
   - 가이드라인 간 충돌 확인
   - `docs/architecture/SYSTEM_ARCHITECTURE.md`와의 정합성 확인
   - 기존 코드가 새 가이드라인을 위반하는지 점검

5. **MANDATORY Post-Work Actions**:
   - Commit changes atomically with descriptive message
   - Update `docs/architecture/SYSTEM_ARCHITECTURE.md` if system principles changed
   - Update `docs/guidelines/README.md` index if new documents added

6. Output summary:
   - 변경된 가이드라인 목록
   - 일관성 검증 결과
   - Suggested commit message
