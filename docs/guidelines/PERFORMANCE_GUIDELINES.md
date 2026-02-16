# Prism.js Performance Guidelines

## Overview
Prism.js syntax highlighting의 성능 최적화를 위한 가이드라인과 벤치마크 기준을 정의합니다.

## Performance Requirements

### Loading Performance
- **Page Load Time**: 1초 이내 (99% of cases)
- **First Contentful Paint**: 800ms 이내
- **Time to Interactive**: 1.5초 이내
- **Cumulative Layout Shift**: 0.1 이하

### Runtime Performance
- **Highlighting Speed**: 100개 코드 블록을 500ms 이내 처리
- **Memory Usage**: 추가 메모리 사용량 10MB 이하
- **Scroll Performance**: 60 FPS 유지

## Optimization Strategies

### 1. Lazy Loading
```javascript
// Autoloader 플러그인 사용으로 필요한 언어만 로딩
Prism.plugins.autoloader.languages_path = '/assets/js/prism/components/';
```

**Benefits**:
- 초기 번들 크기 감소
- 네트워크 요청 최적화
- 사용하지 않는 언어 파일 제외

### 2. 로컬 호스팅 + 번들링
```html
<!-- Prism.js 번들 (6개 플러그인 → 단일 파일, 37KB) -->
<script src="/assets/js/prism/prism.bundle.min.js" defer></script>

<!-- Ninja Keys 번들 (80+ ESM → 단일 IIFE, 52KB) -->
<script src="/assets/js/ninja-keys.bundle.min.js" defer></script>

<!-- PhotoSwipe 번들 (2 ESM → 단일 IIFE, 67KB) -->
<script src="/assets/js/photoswipe.bundle.min.js" defer></script>
```

**Benefits**:
- 외부 CDN 의존성 제거 (안정성 확보)
- 요청 체이닝 제거 (1,778ms → 단일 요청)
- 브라우저 캐싱 활용
- CloudFront CDN 통한 글로벌 배포

### 3. DOM 최적화
```javascript
// 배치 DOM 조작으로 리플로우 최소화
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
    const fragment = document.createDocumentFragment();
    
    // 한 번에 모든 변경사항 적용
    codeBlocks.forEach(function(code) {
        const pre = code.parentElement;
        if (!pre.classList.contains('line-numbers')) {
            pre.classList.add('line-numbers');
        }
    });
    
    Prism.highlightAll();
});
```

## Performance Monitoring

### Key Metrics
1. **Bundle Size**: JavaScript 및 CSS 파일 크기
2. **Loading Time**: 각 리소스 로딩 시간
3. **Parsing Time**: 코드 블록 파싱 시간
4. **Rendering Time**: DOM 업데이트 시간

### Monitoring Tools
- **Lighthouse**: Core Web Vitals 측정
- **WebPageTest**: 상세한 로딩 분석
- **Chrome DevTools**: 런타임 성능 프로파일링

### Benchmark Tests
```javascript
// Performance test example
test('100개 코드 블록을 500ms 이내에 처리해야 함', () => {
    const startTime = performance.now();
    
    // 100개 코드 블록 생성 및 처리
    for (let i = 0; i < 100; i++) {
        const codeBlock = createCodeBlock('javascript', 'console.log("test");');
        document.body.appendChild(codeBlock);
    }
    
    // 처리 시간 측정
    mockPrismInitialization();
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(500);
});
```

## Resource Optimization

### CSS Optimization
```css
/* 필요한 스타일만 포함 - 페이지별 분할 */
/* common.css (13KB): 글꼴, 변수, 헤더/푸터, 기본 스타일 */
/* home.css (7.6KB): 히어로, 포스트-프리뷰, 페이지네이션 */
/* post.css (16KB): 포스트 콘텐트, TOC, 테이블, 코드 */
/* category.css (4KB): 카테고리 그리드, 포스트 카드 */
pre[class*="language-"] {
    /* 하드웨어 가속 활용 */
    transform: translateZ(0);
    will-change: scroll-position;
}

/* 미사용 CSS 제거 */
/* .unused-style { display: none; } */
```

