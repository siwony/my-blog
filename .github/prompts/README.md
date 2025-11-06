# 🤖 AI Development Prompts Index

이 디렉토리는 AI 개발 워크플로우를 위한 프롬프트 모음입니다. **모든 프롬프트는 `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`를 필수적으로 따릅니다.**

## ⚠️ 필수 준수 사항

**모든 AI 작업 전에 반드시 확인해야 할 문서:**
1. [`docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`](../docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md) - **필수 지침**
2. [`docs/guidelines/PROJECT_CONSTITUTION.md`](../docs/guidelines/PROJECT_CONSTITUTION.md) - 프로젝트 원칙
3. [`docs/architecture/SYSTEM_ARCHITECTURE.md`](../docs/architecture/SYSTEM_ARCHITECTURE.md) - 시스템 구조

## 📋 프롬프트 워크플로우

### 1. 🎯 Feature Development Workflow

#### [`specify.prompt.md`](./specify.prompt.md)
- **목적**: 자연어 기능 설명을 구조화된 명세서로 변환
- **연동 문서**: 
  - `docs/guidelines/PROJECT_CONSTITUTION.md` - 프로젝트 원칙
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
  - `docs/features/` - 기존 기능 문서
- **출력**: 기능 명세서 (spec.md)

#### [`clarify.prompt.md`](./clarify.prompt.md)
- **목적**: 명세서의 모호한 부분을 질문으로 명확화
- **연동 문서**:
  - `docs/guidelines/PROJECT_CONSTITUTION.md` - 프로젝트 원칙
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
- **출력**: 명확화된 명세서

#### [`plan.prompt.md`](./plan.prompt.md)
- **목적**: 명세서를 바탕으로 구현 계획 생성
- **연동 문서**:
  - `docs/guidelines/PROJECT_CONSTITUTION.md` - 프로젝트 원칙
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
  - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - 성능 표준
- **출력**: 구현 계획 (plan.md)

#### [`tasks.prompt.md`](./tasks.prompt.md)
- **목적**: 계획을 실행 가능한 태스크로 분해
- **연동 문서**:
  - `docs/guidelines/TESTING_STRATEGY.md` - 테스팅 접근법
  - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - 성능 표준
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
- **출력**: 태스크 목록 (tasks.md)

#### [`implement.prompt.md`](./implement.prompt.md)
- **목적**: 태스크 목록을 바탕으로 실제 구현 수행
- **연동 문서**:
  - `docs/guidelines/TESTING_STRATEGY.md` - 테스팅 접근법
  - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - 성능 표준
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
- **출력**: 구현된 코드 및 테스트

### 2. 🔍 Quality Assurance

#### [`analyze.prompt.md`](./analyze.prompt.md)
- **목적**: 명세서, 계획, 태스크 간 일관성 분석
- **연동 문서**:
  - `docs/guidelines/PROJECT_CONSTITUTION.md` - 프로젝트 원칙
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
  - `docs/guidelines/TESTING_STRATEGY.md` - 테스팅 표준
- **출력**: 분석 리포트 및 개선 권장사항

### 3. 🏗️ Project Governance

#### [`constitution.prompt.md`](./constitution.prompt.md)
- **목적**: 프로젝트 헌법 생성 및 업데이트
- **연동 문서**:
  - `docs/guidelines/PROJECT_CONSTITUTION.md` - 핵심 프로젝트 원칙
  - `docs/architecture/SYSTEM_ARCHITECTURE.md` - 현재 시스템 상태
  - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - 성능 표준
- **출력**: 업데이트된 프로젝트 헌법

## 🔄 공통 워크플로우 패턴

### 사전 작업 (모든 프롬프트 공통)
1. ✅ `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` 읽기 및 준수
2. ✅ 관련 가이드라인 문서 검토
3. ✅ 현재 아키텍처 상태 확인

### 작업 중
1. ✅ 가이드라인 준수 확인
2. ✅ 논리적 단위로 커밋
3. ✅ 테스트 코드 작성

### 사후 작업 (모든 프롬프트 공통)
1. ✅ 원자적 커밋 수행
2. ✅ 아키텍처 문서 업데이트 (변경사항 있을 시)
3. ✅ 관련 문서 업데이트
4. ✅ 가이드라인 준수 확인

## 📁 문서 연동 매트릭스

| 프롬프트 | 필수 문서 | 선택 문서 | 업데이트 대상 |
|---------|----------|----------|--------------|
| `specify` | PROJECT_CONSTITUTION, SYSTEM_ARCHITECTURE | features/* | features/* |
| `clarify` | PROJECT_CONSTITUTION, SYSTEM_ARCHITECTURE | - | spec.md |
| `plan` | PROJECT_CONSTITUTION, SYSTEM_ARCHITECTURE, PERFORMANCE_GUIDELINES | - | features/*, architecture/* |
| `tasks` | TESTING_STRATEGY, PERFORMANCE_GUIDELINES, SYSTEM_ARCHITECTURE | - | tasks.md |
| `implement` | TESTING_STRATEGY, PERFORMANCE_GUIDELINES, SYSTEM_ARCHITECTURE | - | features/*, architecture/* |
| `analyze` | PROJECT_CONSTITUTION, SYSTEM_ARCHITECTURE, TESTING_STRATEGY | - | 분석 리포트 |
| `constitution` | PROJECT_CONSTITUTION, SYSTEM_ARCHITECTURE, PERFORMANCE_GUIDELINES | - | guidelines/*, architecture/* |

## 🎯 품질 보증

각 프롬프트는 다음을 보장합니다:

1. **일관성**: 모든 작업이 AI_DEVELOPMENT_GUIDELINES.md를 따름
2. **추적성**: 원자적 커밋을 통한 변경 이력 관리
3. **현행성**: 아키텍처 변경 시 관련 문서 즉시 업데이트
4. **협업성**: 명확한 가이드라인을 통한 효율적 협업

---

⚠️ **이 프롬프트들은 AI_DEVELOPMENT_GUIDELINES.md의 필수 준수 사항을 포함합니다.**

📅 마지막 업데이트: 2025년 11월 6일