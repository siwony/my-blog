# 🧩 웹 컴포넌트 아키텍처

이 블로그는 모던한 웹 컴포넌트 기술을 활용하여 구축되었습니다.

## CategorySidebar 컴포넌트

카테고리 사이드바는 커스텀 웹 컴포넌트로 구현되어 재사용성과 유지보수성을 향상시켰습니다.

### 특징

- ✨ **자동 렌더링** - Jekyll 데이터를 동적으로 받아 카테고리 목록 생성
- 🎯 **타입 안전성** - JSON 스키마 검증 및 에러 핸들링
- 📱 **반응형 디자인** - 인라인 스타일로 각 컴포넌트 자체 포함
- 🔄 **실시간 업데이트** - 속성 변경 시 자동 리렌더링
- 🎨 **인라인 CSS** - 96 라인의 인라인 스타일로 외부 CSS 의존성 제거

### 사용법

```html
<category-sidebar 
  categories-data='[{"name":"programming","count":5}]'
  total-posts="10">
</category-sidebar>
```

### 속성 (Attributes)

| 속성 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `categories-data` | JSON String | 카테고리 배열 데이터 | `'[{"name":"programming","count":5}]'` |
| `total-posts` | String | 전체 포스트 수 | `"10"` |

### Jekyll 통합

Jekyll 템플릿에서 동적 데이터를 전달하는 방법:

```html
<category-sidebar 
  categories-data='[{% assign categories = site.categories | sort %}{% for category in categories %}{% unless forloop.first %},{% endunless %}{"name":"{{ category[0] }}","count":{{ category[1].size }}}{% endfor %}]'
  total-posts="{{ site.posts.size }}">
</category-sidebar>
```

## 파일 구조

```
assets/js/
├── category-sidebar.js    # 웹 컴포넌트 구현
├── command-palette.js     # 명령 팔레트
└── blog-pagination.js     # 페이지네이션

tests/
├── category-sidebar.test.js  # 컴포넌트 테스트
├── blog-features.test.js     # 통합 테스트
└── setup.js                  # 테스트 환경 설정

_layouts/
├── default.html              # 컴포넌트 스크립트 로드
├── post.html                 # 포스트 레이아웃
└── category.html             # 카테고리 페이지
```

## 컴포넌트 내부 구조

### 클래스 정의
```javascript
class CategorySidebar extends HTMLElement {
  constructor() {
    super();
    this.categories = [];
    this.totalPosts = 0;
  }
  
  // 컴포넌트가 DOM에 연결될 때 실행
  connectedCallback() {
    this.render();
  }
  
  // 속성 변경을 감지할 목록
  static get observedAttributes() {
    return ['categories-data', 'total-posts'];
  }
  
  // 속성 변경 시 실행
  attributeChangedCallback(name, oldValue, newValue) {
    // 속성에 따른 처리 로직
  }
}
```

### 주요 메서드

#### `formatCategoryName(name)`
카테고리 이름을 사용자 친화적 형태로 변환합니다.
```javascript
formatCategoryName('web-development') // → 'Web Development'
```

#### `createCategoryLink(categoryName, postCount)`
카테고리 링크 HTML을 생성합니다.
```javascript
createCategoryLink('programming', 5)
// → '<li class="category-item">...</li>'
```

#### `render()`
컴포넌트의 HTML을 렌더링합니다.

### 데이터 처리

#### JSON 파싱
```javascript
setCategoriesData(data) {
  try {
    this.categories = JSON.parse(data);
    this.render();
  } catch (e) {
    console.error('Failed to parse categories data:', e);
    this.categories = [];
    this.render();
  }
}
```

#### 정렬 및 필터링
```javascript
// 카테고리를 알파벳 순으로 정렬
const sortedCategories = this.categories.sort((a, b) => 
  a.name.localeCompare(b.name)
);
```

## 스타일링

웹 컴포넌트는 Light DOM을 사용하므로 기존 CSS 스타일이 그대로 적용됩니다.

```css
/* 기존 CSS 클래스가 그대로 작동 */
.sidebar {
  background: #f8f9fa;
  padding: 1rem;
}

.category-navigation {
  margin-bottom: 1rem;
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-item {
  margin-bottom: 0.5rem;
}
```