### JavaScript Optimization
```javascript
// 디바운싱으로 불필요한 호출 방지
const debouncedHighlight = debounce(() => {
    Prism.highlightAll();
}, 100);

// 이벤트 위임으로 리스너 최적화
document.addEventListener('click', function(e) {
    if (e.target.matches('.copy-button')) {
        handleCopyClick(e.target);
    }
});
```

## Mobile Performance

### Responsive Optimizations
```css
@media (max-width: 768px) {
    pre[class*="language-"] {
        font-size: 0.8rem;        /* 작은 폰트로 가독성 유지 */
        padding: 0.8rem;          /* 패딩 최적화 */
        line-height: 1.4;         /* 줄 간격 조정 */
    }
    
    .line-numbers .line-numbers-rows {
        width: 2.5em;             /* 라인 번호 영역 축소 */
    }
}
```

### Touch Interactions
```javascript
// 터치 디바이스에서 복사 버튼 최적화
if ('ontouchstart' in window) {
    // 터치 이벤트 최적화
    document.addEventListener('touchstart', handleTouch, { passive: true });
}
```

## Memory Management

### Memory Leak Prevention
```javascript
// 이벤트 리스너 정리
function cleanup() {
    // 글로벌 이벤트 리스너 제거
    document.removeEventListener('DOMContentLoaded', initializePrism);
    
    // 참조 정리
    codeBlockCache = null;
    tokenCache = null;
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', cleanup);
```

### Efficient Caching
```javascript
// 처리된 코드 블록 캐싱
const processedBlocks = new WeakMap();

function processCodeBlock(element) {
    if (processedBlocks.has(element)) {
        return processedBlocks.get(element);
    }
    
    const result = performHighlighting(element);
    processedBlocks.set(element, result);
    return result;
}
```

## Performance Budget

### Size Limits
- **JavaScript**: 총 50KB 이하 (gzipped)
- **CSS**: 총 15KB 이하 (gzipped)
- **이미지**: 없음 (아이콘은 CSS로 구현)

### Loading Budget
- **DNS Lookup**: 50ms 이하
- **Initial Connection**: 100ms 이하
- **SSL Handshake**: 100ms 이하
- **Time to First Byte**: 200ms 이하

## Testing & Validation

### Performance Tests
```javascript
describe('성능 테스트', () => {
    test('대용량 코드 처리 성능', async () => {
        const largeCode = 'console.log("test");\n'.repeat(1000);
        const startTime = performance.now();
        
        const codeBlock = createCodeBlock('javascript', largeCode);
        document.body.appendChild(codeBlock);
        
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(100);
    });
});
```

### Continuous Monitoring
- **CI/CD Pipeline**: 성능 회귀 자동 감지
- **Real User Monitoring**: 실제 사용자 성능 데이터 수집
- **Regular Audits**: 월간 성능 감사 수행

## Best Practices

### Development
1. **Code Splitting**: 필요한 부분만 로딩
2. **Tree Shaking**: 미사용 코드 제거
3. **Minification**: 프로덕션 빌드 최적화

### Deployment
1. **Gzip Compression**: 서버 압축 활성화
2. **Browser Caching**: 적절한 캐시 헤더 설정
3. **HTTP/2**: 다중 요청 최적화

### Monitoring
1. **Real-time Alerts**: 성능 임계값 초과 시 알림
2. **Performance Dashboard**: 지속적인 모니터링
3. **Regular Reviews**: 성능 지표 정기 검토

---

## 🚀 Performance Optimization History (2026.01)

이 섹션은 Google PageSpeed Insights 진단 결과를 기반으로 수행된 성능 최적화 작업을 기록합니다.

### 📋 최적화 개요

