# 🤖 AI Development Prompts Index

이 디렉토리는 AI 개발 워크플로우를 위한 프롬프트 모음입니다.
**모든 프롬프트는 `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`를 필수적으로 따릅니다.**

## ⚠️ 필수 준수 사항

**모든 AI 작업 전에 반드시 확인해야 할 문서:**
1. [`docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`](../../docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md) - **필수 지침**
2. [`docs/architecture/SYSTEM_ARCHITECTURE.md`](../../docs/architecture/SYSTEM_ARCHITECTURE.md) - 시스템 구조

### 🎨 스타일 가이드
- [`docs/TYPOGRAPHY_SYSTEM.md`](../../docs/TYPOGRAPHY_SYSTEM.md) - **타이포그래피 토큰 시스템** (CSS 작업 시 필수)

## 📋 프롬프트 워크플로우

### 1. 🎯 Feature Development Workflow

#### [`specify.prompt.md`](./specify.prompt.md)
- **목적**: 자연어 기능 설명을 구조화된 명세서로 변환
- **연동 문서**: `SYSTEM_ARCHITECTURE`, `features/*`
- **출력**: 기능 명세서 (`docs/features/*.md`)

#### [`clarify.prompt.md`](./clarify.prompt.md)
- **목적**: 명세서의 모호한 부분을 질문으로 명확화
- **연동 문서**: `SYSTEM_ARCHITECTURE`
- **출력**: 명확화된 명세서

#### [`plan.prompt.md`](./plan.prompt.md)
- **목적**: 명세서를 바탕으로 구현 계획 생성
- **연동 문서**: `SYSTEM_ARCHITECTURE`, `PERFORMANCE_GUIDELINES`
- **출력**: 구현 계획 (Phase별 태스크 분해)

#### [`tasks.prompt.md`](./tasks.prompt.md)
- **목적**: 계획을 실행 가능한 태스크로 분해
- **연동 문서**: `TESTING_STRATEGY`, `PERFORMANCE_GUIDELINES`, `SYSTEM_ARCHITECTURE`
- **출력**: 의존성 정렬된 태스크 목록

#### [`implement.prompt.md`](./implement.prompt.md)
- **목적**: 태스크 목록을 바탕으로 실제 구현 수행
- **연동 문서**: `TESTING_STRATEGY`, `PERFORMANCE_GUIDELINES`, `SYSTEM_ARCHITECTURE`, `TYPOGRAPHY_SYSTEM`
- **출력**: 구현된 코드 및 테스트

### 2. 🔍 Quality Assurance

#### [`analyze.prompt.md`](./analyze.prompt.md)
- **목적**: 명세서, 계획, 태스크 간 일관성 분석
- **연동 문서**: `SYSTEM_ARCHITECTURE`, `TESTING_STRATEGY`
- **출력**: 분석 리포트 및 개선 권장사항

### 3. 🏗️ Project Governance

#### [`constitution.prompt.md`](./constitution.prompt.md)
- **목적**: 프로젝트 개발 원칙 및 가이드라인 업데이트
- **연동 문서**: `SYSTEM_ARCHITECTURE`, `PERFORMANCE_GUIDELINES`
- **출력**: 업데이트된 가이드라인 문서

### 4. 🤖 Global Instructions

#### [`copilot-instructions.md`](./copilot-instructions.md)
- **목적**: GitHub Copilot에 프로젝트 컨텍스트 제공
- **내용**: 기술 스택, 프로젝트 구조, 필수 준수 사항

## 🔄 권장 워크플로우 순서

```
specify → clarify → plan → tasks → implement
                                       ↓
                                    analyze (선택적 품질 검증)
```

## 📁 문서 연동 매트릭스

| 프롬프트 | 필수 문서 | 업데이트 대상 |
|---------|----------|--------------|
| `specify` | SYSTEM_ARCHITECTURE | features/* |
| `clarify` | SYSTEM_ARCHITECTURE | features/* (spec) |
| `plan` | SYSTEM_ARCHITECTURE, PERFORMANCE_GUIDELINES | features/*, architecture/* |
| `tasks` | TESTING_STRATEGY, PERFORMANCE_GUIDELINES, SYSTEM_ARCHITECTURE | features/* (tasks) |
| `implement` | TESTING_STRATEGY, PERFORMANCE_GUIDELINES, SYSTEM_ARCHITECTURE, TYPOGRAPHY_SYSTEM | features/*, architecture/*, tests/* |
| `analyze` | SYSTEM_ARCHITECTURE, TESTING_STRATEGY | (read-only) |
| `constitution` | SYSTEM_ARCHITECTURE, PERFORMANCE_GUIDELINES | guidelines/* |

## 🎯 품질 보증

각 프롬프트는 다음을 보장합니다:

1. **일관성**: 모든 작업이 AI_DEVELOPMENT_GUIDELINES.md를 따름
2. **추적성**: 원자적 커밋을 통한 변경 이력 관리
3. **현행성**: 아키텍처 변경 시 관련 문서 즉시 업데이트
4. **테스트**: Jest 기반 테스트 코드 작성

---

📅 마지막 업데이트: 2026년 2월