## 테스트

### 단위 테스트
```javascript
// 카테고리 이름 포맷팅 테스트
test('should format category names correctly', () => {
  const sidebar = new CategorySidebarClass();
  expect(sidebar.formatCategoryName('web-development')).toBe('Web Development');
});

// 데이터 파싱 테스트
test('should parse and render categories data', () => {
  const sidebar = new CategorySidebarClass();
  const categoriesData = JSON.stringify([
    { name: 'programming', count: 5 }
  ]);
  
  sidebar.setCategoriesData(categoriesData);
  expect(sidebar.innerHTML).toContain('Programming');
});
```

### 테스트 실행
```bash
# 웹 컴포넌트 테스트만 실행
npm test -- tests/category-sidebar.test.js

# 모든 테스트 실행
npm test
```

## 확장 가능성

### 새로운 속성 추가
```javascript
static get observedAttributes() {
  return ['categories-data', 'total-posts', 'show-counts', 'sort-order'];
}

attributeChangedCallback(name, oldValue, newValue) {
  switch(name) {
    case 'show-counts':
      this.showCounts = newValue === 'true';
      break;
    case 'sort-order':
      this.sortOrder = newValue || 'asc';
      break;
  }
  this.render();
}
```

### 이벤트 발생
```javascript
// 카테고리 클릭 시 커스텀 이벤트 발생
createCategoryLink(categoryName, postCount) {
  return `
    <li class="category-item">
      <a href="/category/${categoryName}/" 
         onclick="this.dispatchEvent(new CustomEvent('category-selected', {
           detail: { category: '${categoryName}', count: ${postCount} },
           bubbles: true
         }))">
        ${this.formatCategoryName(categoryName)} (${postCount})
      </a>
    </li>
  `;
}
```

## 브라우저 호환성

- **모던 브라우저**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **폴리필**: 필요 시 `@webcomponents/webcomponentsjs` 사용 가능

## 성능 고려사항

- **Light DOM 사용**: Shadow DOM 오버헤드 없음
- **인라인 스타일**: 외부 CSS 의존성 제거로 FOUC 방지
- **최소한의 리렌더링**: 속성 변경 시에만 렌더링
- **작은 번들 크기**: 약 2KB (압축 후)
- **빠른 초기화**: DOM 연결 시 즉시 렌더링

### CSS 전략

웹 컴포넌트는 인라인 스타일을 사용하여 다음과 같은 이점을 얻습니다:

- **FOUC 방지**: 컴포넌트가 로드되자마자 완전한 스타일 적용
- **독립성**: 외부 CSS 파일 의존성 제거
- **번들링**: 스타일이 컴포넌트 코드에 포함되어 별도 요청 불필요
- **충돌 방지**: CSS 선택자 충돌 위험 최소화

```javascript
// category-sidebar.js - 96 lines inline CSS
render() {
  this.innerHTML = `
    <style>
      .category-navigation { /* ... */ }
      /* 전체 스타일 정의 */
    </style>
    <nav class="category-navigation">
      <!-- 컴포넌트 마크업 -->
    </nav>
  `;
}
```

### PostMetadata 컴포넌트

포스트 메타데이터 표시를 위한 두 번째 웹 컴포넌트:

```html
<post-metadata 
  layout="badge"
  date="2024-01-19"
  read-time="5분"
  category="Programming">
</post-metadata>
```

**특징**:
- 133 라인의 인라인 CSS
- 3가지 레이아웃 모드 (default/badge/inline)
- 반응형 디자인 포함

## 디버깅

### 개발자 도구에서 확인
```javascript
// 콘솔에서 컴포넌트 인스턴스 접근
const sidebar = document.querySelector('category-sidebar');
console.log(sidebar.categories);
console.log(sidebar.totalPosts);
```

### 로깅 활성화
```javascript
// 개발 모드에서 로깅 활성화
if (process.env.NODE_ENV === 'development') {
  console.log('CategorySidebar: Data updated', this.categories);
}
```

이 웹 컴포넌트 아키텍처는 확장 가능하고 유지보수하기 쉬운 모던한 접근 방식을 제공합니다.