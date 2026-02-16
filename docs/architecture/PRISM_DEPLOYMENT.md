# Prism.js Deployment Guide

## Overview
이 문서는 Prism.js syntax highlighting 기능의 프로덕션 배포 가이드를 제공합니다.

## Deployment Checklist

### Pre-deployment
- [ ] 모든 테스트 통과 확인
- [ ] 성능 벤치마크 만족 확인
- [ ] 브라우저 호환성 테스트 완료
- [ ] 접근성 검증 완료
- [ ] 코드 리뷰 승인 완료

### Deployment
- [ ] Jekyll 빌드 성공 확인
- [ ] CSS/JS 파일 압축 확인
- [ ] CDN 리소스 접근 가능 확인
- [ ] 캐시 정책 설정 확인

### Post-deployment
- [ ] 실제 환경에서 기능 동작 확인
- [ ] 성능 지표 모니터링
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 수집

## Environment Configuration

### Development Environment
```yaml
# _config_development.yml
url: "http://localhost:4000"
show_drafts: true
incremental: true
livereload: true
```

### Production Environment
```yaml
# _config_production.yml
url: "https://blog.siwony.xyz"
show_drafts: false
incremental: false
future: false
```

## Build Process

### Jekyll Build
```bash
# Development build
./dev.sh build

# Production build
./dev.sh build --production

# Production build + local test (port 8080)
./dev.sh test-prod
```

### Asset Optimization
```bash
# Gulp을 통한 CSS/JS 빌드 및 번들링
# build:dev  → sourcemaps 포함
# build:prod → minify + critical CSS 추출

# esbuild을 통한 JS 번들링
npm run bundle:all    # ninja-keys + photoswipe 번들링

# CSS 파일 구조 (4개로 분할)
# - assets/css/common.css (13KB)
# - assets/css/home.css (7.6KB)
# - assets/css/post.css (16KB, Prism.js 스타일 포함)
# - assets/css/category.css (4KB)
```

## Asset Hosting Configuration

### Self-hosted (Current)
Prism.js는 로컬에서 셋프 호스팅되며, Gulp로 번들링됩니다:
```html
<!-- CSS (지연 로딩) -->
<link rel="stylesheet" href="/assets/css/prism/prism-material-theme.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="/assets/css/prism/prism-toolbar.min.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="/assets/css/prism/prism-line-numbers.min.css" media="print" onload="this.media='all'">

<!-- JavaScript (단일 번들, defer) -->
<script src="/assets/js/prism/prism.bundle.min.js" defer></script>
```

### Bundle Process (Gulp)
```javascript
// gulpfile.js - bundlePrism 태스크
function bundlePrism() {
  return gulp.src([
    'assets/js/prism/prism.min.js',
    'assets/js/prism/prism-autoloader.min.js',
    'assets/js/prism/prism-line-numbers.min.js',
    'assets/js/prism/prism-toolbar.min.js',
    'assets/js/prism/prism-copy-to-clipboard.min.js',
    'assets/js/prism/prism-show-language.min.js'
  ], { allowEmpty: true })
    .pipe(concat('prism.bundle.min.js'))
    .pipe(gulp.dest('assets/js/prism/'));
}
```

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    connect-src 'self';
">
```

> **참고**: Prism.js가 로컬 호스팅되므로 CDN에 대한 script-src 허용이 필요하지 않습니다.
> 외부 CDN은 GitHub Markdown CSS (`cdnjs.cloudflare.com`)만 허용됩니다.

## Performance Optimization

### CloudFront Caching
AWS CloudFront가 CDN 역할을 수행하며, 정적 자산에 대해 캐싱을 제공합니다.

### Preloading Critical Resources
```html
<!-- Critical CSS 인라인 -->
<style>{% include critical.css %}</style>

<!-- 페이지별 CSS 조건부 로딩 -->
<link rel="stylesheet" href="/assets/css/common.css">
{% if page.layout == 'post' %}
  <link rel="stylesheet" href="/assets/css/post.css">
{% endif %}
```

## Monitoring & Alerting

### Performance Monitoring
```javascript
// Performance tracking
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        // Send to analytics
        gtag('event', 'timing_complete', {
            'name': 'prism_load_time',
            'value': loadTime
        });
    });
}
```

### Error Tracking
```javascript
// Error monitoring
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('prism')) {
        // Send error to monitoring service
        console.error('Prism.js Error:', e.message);
    }
});
```

## Rollback Strategy

### Quick Rollback
```bash
# Git-based rollback
git revert <commit-hash>
git push origin main

# Jekyll rebuild
bundle exec jekyll build
```

### Feature Flag Rollback
```javascript
// Conditional loading based on feature flag
if (window.ENABLE_PRISM_HIGHLIGHTING !== false) {
    // Load Prism.js
    loadPrismLibrary();
} else {
    // Fallback to basic styling
    document.body.classList.add('prism-disabled');
}
```

## Testing in Production

### Smoke Tests
```bash
# Basic functionality test
curl -s https://yourblog.com/programming/2024/10/07/prism-syntax-highlighting-test/ | grep -q "language-javascript"
echo "✅ Code blocks detected"

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s https://yourblog.com/
echo "✅ Performance check completed"
```

### Visual Regression Testing
```javascript
// Automated screenshot comparison
const puppeteer = require('puppeteer');

async function visualTest() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://yourblog.com/programming/2024/10/07/prism-syntax-highlighting-test/');
    await page.waitForSelector('.token');
    
    const screenshot = await page.screenshot();
    // Compare with baseline
    
    await browser.close();
}
```

## Maintenance

### Regular Updates
```bash
# Monthly Prism.js version check
npm info prism@latest version

# Update CDN links if needed
# Update tests accordingly
# Verify compatibility
```

### Health Checks
```bash
#!/bin/bash
# health-check.sh

# Check CDN availability
curl -f -s https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ CDN accessible"
else
    echo "❌ CDN issue detected"
    exit 1
fi

# Check syntax highlighting working
if curl -s https://yourblog.com/ | grep -q "language-"; then
    echo "✅ Syntax highlighting active"
else
    echo "⚠️ Syntax highlighting may not be working"
fi
```

## Disaster Recovery

### CDN Outage Response
1. **Detection**: Monitoring alerts trigger
2. **Assessment**: Verify CDN status and impact
3. **Mitigation**: Switch to fallback resources
4. **Communication**: Notify stakeholders
5. **Recovery**: Monitor until CDN restored

### Fallback Implementation
```html
<!-- Emergency fallback -->
<script>
// Detect CDN failure and load local files
(function() {
    var script = document.createElement('script');
    script.onerror = function() {
        // Load local fallback
        var fallback = document.createElement('script');
        fallback.src = '/assets/js/prism-emergency.js';
        document.head.appendChild(fallback);
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
    document.head.appendChild(script);
})();
</script>
```

## Documentation Updates

### Deployment Notes
- Version information
- Configuration changes
- Known issues
- Performance metrics

### Changelog
```markdown
## [1.0.0] - 2024-10-07
### Added
- Prism.js syntax highlighting integration
- Jest testing suite
- Performance monitoring
- CDN-based deployment

### Changed
- Replaced Rouge with Prism.js
- Updated CSS for GitHub theme

### Fixed
- Code block accessibility issues
- Mobile responsiveness
```