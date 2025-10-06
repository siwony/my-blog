# Prism.js Jest 테스트 가이드

이 가이드는 Jest를 사용한 Prism.js syntax highlighting 테스트 환경에 대해 설명합니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 테스트 실행
```bash
# 모든 테스트 실행
npm test

# Watch 모드로 실행 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지와 함께 실행
npm run test:coverage

# CI 환경용 실행
npm run test:ci
```

### 3. 커스텀 테스트 러너 사용
```bash
# 상세한 보고서와 함께 실행
node scripts/test-runner.js
```

## 📁 파일 구조

```
tests/
├── setup.js                 # Jest 환경 설정
├── prism.test.js            # 기본 기능 테스트
├── prism-integration.test.js # 통합 테스트
├── prism-performance.test.js # 성능 및 접근성 테스트
└── coverage/                # 커버리지 리포트

scripts/
└── test-runner.js           # 커스텀 테스트 러너

.github/workflows/
└── test.yml                 # GitHub Actions CI 설정
```

## 🧪 테스트 종류

### 1. 기본 기능 테스트 (`prism.test.js`)
- Prism.js 라이브러리 로딩 확인
- 필수 플러그인 존재 확인
- 언어 지원 확인
- 코드 블록 감지
- 문법 하이라이팅 적용
- 라인 번호 기능

### 2. 통합 테스트 (`prism-integration.test.js`)
- 페이지 초기화 시나리오
- 다양한 언어 코드 샘플 처리
- 에러 상황 처리
- 실제 사용 시나리오 시뮬레이션

### 3. 성능 테스트 (`prism-performance.test.js`)
- 대용량 코드 처리 성능
- 메모리 사용량 테스트
- 접근성 (a11y) 테스트
- 브라우저 호환성 테스트

## 📊 커버리지 목표

- **라인 커버리지**: 90% 이상
- **함수 커버리지**: 95% 이상
- **브랜치 커버리지**: 85% 이상

## 🔧 설정 파일

### package.json
```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "testMatch": ["<rootDir>/tests/**/*.test.js"],
    "collectCoverageFrom": [
      "assets/js/**/*.js",
      "!assets/js/prism-test.js"
    ]
  }
}
```

### Jest 설정 특징
- **jsdom 환경**: 브라우저 DOM API 시뮬레이션
- **Prism.js 모킹**: 실제 라이브러리 없이 테스트
- **자동 커버리지**: 모든 JavaScript 파일 분석

## 🛠️ 모킹 (Mocking)

### Prism.js 모킹
```javascript
global.Prism = {
    plugins: {
        autoloader: { languages_path: '' },
        lineNumbers: true,
        toolbar: true,
        copyToClipboard: true
    },
    highlightAll: jest.fn(),
    highlight: jest.fn(),
    languages: { /* 지원 언어들 */ }
};
```

### DOM 헬퍼 함수들
```javascript
// 코드 블록 생성
global.createCodeBlock = (language, code) => { /* ... */ };

// 하이라이팅된 코드 블록 생성
global.createHighlightedCodeBlock = (language, code) => { /* ... */ };

// 테스트 페이지 설정
global.setupTestPage = () => { /* ... */ };
```

## 📈 CI/CD 통합

### GitHub Actions
- **다중 Node.js 버전** 테스트 (16.x, 18.x, 20.x)
- **자동 커버리지** 업로드 (Codecov)
- **ESLint** 코드 품질 검사
- **Prettier** 코드 포맷팅 검사

### 로컬 개발
```bash
# 테스트 감시 모드 (개발 중 권장)
npm run test:watch

# 커버리지 확인
npm run test:coverage

# 전체 리포트 생성
node scripts/test-runner.js
```

## 🐛 디버깅

### 테스트 디버깅
```bash
# 특정 테스트만 실행
npm test -- --testNamePattern="Prism.js 기본 기능"

# 자세한 출력
npm test -- --verbose

# 실패한 테스트만 재실행
npm test -- --onlyFailures
```

### Jest 디버깅 옵션
```javascript
// 개별 테스트에 집중
test.only('이 테스트만 실행', () => {
    // 테스트 코드
});

// 테스트 건너뛰기
test.skip('이 테스트는 건너뛰기', () => {
    // 테스트 코드
});
```

## 📝 테스트 작성 가이드

### 1. 기본 패턴
```javascript
describe('테스트 그룹', () => {
    beforeEach(() => {
        // 각 테스트 전 실행
        setupTestPage();
    });

    test('구체적인 기능 테스트', () => {
        // Given
        const codeBlock = createCodeBlock('javascript', 'function test() {}');
        
        // When
        document.body.appendChild(codeBlock);
        
        // Then
        expect(codeBlock.querySelector('code')).toBeDefined();
    });
});
```

### 2. 비동기 테스트
```javascript
test('비동기 기능 테스트', async () => {
    const promise = new Promise(resolve => {
        setTimeout(() => resolve('done'), 100);
    });
    
    await expect(promise).resolves.toBe('done');
});
```

### 3. 모킹 검증
```javascript
test('함수 호출 확인', () => {
    // Prism.highlightAll이 호출되었는지 확인
    expect(Prism.highlightAll).toHaveBeenCalled();
    expect(Prism.highlightAll).toHaveBeenCalledTimes(1);
});
```

## 🎯 베스트 프랙티스

1. **명확한 테스트명**: 무엇을 테스트하는지 명확히 작성
2. **독립적인 테스트**: 각 테스트는 다른 테스트에 의존하지 않음
3. **적절한 모킹**: 외부 의존성은 모킹으로 처리
4. **엣지 케이스**: 경계값과 예외 상황도 테스트
5. **성능 고려**: 테스트 실행 시간도 중요한 요소

## 🚨 문제 해결

### 일반적인 문제들

1. **DOM 관련 오류**
   ```bash
   # jsdom 환경 확인
   npm test -- --testEnvironment=jsdom
   ```

2. **모킹 문제**
   ```javascript
   // setup.js에서 모킹 확인
   console.log('Prism mock:', global.Prism);
   ```

3. **비동기 테스트 실패**
   ```javascript
   // 적절한 대기 시간 설정
   await new Promise(resolve => setTimeout(resolve, 100));
   ```

## 📚 추가 자료

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)