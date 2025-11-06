# 🤖 AI Development Guidelines

AI가 개발 작업을 수행할 때 **반드시** 따라야 하는 필수 지침입니다.

## 🎯 핵심 원칙

### 1. 📋 가이드라인 준수 (MANDATORY)

**모든 기능 개발 시 docs/guidelines를 우선 참조하고 준수해야 합니다.**

#### 필수 확인 사항:
- [ ] [`PROJECT_CONSTITUTION.md`](./PROJECT_CONSTITUTION.md) - 프로젝트 핵심 원칙
- [ ] [`PERFORMANCE_GUIDELINES.md`](./PERFORMANCE_GUIDELINES.md) - 성능 최적화 기준
- [ ] [`CSS_CONFLICT_PREVENTION.md`](./CSS_CONFLICT_PREVENTION.md) - CSS 충돌 방지 전략
- [ ] [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) - 테스팅 접근법
- [ ] [`MARKDOWN_METADATA.md`](./MARKDOWN_METADATA.md) - 문서 작성 표준

#### 작업 전 체크리스트:
1. 🔍 **가이드라인 검토**: 해당 작업과 관련된 가이드라인 문서 확인
2. 📝 **표준 준수**: 정의된 코딩 표준 및 네이밍 컨벤션 적용
3. 🧪 **테스트 계획**: 테스팅 전략에 따른 테스트 케이스 작성
4. 🚀 **성능 고려**: 성능 가이드라인에 따른 최적화 적용

### 2. 🔄 세분화된 커밋 (MANDATORY)

**모든 작업은 논리적 단위로 잘게 나누어 커밋해야 합니다.**

#### 커밋 분할 원칙:
- ✅ **하나의 목적**: 각 커밋은 하나의 명확한 목적만 가져야 함
- ✅ **원자적 변경**: 독립적으로 되돌릴 수 있는 최소 단위
- ✅ **의미있는 메시지**: 변경 내용을 명확하게 설명하는 커밋 메시지

#### 권장 커밋 패턴:
```bash
# 기능 추가
feat: Add pagination component
feat: Implement search functionality

# 버그 수정
fix: Resolve infinite loop in search plugin
fix: Fix responsive layout on mobile

# 문서 업데이트
docs: Update API documentation
docs: Add development guidelines

# 스타일 개선
style: Improve button hover effects
style: Standardize color variables

# 리팩토링
refactor: Extract utility functions
refactor: Optimize database queries

# 테스트 추가
test: Add unit tests for pagination
test: Add integration tests for search
```

#### 커밋 금지 사항:
- ❌ 여러 기능을 한 번에 커밋
- ❌ 문서와 코드를 함께 커밋 (별도 커밋 권장)
- ❌ 임시 코드나 디버깅 코드 커밋
- ❌ 모호한 커밋 메시지 ("update", "fix bug" 등)

### 3. 📚 아키텍처 문서 현행화 (MANDATORY)

**모든 아키텍처 변경 시 관련 문서를 즉시 업데이트해야 합니다.**

#### 업데이트 대상 문서:
- [`docs/architecture/SYSTEM_ARCHITECTURE.md`](../architecture/SYSTEM_ARCHITECTURE.md)
- [`docs/architecture/DEPLOYMENT_ENVIRONMENTS.md`](../architecture/DEPLOYMENT_ENVIRONMENTS.md)
- [`docs/architecture/SECURITY_HEADERS.md`](../architecture/SECURITY_HEADERS.md)

#### 문서 현행화 시점:
1. 🏗️ **시스템 구조 변경 시**: 컴포넌트 추가/제거, 데이터 플로우 변경
2. 🚀 **배포 구성 변경 시**: 새로운 환경 추가, 배포 프로세스 수정
3. 🔒 **보안 설정 변경 시**: 헤더 추가/수정, 보안 정책 변경
4. 🔧 **의존성 추가/변경 시**: 새로운 라이브러리 도입, 버전 업그레이드

#### 문서 업데이트 워크플로우:
```bash
# 1. 코드 변경
git add src/components/new-feature.js
git commit -m "feat: Add new pagination component"

# 2. 아키텍처 문서 업데이트
git add docs/architecture/SYSTEM_ARCHITECTURE.md
git commit -m "docs: Update system architecture for pagination"

# 3. 가이드라인 문서 업데이트 (필요시)
git add docs/guidelines/COMPONENT_GUIDELINES.md
git commit -m "docs: Add pagination component guidelines"
```

## 🚨 필수 준수 사항

### 작업 시작 전
1. ✅ 관련 가이드라인 문서 숙지
2. ✅ 아키텍처 문서 검토
3. ✅ 기존 코드 패턴 분석

### 작업 진행 중
1. ✅ 가이드라인 준수 확인
2. ✅ 논리적 단위로 커밋 수행
3. ✅ 테스트 코드 작성

### 작업 완료 후
1. ✅ 아키텍처 문서 업데이트
2. ✅ 가이드라인 문서 업데이트 (필요시)
3. ✅ 최종 검토 및 정리

## 🔄 예외 처리

### 긴급 수정 (Hotfix)
- 문서 업데이트는 별도 커밋으로 후속 처리 가능
- 단, 24시간 내 문서 현행화 필수

### 실험적 기능 (Experimental)
- 별도 브랜치에서 개발
- 메인 브랜치 병합 전 문서 현행화 필수

## 📋 체크리스트 템플릿

```markdown
### AI 개발 작업 체크리스트

#### 사전 준비
- [ ] 관련 가이드라인 문서 검토
- [ ] 아키텍처 문서 확인
- [ ] 기존 코드 패턴 분석

#### 개발 진행
- [ ] 가이드라인 준수
- [ ] 논리적 단위 커밋
- [ ] 테스트 코드 작성

#### 완료 후
- [ ] 아키텍처 문서 업데이트
- [ ] 가이드라인 문서 업데이트
- [ ] 최종 검토 완료
```

## 🎯 목표

이 지침을 통해 달성하고자 하는 목표:

1. **일관성**: 모든 개발 작업의 품질과 스타일 일관성 확보
2. **추적성**: 세분화된 커밋을 통한 변경 이력 명확화
3. **현행성**: 항상 최신 상태의 아키텍처 문서 유지
4. **협업성**: 명확한 가이드라인을 통한 효율적 협업

---

⚠️ **이 지침은 AI 개발 작업의 필수 준수 사항입니다.**

📅 마지막 업데이트: 2025년 11월 6일