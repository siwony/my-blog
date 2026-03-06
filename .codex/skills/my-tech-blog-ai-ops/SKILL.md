---
name: my-tech-blog-ai-ops
description: "AI 작업자가 my-tech-blog에서 코드·문서·스타일·배포 작업을 할 때 docs/ai 허브, 체크리스트, 테스트 절차를 따르도록 안내하는 스킬."
---

# My Tech Blog AI Ops

## Quick start
1. `docs/ai/README.md` → `CHECKLIST.md` → `TASK_PLAYBOOK.md` 순으로 확인
2. 세부 문서는 `docs/ai/DOC_MAP.yml` 참고 후 필요 파일을 직접 열어 확인
3. 변경 전후로 관련 테스트/빌드 명령을 실행하고 결과를 기록

## When to use
- 이 레포에서 기능 추가·버그 수정·스타일/Web Components 수정·문서 업데이트·빌드/배포 설정 변경을 수행할 때
- 커밋/테스트/메타데이터 규칙이 필요할 때

## Core workflows (요약)
### 코드 기능 추가·버그 수정
- 먼저 `docs/architecture/SYSTEM_ARCHITECTURE.md`와 관련 스펙(`docs/features/PRISM_FEATURES.md`, `docs/features/WEB_COMPONENTS.md`)을 확인
- 작은 단위로 구현→테스트 추가/수정→커밋 분리
- 최소 테스트: `npm test` (필요 시 `npm run test:coverage`), `bundle exec jekyll build --config _config.yml,_config_development.yml`

### 스타일/CSS/웹 컴포넌트
- 참고: `docs/features/WEB_COMPONENTS.md`, `docs/guidelines/CSS_CONFLICT_PREVENTION.md`, `docs/TYPOGRAPHY_SYSTEM.md`
- CSS 변수/네임스페이스 확인, 모바일·데스크톱 시각 확인
- 최소 테스트: `npm test` + `bundle exec jekyll build --config _config.yml,_config_development.yml`

### 문서 전용 업데이트
- 메타데이터 규칙: `docs/guidelines/MARKDOWN_METADATA.md`
- 인덱스 동기화: `docs/README.md`와 해당 섹션 README, 필요 시 `docs/ai/DOC_MAP.yml`
- 최소 테스트: `bundle exec jekyll build --config _config.yml,_config_development.yml`

### 빌드/배포/CI 설정
- 참고: `docs/architecture/DEPLOYMENT_ENVIRONMENTS.md`, `docs/architecture/PRISM_DEPLOYMENT.md`
- 변경 시 환경 변수/롤백 포인트를 문서에 명시
- 최소 테스트: `bundle exec jekyll build --config _config.yml,_config_production.yml`

## Reference map (경로만)
- Hub: `docs/ai/README.md`, `docs/ai/CHECKLIST.md`, `docs/ai/TASK_PLAYBOOK.md`, `docs/ai/DOC_MAP.yml`
- Guidelines: `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md`, `docs/guidelines/MARKDOWN_METADATA.md`, `docs/guidelines/PERFORMANCE_GUIDELINES.md`, `docs/guidelines/CSS_CONFLICT_PREVENTION.md`, `docs/guidelines/TESTING_STRATEGY.md`
- Architecture: `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/DEPLOYMENT_ENVIRONMENTS.md`
- Features: `docs/features/PRISM_FEATURES.md`, `docs/features/SPEC_PRISM_HIGHLIGHTING.md`, `docs/features/WEB_COMPONENTS.md`

## Rules & conventions
- `AI_DEVELOPMENT_GUIDELINES.md`의 원칙 준수: 원자적 커밋, 코드/문서 분리, 아키텍처 문서 즉시 업데이트
- Front Matter는 `MARKDOWN_METADATA.md` 규칙 사용
- 레포가 단일 진실의 원천: 기억보다 문서를 직접 열어 확인하고, 노트/PR에는 참고한 경로를 남김

## Commands (자주 사용)
```bash
npm test
npm run test:coverage           # 커버리지 영향 시
bundle exec jekyll build --config _config.yml,_config_development.yml
bundle exec jekyll build --config _config.yml,_config_production.yml  # 배포/설정 변경 시
```
