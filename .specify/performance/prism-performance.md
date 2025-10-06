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
Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
```

**Benefits**:
- 초기 번들 크기 감소
- 네트워크 요청 최적화
- 사용하지 않는 언어 파일 제외

### 2. CDN 최적화
```html
<!-- 지리적으로 가까운 CDN 서버 사용 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-github.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
```

**Benefits**:
- 빠른 파일 다운로드
- 브라우저 캐싱 활용
- 서버 부하 분산

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
/* 필요한 스타일만 포함 */
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