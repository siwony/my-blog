# 🧪 Jest Testing Guide# Prism.js Jest 테스트 가이드



My Tech Blog의 Jest 테스트 시스템에 대한 종합 가이드입니다.이 가이드는 Jest를 사용한 Prism.js syntax highlighting 테스트 환경에 대해 설명합니다.



## 📋 목차## 🚀 빠른 시작



- [테스트 개요](#테스트-개요)### 1. 의존성 설치

- [테스트 구조](#테스트-구조)```bash

- [테스트 실행](#테스트-실행)npm install

- [테스트 작성](#테스트-작성)```

- [커버리지](#커버리지)

- [CI/CD 통합](#cicd-통합)### 2. 테스트 실행

```bash

## 🎯 테스트 개요# 모든 테스트 실행

npm test

### 테스트 철학

- **신뢰성**: 핵심 기능의 안정성 보장# Watch 모드로 실행 (파일 변경 시 자동 재실행)

- **간소성**: 복잡한 E2E 테스트 대신 효과적인 단위 테스트npm run test:watch

- **유지보수성**: 쉽게 이해하고 수정할 수 있는 테스트

# 커버리지와 함께 실행

### 테스트 범위npm run test:coverage

- ✅ **Prism.js 구문 하이라이팅** - 코드 블록 렌더링 및 기능

- ✅ **블로그 핵심 기능** - 카테고리 시스템, 명령 팔레트, 레이아웃# CI 환경용 실행

- ✅ **파일 구조 검증** - 필수 파일 존재 및 구조 확인npm run test:ci

- ✅ **설정 무결성** - Jekyll 설정 및 front matter 검증```



## 📁 테스트 구조### 3. 커스텀 테스트 러너 사용

```bash

```# 상세한 보고서와 함께 실행

tests/node scripts/test-runner.js

├── setup.js                  # Jest 전역 설정```

├── blog-features.test.js      # 블로그 핵심 기능 테스트

├── prism.test.js             # Prism.js 단위 테스트## 📁 파일 구조

├── prism-integration.test.js  # Prism.js 통합 테스트

└── coverage/                 # 커버리지 리포트```

    ├── html/                 # HTML 리포트tests/

    └── lcov-report/          # LCOV 리포트├── setup.js                 # Jest 환경 설정

```├── prism.test.js            # 기본 기능 테스트

├── prism-integration.test.js # 통합 테스트

## 🚀 테스트 실행├── prism-performance.test.js # 성능 및 접근성 테스트

└── coverage/                # 커버리지 리포트

### 기본 명령어

scripts/

```bash└── test-runner.js           # 커스텀 테스트 러너

# 모든 테스트 실행

npm test.github/workflows/

└── test.yml                 # GitHub Actions CI 설정

# 테스트 감시 모드 (개발 시 유용)```

npm run test:watch

## 🧪 테스트 종류

# 커버리지 포함 테스트

npm run test:coverage### 1. 기본 기능 테스트 (`prism.test.js`)

- Prism.js 라이브러리 로딩 확인

# CI 환경용 테스트 (감시 모드 비활성화)- 필수 플러그인 존재 확인

npm run test:ci- 언어 지원 확인

```- 코드 블록 감지

- 문법 하이라이팅 적용

### 특정 테스트 파일 실행- 라인 번호 기능



```bash### 2. 통합 테스트 (`prism-integration.test.js`)

# 블로그 기능만 테스트- 페이지 초기화 시나리오

npm test blog-features- 다양한 언어 코드 샘플 처리

- 에러 상황 처리

# Prism.js 관련 테스트만 실행- 실제 사용 시나리오 시뮬레이션

npm test prism

### 3. 성능 테스트 (`prism-performance.test.js`)

# 특정 테스트 케이스 실행- 대용량 코드 처리 성능

npm test -- --testNamePattern="should have search data"- 메모리 사용량 테스트

```- 접근성 (a11y) 테스트

- 브라우저 호환성 테스트

### 디버깅 모드

## 📊 커버리지 목표

```bash

# 자세한 출력으로 테스트 실행- **라인 커버리지**: 90% 이상

npm test -- --verbose- **함수 커버리지**: 95% 이상

- **브랜치 커버리지**: 85% 이상

# 실패한 테스트만 재실행

npm test -- --onlyFailures## 🔧 설정 파일



# 특정 패턴으로 테스트 필터링### package.json

npm test -- --testPathPattern=prism```json

```{

  "jest": {

## 📝 테스트 작성    "testEnvironment": "jsdom",

    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],

### 1. 블로그 기능 테스트 (`blog-features.test.js`)    "testMatch": ["<rootDir>/tests/**/*.test.js"],

    "collectCoverageFrom": [

#### 검색 데이터 테스트      "assets/js/**/*.js",

```javascript      "!assets/js/prism-test.js"

describe('Search Data', () => {    ]

  test('should have search data file', () => {  }

    const searchDataPath = path.join(__dirname, '..', 'assets', 'js', 'search-data.json');}

    expect(fs.existsSync(searchDataPath)).toBe(true);```

    

    const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf8'));### Jest 설정 특징

    expect(Array.isArray(searchData)).toBe(true);- **jsdom 환경**: 브라우저 DOM API 시뮬레이션

    - **Prism.js 모킹**: 실제 라이브러리 없이 테스트

    if (searchData.length > 0) {- **자동 커버리지**: 모든 JavaScript 파일 분석

      const firstItem = searchData[0];

      expect(firstItem).toHaveProperty('title');## 🛠️ 모킹 (Mocking)

      expect(firstItem).toHaveProperty('url');

      expect(firstItem).toHaveProperty('category');### Prism.js 모킹

    }```javascript

  });global.Prism = {

});    plugins: {

```        autoloader: { languages_path: '' },

        lineNumbers: true,

#### 카테고리 시스템 테스트        toolbar: true,

```javascript        copyToClipboard: true

describe('Category System', () => {    },

  test('should have category pages', () => {    highlightAll: jest.fn(),

    const categoryDir = path.join(__dirname, '..', 'category');    highlight: jest.fn(),

    expect(fs.existsSync(categoryDir)).toBe(true);    languages: { /* 지원 언어들 */ }

    };

    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.html'));```

    expect(files.length).toBeGreaterThan(0);

  });### DOM 헬퍼 함수들

});```javascript

```// 코드 블록 생성

global.createCodeBlock = (language, code) => { /* ... */ };

### 2. Prism.js 테스트 (`prism.test.js`)

// 하이라이팅된 코드 블록 생성

#### DOM 환경 테스트global.createHighlightedCodeBlock = (language, code) => { /* ... */ };

```javascript

describe('Prism.js Core Functions', () => {// 테스트 페이지 설정

  test('should highlight code blocks', () => {global.setupTestPage = () => { /* ... */ };

    document.body.innerHTML = ````

      <pre><code class="language-javascript">

        console.log('Hello World');## 📈 CI/CD 통합

      </code></pre>

    `;### GitHub Actions

    - **다중 Node.js 버전** 테스트 (16.x, 18.x, 20.x)

    Prism.highlightAll();- **자동 커버리지** 업로드 (Codecov)

    - **ESLint** 코드 품질 검사

    const codeBlock = document.querySelector('code');- **Prettier** 코드 포맷팅 검사

    expect(codeBlock.children.length).toBeGreaterThan(0);

  });### 로컬 개발

});```bash

```# 테스트 감시 모드 (개발 중 권장)

