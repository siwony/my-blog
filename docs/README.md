# 📚 Documentation

이 디렉토리는 Jekyll 기술 블로그 프로젝트의 종합적인 문서를 포함합니다.

## 📖 문서 구조

### � [Features](./features/)
시스템의 다양한 기능들에 대한 문서
- Prism.js 구문 강조 기능
- 웹 컴포넌트 및 호스팅 기능

### �️ [Architecture](./architecture/)
시스템 아키텍처와 배포 관련 문서
- 시스템 설계 및 구조
- 배포 환경 및 보안 구성

### � [Guidelines](./guidelines/)
개발, 성능, 테스팅 가이드라인
- 프로젝트 원칙 및 개발 표준
- 성능 최적화 및 테스팅 전략

## 🎯 빠른 시작

1. **AI 작업자**: [Guidelines](./guidelines/) → [`AI_DEVELOPMENT_GUIDELINES.md`](./guidelines/AI_DEVELOPMENT_GUIDELINES.md)에서 필수 준수 사항 확인 ⚠️
2. **개발자용**: [Architecture](./architecture/) → [`SYSTEM_ARCHITECTURE.md`](./architecture/SYSTEM_ARCHITECTURE.md)에서 전체 시스템 이해
3. **배포용**: [Architecture](./architecture/) → [`DEPLOYMENT_ENVIRONMENTS.md`](./architecture/DEPLOYMENT_ENVIRONMENTS.md)에서 배포 옵션 확인
4. **기능 확인**: [Features](./features/) → [`PRISM_FEATURES.md`](./features/PRISM_FEATURES.md)에서 구문 강조 기능 검토
5. **테스팅**: [Guidelines](./guidelines/) → [`TESTING_STRATEGY.md`](./guidelines/TESTING_STRATEGY.md)에서 테스트 접근법 학습

## 📝 기여 가이드

새로운 문서를 추가할 때:
1. 적절한 카테고리 디렉토리 선택 (features/architecture/guidelines)
2. 기존 네이밍 컨벤션 따르기 (UPPER_SNAKE_CASE.md)
3. 해당 카테고리의 README 인덱스 업데이트
4. 명확한 섹션 구성 및 적절한 마크다운 형식 사용
5. 다른 문서와의 크로스 레퍼런스 추가

## 🔗 관련 디렉토리

- [`/assets/css/`](../assets/css/) - 페이지별 분할 CSS (common.css, home.css, post.css, category.css)
- [`/assets/js/`](../assets/js/) - JavaScript 파일 및 웹 컴포넌트 (인라인 스타일 포함)
- [`/scripts/`](../scripts/) - 유틸리티 스크립트 및 자동화 도구
- [`/_plugins/`](../_plugins/) - Jekyll 플러그인 및 생성기
- [`/tests/`](../tests/) - 테스트 파일 및 테스팅 유틸리티

## 🎨 스타일 시스템

프로젝트는 Google PageSpeed Insights 권장사항에 따라 CSS를 최적화하여 **47-56% CSS 감소**를 달성했습니다:

- **common.css** (13KB): 모든 페이지 공통 - 글꼴, CSS 변수, 헤더/푸터
- **home.css** (7.6KB): 홈/블로그 페이지 전용
- **post.css** (16KB): 포스트 페이지 전용 (Prism.js 스타일 포함)
- **category.css** (4KB): 카테고리 페이지 전용
- **웹 컴포넌트**: 인라인 스타일 적용으로 외부 CSS 의존성 제거

자세한 내용은 [`TYPOGRAPHY_SYSTEM.md`](./TYPOGRAPHY_SYSTEM.md)를 참조하세요.

---

📅 마지막 업데이트: 2025년 1월