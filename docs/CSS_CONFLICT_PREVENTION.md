# CSS 충돌 방지 가이드라인

## 네이밍 컨벤션

### 1. 프로젝트 접두사 규칙
모든 커스텀 CSS 클래스는 `blog-` 접두사를 사용합니다.

```css
/* 기본 컴포넌트 */
.blog-header { }
.blog-navigation { }
.blog-footer { }

/* 포스트 관련 */
.blog-post { }
.blog-post__title { }
.blog-post__meta { }
.blog-post__content { }

/* 메타데이터 */
.blog-metadata { }
.blog-category { }
.blog-tag { }

/* 사이드바 */
.blog-sidebar { }
.blog-sidebar__category { }
.blog-sidebar__navigation { }
```

### 2. 컴포넌트별 네이밍
각 컴포넌트는 고유한 네임스페이스를 가집니다.

```css
/* 카테고리 시스템 */
.category-sidebar { }
.category-navigation { }
.category-list { }
.category-item { }
.category-link { }

/* 포스트 메타데이터 */
.post-metadata { }
.post-categories { }
.post-tags { }
.post-tag { }
.post-category-tag { }

/* 페이지네이션 */
.pagination { }
.pagination__item { }
.pagination__link { }
```

## 라이브러리별 격리 전략

### 1. Prism.js 격리
```css
/* Prism.js 전용 컨테이너 */
.code-block-container {
  /* Prism.js 스타일만 여기서 적용 */
}

.code-block-container .token { }
.code-block-container .tag { }
.code-block-container .keyword { }
```

### 2. Ninja Keys 격리
```css
/* Command Palette 전용 */
ninja-keys {
  /* 웹 컴포넌트로 자동 격리됨 */
}

.command-palette-container { }
```

### 3. 커스텀 컴포넌트 격리
```css
/* 카테고리 사이드바 */
category-sidebar {
  /* 웹 컴포넌트 격리 */
}

.blog-sidebar-container .category-item { }
```

## CSS 계층 구조

```
styles/
├── base/
│   ├── reset.css         # CSS 리셋
│   ├── variables.css     # CSS 변수
│   └── typography.css    # 기본 타이포그래피
├── components/
│   ├── blog-header.css
│   ├── blog-sidebar.css
│   ├── blog-post.css
│   └── blog-metadata.css
├── vendors/
│   ├── prism-override.css    # Prism.js 커스터마이징
│   └── ninja-keys-override.css
└── main.css             # 메인 스타일시트
```

## 충돌 감지 및 예방

### 1. CSS 클래스 검증 규칙
- 모든 새 클래스는 `blog-` 또는 컴포넌트명으로 시작
- 라이브러리 클래스명과 중복 확인
- 일반적인 단어 사용 금지 (`tag`, `button`, `content` 등)

### 2. 코드 리뷰 체크리스트
- [ ] 새 CSS 클래스가 기존 라이브러리와 충돌하지 않는가?
- [ ] 네이밍 컨벤션을 따르고 있는가?
- [ ] 스코프가 적절히 제한되어 있는가?

### 3. 자동화 도구 활용
```javascript
// CSS 클래스 중복 검사 스크립트
const dangerousClasses = ['tag', 'token', 'keyword', 'string', 'number'];
const checkForConflicts = (cssContent) => {
  dangerousClasses.forEach(className => {
    if (cssContent.includes(`.${className} `)) {
      console.warn(`Potential conflict: .${className} class found`);
    }
  });
};
```

## 실제 적용 예시

### Before (충돌 위험)
```css
.tag { background: #gray; }
.button { padding: 10px; }
.header { height: 60px; }
```

### After (충돌 방지)
```css
.blog-tag { background: var(--blog-tag-bg); }
.blog-button { padding: var(--blog-spacing-md); }
.blog-header { height: var(--blog-header-height); }
```

이 가이드라인을 따르면 라이브러리 간 CSS 충돌을 효과적으로 방지할 수 있습니다.