npm run test:watch

### 3. 파일 구조 검증

# 커버리지 확인

#### 필수 파일 존재 확인npm run test:coverage

```javascript

test('should have required files', () => {# 전체 리포트 생성

  const requiredFiles = [node scripts/test-runner.js

    '_config.yml',```

    'index.html',

    '_layouts/default.html',## 🐛 디버깅

    'assets/css/style.css'

  ];### 테스트 디버깅

  ```bash

  requiredFiles.forEach(file => {# 특정 테스트만 실행

    const filePath = path.join(__dirname, '..', file);npm test -- --testNamePattern="Prism.js 기본 기능"

    expect(fs.existsSync(filePath)).toBe(true);

  });# 자세한 출력

});npm test -- --verbose

```

# 실패한 테스트만 재실행

## 📊 커버리지npm test -- --onlyFailures

```

### 커버리지 설정

### Jest 디버깅 옵션

Jest 설정에서 커버리지 대상 지정:```javascript

// 개별 테스트에 집중

```jsontest.only('이 테스트만 실행', () => {

{    // 테스트 코드

  "collectCoverageFrom": [});

    "assets/js/**/*.js",

    "scripts/**/*.rb",// 테스트 건너뛰기

    "!assets/js/prism-test.js"test.skip('이 테스트는 건너뛰기', () => {

  ],    // 테스트 코드

  "coverageDirectory": "tests/coverage",});

  "coverageReporters": ["text", "lcov", "html"]```

}