| 항목 | 문제 | 해결 방법 | 효과 |
|------|------|-----------|------|
| **Critical CSS** | 렌더 차단 CSS | Gulp 빌드 시 자동 추출 및 인라인 | LCP/FCP 개선 |
| **Prism.js 번들링** | 6개 개별 파일 요청 | 단일 번들 (37KB) | 요청 수 6 → 1 |
| **Pretendard 로컬화** | CDN 의존성 | 서브셋 폰트 셀프 호스팅 | TTFB 개선 |
| **Ninja Keys 번들링** | 80+ ESM 모듈 체인 (1,778ms) | 단일 IIFE 번들 (52KB) | 체인 제거 |
| **PhotoSwipe 번들링** | 2개 ESM 모듈 체인 (429ms) | 단일 IIFE 번들 (67KB) | 체인 제거 |
| **CSS 최적화** | 미사용 CSS 포함 | 미사용 클래스/변수 제거 | 7.3KB → 7.0KB (gzip) |
| **CLS 최적화** | 레이아웃 시프트 | 폰트 메트릭, skeleton, min-height | CLS 점수 개선 |

---

### 1. Critical CSS 인라인화

**문제**: 전체 CSS 파일이 렌더를 차단하여 LCP/FCP 지연

**해결**:
```javascript
// gulpfile.js - extractCritical 태스크
async function extractCritical() {
  const { generate } = await import('critical');
  const result = await generate({
    base: '_site/',
    src: 'index.html',
    width: 1300,
    height: 900,
    inline: false
  });
  fs.writeFileSync('_includes/critical.css', result.css);
}
```

**적용 방법** (`_layouts/default.html`):
```html
<!-- Critical CSS 인라인 -->
<style>{% include critical.css %}</style>

<!-- 페이지별 조건부 CSS 로딩 -->
<link rel="stylesheet" href="/assets/css/common.css">
{% if page.layout == 'post' %}
  <link rel="stylesheet" href="/assets/css/post.css">
{% elsif page.url == '/' or page.url == '/blog.html' %}
  <link rel="stylesheet" href="/assets/css/home.css">
{% elsif page.layout == 'category' %}
  <link rel="stylesheet" href="/assets/css/category.css">
{% endif %}
```

---

### 2. Prism.js 번들링

**문제**: 6개 개별 스크립트 요청
- `prism-core.min.js`
- `prism-autoloader.min.js`
- `prism-line-numbers.min.js`
- `prism-toolbar.min.js`
- `prism-copy-to-clipboard.min.js`
- `prism-match-braces.min.js`

**해결**:
```javascript
// gulpfile.js
function bundlePrism() {
  return gulp.src([
    'assets/js/prism/prism-core.min.js',
    'assets/js/prism/prism-autoloader.min.js',
    'assets/js/prism/plugins/line-numbers/prism-line-numbers.min.js',
    'assets/js/prism/plugins/toolbar/prism-toolbar.min.js',
    'assets/js/prism/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
    'assets/js/prism/plugins/match-braces/prism-match-braces.min.js'
  ], { allowEmpty: true })
    .pipe(concat('prism.bundle.min.js'))
    .pipe(gulp.dest('assets/js/prism/'));
}
```

**결과**: `assets/js/prism/prism.bundle.min.js` (37KB)

---

### 3. Pretendard 폰트 로컬화

**문제**: CDN에서 한글 폰트 로딩 시 TTFB 지연

**해결**: 자주 사용되는 2,350자 서브셋으로 셀프 호스팅

```css
/* assets/css/style.css */
@font-face {
  font-family: 'Pretendard';
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/Pretendard-Regular.subset.woff2') format('woff2');
  /* CLS 방지 메트릭 */
  size-adjust: 100%;
  ascent-override: 88%;
  descent-override: 20%;
  line-gap-override: 0%;
}
```

**파일 위치**: `assets/fonts/Pretendard-*.subset.woff2` (4 weights, 각 ~270KB)

---

### 4. Ninja Keys 번들링

**문제**: unpkg.com에서 80개 이상의 ESM 모듈 체인 요청 (1,778ms)

**해결**:
```javascript
// assets/js/ninja-keys-entry.js
import 'ninja-keys';

// package.json
"bundle:ninja-keys": "esbuild assets/js/ninja-keys-entry.js --bundle --minify --format=iife --outfile=assets/js/ninja-keys.bundle.min.js"
```

**결과**: `assets/js/ninja-keys.bundle.min.js` (52KB) - 단일 요청

---

### 5. PhotoSwipe 번들링

**문제**: 2개 ESM 모듈 순차 요청 (429ms 체인)
```
photoswipe-lightbox.esm.min.js → photoswipe.esm.min.js
```

