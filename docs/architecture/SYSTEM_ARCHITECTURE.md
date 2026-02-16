# Project Architecture

## System Overview
Jekyll 기반 기술 블로그에 Prism.js syntax highlighting을 통합한 시스템 아키텍처입니다.

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content       │    │   Jekyll         │    │   Browser       │
│   (Markdown)    │───▶│   Generator      │───▶│   (Client)      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Static Files   │    │   Prism.js      │
                       │   (HTML/CSS)     │    │   (Self-hosted) │
                       └──────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Layer
```
Browser Environment
├── HTML Structure (_layouts/default.html)
├── CSS Styling (Conditional Loading)
│   ├── assets/css/common.css (13KB - 모든 페이지)
│   ├── assets/css/home.css (7.6KB - 홈/블로그 페이지)
│   ├── assets/css/post.css (16KB - 포스트 페이지)
│   └── assets/css/category.css (4KB - 카테고리 페이지)
├── Web Components (Inline Styles)
│   ├── category-sidebar.js (96 lines inline CSS)
│   └── post-metadata.js (133 lines inline CSS)
├── Prism.js Core Library (Self-hosted)
├── Prism.js Plugins
│   ├── AutoLoader
│   ├── Line Numbers
│   ├── Toolbar
│   ├── Copy to Clipboard
│   └── Show Language
└── Initialization Script
```

### Content Layer
```
Jekyll Content Processing
├── Markdown Files (_posts/*.md)
├── Kramdown Parser
├── Liquid Templates
└── Static Site Generation
```

### Test Layer
```
Jest Testing Framework
├── Unit Tests (tests/prism.test.js)
├── Integration Tests (tests/prism-integration.test.js)
├── Blog Feature Tests (tests/blog-features.test.js)
├── Category Display Tests (tests/category-tags-display.test.js)
├── Web Component Tests
│   ├── tests/category-sidebar.test.js
│   └── tests/post-metadata.test.js
├── Test Environment Setup (tests/setup.js)
└── Custom Test Runner (scripts/test-runner.js)
```

## Data Flow

### Content Processing Flow
```
Markdown → Kramdown → HTML → Prism.js → Highlighted Code
    ↓         ↓         ↓        ↓            ↓
  Raw      Parsed    Static   Dynamic     Final
 Content   Content   HTML    Processing   Output
```

### Build Process Flow
```
1. Jekyll Build
   ├── Process Markdown files
   ├── Apply Liquid templates
   ├── Generate HTML pages
   └── Copy static assets

2. Gulp Build Pipeline
   ├── Clean output directory
   ├── Minify JS (production) / Sourcemaps (dev)
   ├── Minify CSS (production) / Sourcemaps (dev)
   ├── Bundle Prism.js (6 plugins → 1 file)
   ├── Minify HTML (production)
   └── Extract Critical CSS (production)

3. Browser Loading
   ├── Load HTML page
   ├── Apply Critical CSS (inlined)
   ├── Fetch page-specific CSS
   ├── Load bundled JS (defer)
   └── Apply syntax highlighting
```

## Integration Points

### Jekyll Integration
- **Configuration**: `_config.yml` - Rouge 비활성화
- **Layout**: `_layouts/default.html` - Prism.js 로딩 및 조건부 CSS 로딩
- **Styling**: `assets/css/` - 페이지별 분할 CSS (common/home/post/category)
- **Content**: `_posts/*.md` - 코드 블록 마크다운
- **Build**: `gulpfile.js` - CSS/JS 빌드 및 번들링

### External Dependencies
- **AWS S3 + CloudFront**: 정적 사이트 호스팅 및 CDN
- **GitHub Actions**: CI/CD 파이프라인
- **Jekyll**: Static site generation
- **Node.js**: Testing and build environment

## Security Architecture

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com
connect-src 'self'
```

### Trusted Sources
- Self-hosted assets (primary)
- cdnjs.cloudflare.com (GitHub Markdown CSS only)
- AWS S3 + CloudFront (production hosting)

## Performance Architecture

### Loading Strategy
1. **Critical Path**: HTML → CSS → Core JS
2. **Progressive Enhancement**: Plugins loaded asynchronously
3. **Lazy Loading**: Language files loaded on demand
4. **Caching**: Browser and CDN caching

### Optimization Techniques
- CDN for fast global delivery
- Minified resources
- Gzip compression
- Browser caching
- Preconnect hints

## Deployment Architecture

### Environments
```
Development
├── Local Jekyll server (dev.sh serve)
├── Sourcemaps enabled
├── Debug logging enabled
├── Live reload
└── Drafts included

Production
├── AWS S3 + CloudFront hosting
├── Minified assets (Gulp)
├── Critical CSS inlined
├── Bundled JS (esbuild + Gulp)
└── GZIP compression
```

### CI/CD Pipeline
```
GitHub Actions
├── Category Auto-sync
│   └── scripts/sync_categories.sh
├── Automated Testing (.github/workflows/test.yml)
│   ├── Jest Tests
│   └── Codecov Coverage
├── Build Process (.github/workflows/deploy.yml)
│   ├── Jekyll Build (production config)
│   └── Asset Optimization
└── Deployment
    ├── S3 Sync
    ├── RSS Content-Type Fix
    └── CloudFront Cache Invalidation
```

## Scalability Considerations

### Horizontal Scaling
- CDN for global distribution
- Multiple CDN providers for redundancy
- Static site hosting for high availability

### Performance Scaling
- Code splitting for large sites
- Lazy loading for better initial load
- Service workers for offline capability

## Monitoring & Observability

### Metrics Collection
```
Performance Metrics
├── Page Load Time
├── First Contentful Paint
├── Time to Interactive
└── Cumulative Layout Shift

Functional Metrics
├── Syntax Highlighting Success Rate
├── Plugin Loading Success
├── Error Rate
└── User Engagement
```

### Error Tracking
- JavaScript errors
- CDN availability
- Performance degradation
- User-reported issues

## Technology Stack

### Core Technologies
- **Jekyll ~4.3**: Static site generator
- **Prism.js 1.29.0**: Syntax highlighting (self-hosted, bundled)
- **Kramdown**: Markdown parser (GFM)
- **Liquid**: Template engine

### Development Tools
- **Jest 29.7.0**: Testing framework
- **Gulp 4.0.2**: Build automation (CSS/JS minification, bundling)
- **esbuild**: JavaScript bundling (Ninja Keys, PhotoSwipe)
- **Node.js 20.x**: Development environment
- **npm**: Package management
- **GitHub Actions**: CI/CD

### Infrastructure
- **AWS S3**: Static file hosting
- **AWS CloudFront**: CDN distribution
- **GitHub Actions (OIDC)**: Automated deployment
- **Git**: Version control

## Design Patterns

### Initialization Pattern
```javascript
// Deferred initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Prism !== 'undefined') {
        initializePrism();
    }
});
```

### Plugin Pattern
```javascript
// Modular plugin architecture
Prism.plugins.autoloader.loadLanguages(['javascript', 'python']);
```

### Observer Pattern
```javascript
// DOM mutation observation for dynamic content
const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });
```

## Future Architecture Considerations

### Extensibility
- Plugin system for additional features
- Theme customization support
- Language pack management

### Migration Path
- Version upgrade strategy
- Backward compatibility
- Feature deprecation plan

### Performance Optimization
- Service worker implementation
- Critical CSS inlining
- Image optimization pipeline