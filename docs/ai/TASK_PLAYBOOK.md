# 🛠️ AI Task Playbook

주요 시나리오별로 **필수 참조 문서, 단계, 최소 테스트**를 정리했습니다. 공통 체크는 [`CHECKLIST.md`](./CHECKLIST.md)를 먼저 따라주세요.

## 1) 기능 추가 · 버그 수정 (코드)
- 읽을 것: `SYSTEM_ARCHITECTURE.md`, 관련 기능 스펙(`PRISM_FEATURES.md` 등), 성능/테스트 가이드라인
- 단계
  1. 영향 영역 파악 → 관련 스펙/가이드 재확인
  2. 작은 단위로 구현 후 즉시 테스트 작성/수정
  3. 커밋을 목적별로 분할 (코드/테스트/문서 분리 권장)
- 최소 테스트: `npm test` (또는 변경된 패키지 범위), 필요 시 `npm run test:coverage`

## 2) 스타일 · CSS · 웹 컴포넌트 수정
- 읽을 것: `WEB_COMPONENTS.md`, `CSS_CONFLICT_PREVENTION.md`, `TYPOGRAPHY_SYSTEM.md`
- 단계
  1. 영향 컴포넌트와 CSS 변수 확인
  2. 충돌 방지 규칙 적용, 인라인 스타일 여부 점검
  3. 뷰포트별 스냅샷 확인 (모바일/데스크톱)
- 최소 테스트: 관련 스냅샷/시각 리그레션이 없으면 `npm test` + 로컬 `bundle exec jekyll build`

## 3) 문서/가이드만 업데이트
- 읽을 것: `MARKDOWN_METADATA.md` (메타데이터 규칙), 기존 관련 가이드
- 단계
  1. 문서 신설/수정 시 인덱스(`docs/README.md`, 섹션 README) 동기화
  2. 변경 요약/적용 범위 명시, 교차 링크 추가
- 최소 테스트: `bundle exec jekyll build --config _config.yml,_config_development.yml`

## 4) 빌드·배포·CI 설정 변경
- 읽을 것: `DEPLOYMENT_ENVIRONMENTS.md`, `PRISM_DEPLOYMENT.md`
- 단계
  1. 대상 환경 변수/비밀값 영향 파악 (문서에 표기)
  2. 변경 후 로컬 빌드 및 스모크 테스트
  3. 문서에 롤백/모니터링 포인트 기록
- 최소 테스트: `bundle exec jekyll build --config _config.yml,_config_production.yml`

---
📅 마지막 업데이트: 2026-03-06