**해결**:
```javascript
// assets/js/photoswipe-entry.js
import PhotoSwipeLightbox from './photoswipe/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from './photoswipe/photoswipe.esm.min.js';
window.PhotoSwipeLightbox = PhotoSwipeLightbox;
window.PhotoSwipe = PhotoSwipe;

// package.json
"bundle:photoswipe": "esbuild assets/js/photoswipe-entry.js --bundle --minify --format=iife --outfile=assets/js/photoswipe.bundle.min.js"
```

**결과**: `assets/js/photoswipe.bundle.min.js` (67KB) - 단일 요청

---

### 6. 미사용 CSS 제거

**제거된 항목**:
- 중복 `.blog-*` 클래스
- 미사용 타이포그래피 클래스 (`.subtitle`, `.small-text` 등)
- 미사용 CSS 변수 (`--blog-subtitle-*`, `--blog-shadow-md` 등)

**결과**: gzipped CSS 7.3KB → 7.0KB (~4% 감소)

---

### 7. CLS (Cumulative Layout Shift) 최적화

**문제**: 폰트 스왑, Web Components 로딩 시 레이아웃 이동

**해결**:

#### 7.1 폰트 메트릭 오버라이드
```css
@font-face {
  font-family: 'Inter';
  /* ... */
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

#### 7.2 Web Components Skeleton 상태
```css
/* JS 로딩 전 레이아웃 공간 예약 */
category-sidebar:not(:defined) {
  display: block;
  min-height: 280px;
  background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%);
  animation: skeleton-shimmer 1.5s infinite;
}

post-metadata:not(:defined) {
  display: block;
  min-height: 22px;
  width: 180px;
}
```

#### 7.3 레이아웃 영역 예약
```css
.hero { min-height: 160px; }
.post-preview { min-height: 120px; contain: layout style; }
```

---

### 📦 빌드 스크립트

```json
// package.json
{
  "scripts": {
    "bundle:ninja-keys": "esbuild assets/js/ninja-keys-entry.js --bundle --minify --format=iife --outfile=assets/js/ninja-keys.bundle.min.js",
    "bundle:photoswipe": "esbuild assets/js/photoswipe-entry.js --bundle --minify --format=iife --outfile=assets/js/photoswipe.bundle.min.js",
    "bundle:all": "npm run bundle:ninja-keys && npm run bundle:photoswipe",
    "build:prod": "npm run bundle:all && bundle exec jekyll build --config _config.yml,_config_production.yml && NODE_ENV=production gulp build:prod"
  }
}
```

### 📊 최종 파일 크기

| 파일 | 크기 | 비고 |
|------|------|------|
| `common.css` | ~13KB | 모든 페이지 공통 (글꼴, 변수, 헤더/푸터) |
| `home.css` | ~7.6KB | 홈/블로그 페이지 전용 |
| `post.css` | ~16KB | 포스트 페이지 전용 |
| `category.css` | ~4KB | 카테고리 페이지 전용 |
| `prism.bundle.min.js` | 37KB | 6개 파일 통합 |
| `ninja-keys.bundle.min.js` | 52KB | 80+ 모듈 통합 |
| `photoswipe.bundle.min.js` | 67KB | 2개 ESM 통합 |
| `critical.css` | ~4.5KB | 인라인용 |

**성능 개선 결과**:
- 홈 페이지: 39KB → 20.6KB CSS (47% 감소)
- 포스트 페이지: 39KB → 29KB CSS (26% 감소)
- 카테고리 페이지: 39KB → 17KB CSS (56% 감소)

### 🔗 관련 커밋

- `c1359ed` - perf: optimize render-blocking resources for LCP/FCP
- `51344df` - fix: generate prism.bundle.min.js in source folder for deployment
- `edcdbc9` - perf: bundle ninja-keys locally to eliminate request chaining
- `5df41ea` - perf: remove unused CSS classes and variables
- `d0fc57e` - perf: bundle PhotoSwipe to eliminate request chaining
- `5a918d2` - fix: reduce CLS with font metrics, skeleton states, and layout reservations