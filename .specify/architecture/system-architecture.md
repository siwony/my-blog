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
                       │   (HTML/CSS)     │    │   (CDN)         │
                       └──────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Layer
```
Browser Environment
├── HTML Structure (_layouts/default.html)
├── CSS Styling (assets/css/style.css)
├── Prism.js Core Library (CDN)
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
├── Performance Tests (tests/prism-performance.test.js)
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

2. Browser Loading
   ├── Load HTML page
   ├── Fetch CSS from CDN
   ├── Fetch JS from CDN
   ├── Execute initialization
   └── Apply syntax highlighting
```

## Integration Points

### Jekyll Integration
- **Configuration**: `_config.yml` - Rouge 비활성화
- **Layout**: `_layouts/default.html` - Prism.js 로딩
- **Styling**: `assets/css/style.css` - 커스텀 테마
- **Content**: `_posts/*.md` - 코드 블록 마크다운

### External Dependencies
- **CDN**: Cloudflare CDN for Prism.js resources
- **GitHub**: Source code hosting and CI/CD
- **Jekyll**: Static site generation
- **Node.js**: Testing environment

## Security Architecture

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com
connect-src 'self' https://cdnjs.cloudflare.com
```

### Trusted Sources
- Cloudflare CDN (primary)
- GitHub Pages (hosting)
- Local assets (fallback)

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
├── Local Jekyll server
├── Unminified assets
├── Debug logging enabled
└── Live reload

Production
├── GitHub Pages hosting
├── Minified assets
├── Production optimizations
└── Performance monitoring
```

### CI/CD Pipeline
```
GitHub Actions
├── Code Quality Checks
│   ├── ESLint
│   └── Prettier
├── Automated Testing
│   ├── Jest Unit Tests
│   ├── Integration Tests
│   └── Performance Tests
├── Build Process
│   ├── Jekyll Build
│   └── Asset Optimization
└── Deployment
    ├── GitHub Pages
    └── Status Monitoring
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
- **Jekyll 3.9.x**: Static site generator
- **Prism.js 1.29.0**: Syntax highlighting
- **Kramdown**: Markdown parser
- **Liquid**: Template engine

### Development Tools
- **Jest**: Testing framework
- **Node.js**: Development environment
- **npm**: Package management
- **GitHub Actions**: CI/CD

### Infrastructure
- **GitHub Pages**: Hosting
- **Cloudflare CDN**: Asset delivery
- **Git**: Version control
- **GitHub**: Repository hosting

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