```## 📝 테스트 작성 가이드



### 커버리지 리포트 확인### 1. 기본 패턴

```javascript

```bashdescribe('테스트 그룹', () => {

# 커버리지 실행 후 HTML 리포트 보기    beforeEach(() => {

npm run test:coverage        // 각 테스트 전 실행

open tests/coverage/index.html        setupTestPage();

```    });



### 커버리지 기준    test('구체적인 기능 테스트', () => {

        // Given

| 파일 유형 | 목표 커버리지 | 현재 상태 |        const codeBlock = createCodeBlock('javascript', 'function test() {}');

|----------|-------------|----------|        

| JavaScript | 70%+ | 측정 중 |        // When

| 기능 테스트 | 100% | ✅ 달성 |        document.body.appendChild(codeBlock);

| 구조 테스트 | 100% | ✅ 달성 |        

        // Then

## 🔧 테스트 환경 설정        expect(codeBlock.querySelector('code')).toBeDefined();

    });

### Jest 설정 (`package.json`)});

```

```json

{### 2. 비동기 테스트

  "jest": {```javascript

    "testEnvironment": "jsdom",test('비동기 기능 테스트', async () => {

    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],    const promise = new Promise(resolve => {

    "testMatch": ["<rootDir>/tests/**/*.test.js"],        setTimeout(() => resolve('done'), 100);

    "collectCoverageFrom": [    });

      "assets/js/**/*.js",    

      "scripts/**/*.rb",    await expect(promise).resolves.toBe('done');

      "!assets/js/prism-test.js"});

    ],```

    "coverageDirectory": "tests/coverage"

  }### 3. 모킹 검증

}```javascript

```test('함수 호출 확인', () => {

    // Prism.highlightAll이 호출되었는지 확인

### 전역 설정 (`tests/setup.js`)    expect(Prism.highlightAll).toHaveBeenCalled();

    expect(Prism.highlightAll).toHaveBeenCalledTimes(1);

```javascript});

// DOM 환경 초기화```

beforeEach(() => {

  document.body.innerHTML = '';## 🎯 베스트 프랙티스

  

  // Prism 모킹1. **명확한 테스트명**: 무엇을 테스트하는지 명확히 작성

  global.Prism.highlightAll.mockClear();2. **독립적인 테스트**: 각 테스트는 다른 테스트에 의존하지 않음

  global.Prism.highlightElement.mockClear();3. **적절한 모킹**: 외부 의존성은 모킹으로 처리

});4. **엣지 케이스**: 경계값과 예외 상황도 테스트

5. **성능 고려**: 테스트 실행 시간도 중요한 요소

// 전역 모킹

global.Prism = {## 🚨 문제 해결

  highlightAll: jest.fn(),

  highlightElement: jest.fn(),### 일반적인 문제들

  plugins: {

    autoloader: {1. **DOM 관련 오류**

      languages_path: '/mock/path/'   ```bash

    }   # jsdom 환경 확인

  }   npm test -- --testEnvironment=jsdom

};   ```

```

2. **모킹 문제**

## 🚀 CI/CD 통합   ```javascript

   // setup.js에서 모킹 확인

### GitHub Actions 워크플로우   console.log('Prism mock:', global.Prism);

   ```

```yaml

name: Tests3. **비동기 테스트 실패**

on: [push, pull_request]   ```javascript

   // 적절한 대기 시간 설정

jobs:   await new Promise(resolve => setTimeout(resolve, 100));

  test:   ```

    runs-on: ubuntu-latest

    ## 📚 추가 자료

    steps:

    - uses: actions/checkout@v3- [Jest 공식 문서](https://jestjs.io/docs/getting-started)

    - [Testing Library](https://testing-library.com/)

    - name: Setup Node.js- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./tests/coverage/lcov.info
```

### 로컬 CI 시뮬레이션

```bash
# CI 환경과 동일한 조건으로 테스트
npm run test:ci

# 빌드 + 테스트 전체 과정
npm install
bundle install
bundle exec jekyll build
npm run test:ci
```

## 🛠️ 트러블슈팅

### 자주 발생하는 문제

#### 1. Jest 환경 오류
```bash
# 문제: ReferenceError: document is not defined
# 해결: 테스트 파일 상단에 환경 설정 추가
/**
 * @jest-environment jsdom
 */
```

#### 2. 모킹 실패
```bash
# 문제: Cannot read property of undefined
# 해결: setup.js에서 전역 객체 초기화 확인
global.Prism = { /* 모킹 객체 */ };
```

#### 3. 파일 경로 오류
```bash
# 문제: ENOENT: no such file or directory
# 해결: 절대 경로 사용
const filePath = path.join(__dirname, '..', 'relative/path');
```

#### 4. 비동기 테스트 실패
```javascript
// 문제: 비동기 작업이 완료되기 전에 테스트 종료
// 해결: async/await 사용
test('async test', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expected);
});
```

### 디버깅 팁

#### 1. 상세한 오류 정보 확인
```bash
npm test -- --verbose --no-cache
```

#### 2. 특정 테스트만 실행
```bash
npm test -- --testNamePattern="specific test name"
```

#### 3. 감시 모드로 개발
```bash
npm run test:watch
# 파일 저장 시 자동으로 관련 테스트 재실행
```

#### 4. 커버리지로 누락 확인
```bash
npm run test:coverage
# 커버되지 않은 코드 라인 확인
```

## 📈 테스트 개선 계획

### 단기 목표
- [ ] JavaScript 커버리지 70% 달성
- [ ] 성능 테스트 추가
- [ ] 접근성 테스트 도입

### 장기 목표
- [ ] 시각적 회귀 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 성능 벤치마크 테스트

## 🤝 기여 가이드라인

### 새 테스트 추가 시

1. **테스트 명명 규칙**
   ```javascript
   // Good
   test('should render code block with syntax highlighting', () => {});
   
   // Bad  
   test('test1', () => {});
   ```

2. **테스트 구조**
   ```javascript
   describe('Feature Group', () => {
     beforeEach(() => {
       // 각 테스트 전 설정
     });
     
     test('should do specific thing', () => {
       // Arrange
       const input = setupInput();
       
       // Act
       const result = performAction(input);
       
       // Assert
       expect(result).toBe(expected);
     });
   });
   ```

3. **문서화**
   - 복잡한 테스트는 주석으로 설명
   - 모킹 이유 명시
   - 예상 결과 설명

### Pull Request 전 체크리스트

- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 커버리지 감소하지 않음 (`npm run test:coverage`)
- [ ] 새 기능에 대한 테스트 추가
- [ ] 문서 업데이트 (필요 시)

---

**💡 팁**: 테스트는 코드의 품질을 보장하는 안전망입니다. 작은 단위로 자주 실행하여 문제를 조기에 발견하세요!