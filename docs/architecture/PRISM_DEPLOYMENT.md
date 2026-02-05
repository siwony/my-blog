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
# _config.yml (development)
environment: development
prism_debug: true
minify_css: false
minify_js: false
```

### Production Environment
```yaml
# _config.yml (production)
environment: production
prism_debug: false
minify_css: true
minify_js: true
```

## Build Process

### Jekyll Build
```bash
# Development build
bundle exec jekyll build

# Production build
JEKYLL_ENV=production bundle exec jekyll build

# Serve locally for testing
bundle exec jekyll serve --livereload
```

### Asset Optimization
```bash
# Gulp을 통한 CSS/JS 빌드 및 번들링
npm run build:dev    # 개발 빌드
npm run build:prod   # 프로덕션 빌드 (최적화)

# CSS 파일 구조 (4개로 분할)
# - assets/css/common.css (13KB)
# - assets/css/home.css (7.6KB)
# - assets/css/post.css (16KB, Prism.js 스타일 포함)
# - assets/css/category.css (4KB)
```

## CDN Configuration

### Primary CDN (Cloudflare)
```html
<!-- CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-github.min.css" rel="stylesheet" />

<!-- JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
```

### Fallback Strategy
```html
<!-- Fallback for CDN failure -->
<script>
if (!window.Prism) {
    document.write('<script src="/assets/js/prism-fallback.min.js"><\/script>');
}
</script>
```

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    connect-src 'self' https://cdnjs.cloudflare.com;
">
```

### Subresource Integrity
```html
<!-- SRI hashes for CDN resources -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-github.min.css" 
      rel="stylesheet" 
      integrity="sha512-..." 
      crossorigin="anonymous" />
```

## Performance Optimization

### HTTP Headers
```nginx
# Nginx configuration example
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_types text/css application/javascript;
}
```

### Preloading Critical Resources
```html
<!-- Preload critical CSS -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-github.min.css" as="style">

<!-- Preconnect to CDN -->
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
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