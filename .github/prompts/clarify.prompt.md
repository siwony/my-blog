---
description: Identify underspecified areas in a feature spec by asking up to 5 targeted clarification questions and encoding answers back into the spec.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`
2. **REQUIRED**: Review `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state

## Project Context

Jekyll ~4.3 기반 기술 블로그:
- **프론트엔드**: Prism.js(로컬 번들), 웹 컴포넌트, Ninja Keys, PhotoSwipe
- **빌드**: Gulp + esbuild
- **테스트**: Jest 29.7.0 (jsdom)
- **배포**: GitHub Actions → AWS S3 + CloudFront

## Clarification Workflow

Goal: 기능 명세서의 모호하거나 누락된 부분을 발견하고, 최대 5개의 질문으로 명확화합니다.

1. **명세서 로딩**: `docs/features/` 에서 대상 명세서 파일을 읽습니다.

2. **모호성 분석** - 다음 카테고리별로 상태(Clear/Partial/Missing) 체크:
   - 기능 범위 및 동작
   - 데이터 모델
   - 사용자 인터랙션 및 UX 흐름
   - 비기능 품질 속성 (성능, 접근성)
   - 외부 의존성
   - 엣지 케이스 및 에러 처리
   - 기술적 제약 및 트레이드오프

3. **질문 생성** (최대 5개):
   - 각 질문은 아키텍처, 데이터 모델, 테스트 설계, UX 동작에 실질적 영향을 미치는 것만 포함
   - 다중 선택(2-5개 옵션) 또는 짧은 답변(5단어 이내) 형식
   - 한 번에 하나의 질문만 제시 (순차적)

4. **답변 통합**:
   - 답변 수집 후 명세서의 적절한 섹션에 즉시 반영
   - `## Clarifications` 섹션에 Q&A 기록
   - 모순되는 기존 내용은 교체 (중복 금지)

5. **검증**:
   - 해결된 모호성이 명세서에 정확히 반영되었는지 확인
   - Markdown 구조 유효성 확인

6. **MANDATORY Post-Work Actions**:
   - Commit clarification updates atomically
   - Report: 질문 수, 업데이트된 섹션, 남은 모호성 상태

Behavior rules:
- 의미있는 모호성이 없으면: "No critical ambiguities detected." 보고 후 다음 단계 제안
- 명세서가 없으면 `/specify` 먼저 실행하도록 안내
- 최대 5개 질문 초과 금지
- 사용자가 "done", "stop" 신호 시 중단
