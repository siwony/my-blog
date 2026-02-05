# Typography Token System

> 이 문서는 블로그의 타이포그래피 토큰 시스템을 설명합니다.
> AI 작업 시 이 문서를 참고하여 일관된 스타일을 적용해주세요.

## 📐 디자인 원칙

- **일관성**: 모든 텍스트는 정의된 토큰 시스템을 사용
- **계층 구조**: title → subtitle → description → text → small → caption
- **반응형**: 화면 크기에 따라 자동으로 폰트 크기 조정

---

## 🎨 Typography Tokens

### CSS 변수 (Custom Properties)

모든 토큰은 `:root`에 정의되어 있으며 `assets/css/common.css` 파일에서 관리됩니다.

| 토큰 타입 | 용도 | 변수 접두사 |
|-----------|------|-------------|
| **Title** | 페이지/포스트 메인 제목 | `--blog-title-*` |
| **Subtitle** | 섹션 제목, 카드 제목 | `--blog-subtitle-*` |
| **Description** | 설명, 요약 텍스트 | `--blog-description-*` |
| **Text** | 본문 텍스트 | `--blog-text-*` |
| **Small** | 메타 정보, 날짜 | `--blog-small-*` |
| **Caption** | 태그, 레이블 | `--blog-caption-*` |

### 상세 토큰 값

```css
/* Title - 페이지/포스트 메인 제목 */
--blog-title-font-size: 2.5rem;
--blog-title-font-weight: 700;
--blog-title-line-height: 1.2;
--blog-title-letter-spacing: -0.02em;
--blog-title-color: #2c3e50;

/* Subtitle - 섹션 제목, 카드 제목 */
--blog-subtitle-font-size: 1.5rem;
--blog-subtitle-font-weight: 600;
--blog-subtitle-line-height: 1.4;
--blog-subtitle-letter-spacing: -0.01em;
--blog-subtitle-color: #2c3e50;

/* Description - 설명, 요약 텍스트 */
--blog-description-font-size: 1.1rem;
--blog-description-font-weight: 400;
--blog-description-line-height: 1.6;
--blog-description-color: #495057;

/* Text - 본문 텍스트 */
--blog-text-font-size: 1rem;
--blog-text-font-weight: 400;
--blog-text-line-height: 1.8;

/* Small Text - 메타 정보, 날짜 등 */
--blog-small-font-size: 0.875rem;
--blog-small-font-weight: 400;
--blog-small-line-height: 1.5;
--blog-small-color: #6c757d;

/* Caption - 태그, 레이블 등 */
--blog-caption-font-size: 0.75rem;
--blog-caption-font-weight: 500;
--blog-caption-line-height: 1.4;
--blog-caption-letter-spacing: 0.02em;
```

---

## 🏷️ CSS 클래스 사용법

### 기본 클래스

```html
<!-- Title -->
<h1 class="title">페이지 제목</h1>
<h1 class="blog-title">페이지 제목</h1>

<!-- Subtitle -->
<h2 class="subtitle">섹션 제목</h2>
<h2 class="blog-subtitle">섹션 제목</h2>

<!-- Description -->
<p class="description">이것은 설명 텍스트입니다.</p>
<p class="blog-description">이것은 설명 텍스트입니다.</p>

<!-- Text (본문) -->
<p class="text">본문 텍스트입니다.</p>
<p class="blog-text">본문 텍스트입니다.</p>

<!-- Small -->
<span class="small-text">2024년 1월 19일</span>
<span class="blog-small">2024년 1월 19일</span>

<!-- Caption -->
<span class="caption">태그</span>
<span class="blog-caption">태그</span>
```

### 실제 사용 예시

```html
<!-- 포스트 카드 -->
<article class="post-card">
  <h2 class="subtitle">포스트 제목입니다</h2>
  <p class="description">포스트에 대한 간략한 설명이 여기에 들어갑니다.</p>
  <div class="small-text">
    <span>2024-01-19</span>
    <span>5분 읽기</span>
  </div>
  <div class="caption">JavaScript, React</div>
</article>

<!-- 포스트 페이지 -->
<article class="post">
  <header>
    <h1 class="title">메인 포스트 제목</h1>
    <p class="small-text">2024년 1월 19일 · 10분 읽기</p>
  </header>
  <div class="text">
    <p>본문 내용...</p>
  </div>
</article>
```

---

## 📱 반응형 브레이크포인트

토큰 시스템은 자동으로 반응형을 지원합니다:

| 화면 크기 | Title | Subtitle | Description | Text |
|-----------|-------|----------|-------------|------|
| Desktop (> 768px) | 2.5rem | 1.5rem | 1.1rem | 1rem |
| Tablet (≤ 768px) | 2rem | 1.25rem | 1rem | 0.95rem |
| Mobile (≤ 480px) | 1.75rem | 1.125rem | 0.95rem | 0.9rem |

---

## ⚠️ AI 작업 시 주의사항

### ✅ DO (해야 할 것)

1. **새 컴포넌트 작성 시 토큰 사용**
   ```css
   /* Good */
   .new-component-title {
     font-size: var(--blog-title-font-size);
     font-weight: var(--blog-title-font-weight);
     color: var(--blog-title-color);
   }
   ```

2. **적절한 계층 선택**
   - 페이지 메인 제목 → `title`
   - 섹션/카드 제목 → `subtitle`
   - 설명/요약 → `description`
   - 일반 본문 → `text`
   - 메타 정보 → `small-text`
   - 태그/레이블 → `caption`

3. **클래스 사용 시 일관성 유지**
   - `title` 또는 `blog-title` 중 하나만 선택해서 사용

### ❌ DON'T (하지 말아야 할 것)

1. **하드코딩된 폰트 크기 사용 금지**
   ```css
   /* Bad */
   .new-title {
     font-size: 24px;
     font-weight: bold;
   }
   
   /* Good */
   .new-title {
     font-size: var(--blog-subtitle-font-size);
     font-weight: var(--blog-subtitle-font-weight);
   }
   ```

2. **임의의 색상 사용 금지**
   ```css
   /* Bad */
   color: #333333;
   
   /* Good */
   color: var(--blog-text-color);
   color: var(--blog-title-color);
   ```

---

## 🔗 관련 파일

- **CSS 파일 구조**:
  - `assets/css/common.css` - 토큰 정의 위치 (`:root` 섹션)
  - `assets/css/home.css` - 홈/블로그 페이지 스타일
  - `assets/css/post.css` - 포스트 페이지 스타일
  - `assets/css/category.css` - 카테고리 페이지 스타일
- **원본 파일**: `assets/css/style.css.bak` (아카이브됨)

---

## 📝 토큰 수정 시

토큰 값을 수정해야 할 경우, `assets/css/common.css`의 `:root` 섹션에서 해당 변수만 수정하면 전체 사이트에 자동 적용됩니다.

```css
:root {
  /* 이 값을 수정하면 모든 title에 적용됨 */
  --blog-title-font-size: 2.5rem;
}
```
