# Prism.js Syntax Highlighting Integration

## Overview
Jekyll 기술 블로그에 Prism.js syntax highlighting을 통합하여 코드 블록의 가독성과 사용자 경험을 향상시키는 프로젝트입니다.

## Problem Statement
기존 Jekyll 블로그에서 Rouge highlighter를 사용하고 있었으나, 다음과 같은 한계가 있었습니다:
- 제한적인 테마 옵션
- 라인 번호, 복사 버튼 등 고급 기능 부족
- 커스터마이징의 어려움
- 언어별 하이라이팅 품질의 차이

## Solution
Prism.js를 도입하여 다음 기능들을 구현했습니다:
- Material Design 테마 기반의 모던한 syntax highlighting
- 라인 번호 표시
- 코드 복사 기능 (클립보드)
- 언어 표시 레이블
- 200+ 프로그래밍 언어 지원 (Auto-loader)
- 로컬 호스팅을 통한 빠른 로딩

## Current Architecture

### Components
1. **Prism.js Core** (`prism.min.js`): 기본 syntax highlighting 엔진
2. **Active Plugins**: 
   - **AutoLoader** (`prism-autoloader.min.js`): 필요한 언어 파일 자동 로딩
   - **Line Numbers** (`prism-line-numbers.min.js`): 라인 번호 표시
   - **Toolbar** (`prism-toolbar.min.js`): 툴바 컨테이너
   - **Copy to Clipboard** (`prism-copy-to-clipboard.min.js`): 클립보드 복사 기능
   - **Show Language** (`prism-show-language.min.js`): 언어명 표시
3. **CSS Themes**: 
   - Material Design 테마 (`prism-material-theme.css`)
   - 툴바 스타일 (`prism-toolbar.min.css`)
   - 라인 번호 스타일 (`prism-line-numbers.min.css`)
4. **Local Assets**: `/assets/js/prism/` 및 `/assets/css/prism/` 디렉토리

### Integration Points
- **Jekyll Layout**: `_layouts/default.html`에서 CSS/JS 리소스 로딩
- **Configuration**: `_config.yml`에서 Jekyll syntax highlighting 완전 비활성화
- **Asset Management**: 로컬 호스팅을 통한 성능 최적화
- **Auto-initialization**: DOM 로드 후 자동 초기화

## Implementation Details

### 1. Jekyll Configuration
```yaml
# Rouge highlighter 완전 비활성화
highlighter: none
kramdown:
  syntax_highlighter: none
  syntax_highlighter_opts:
    disable: true
  input: GFM
  hard_wrap: false

# 증분 빌드 비활성화 (중복 출력 방지)
incremental: false
```

### 2. Asset Structure
현재 로컬 호스팅 구조:
```
assets/
├── css/prism/
│   ├── prism-material-theme.css      # Material Design 테마
│   ├── prism-toolbar.min.css         # 툴바 스타일
│   └── prism-line-numbers.min.css    # 라인 번호 스타일
└── js/prism/
    ├── prism.min.js                  # 코어 라이브러리
    ├── prism-autoloader.min.js       # 언어 자동 로딩
    ├── prism-toolbar.min.js          # 툴바 플러그인
    ├── prism-copy-to-clipboard.min.js # 복사 기능
    ├── prism-show-language.min.js    # 언어 표시
    ├── prism-line-numbers.min.js     # 라인 번호
    └── components/                    # 언어별 컴포넌트
```

### 3. HTML Integration
`_layouts/default.html`에서의 로딩 순서:
```html
<!-- CSS 먼저 로드 -->
<link rel="stylesheet" href="{{ '/assets/css/prism/prism-material-theme.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/prism/prism-toolbar.min.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/prism/prism-line-numbers.min.css' | relative_url }}">

<!-- JavaScript 로드 (순서 중요!) -->
<script src="{{ '/assets/js/prism/prism.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/prism/prism-autoloader.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/prism/prism-toolbar.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/prism/prism-copy-to-clipboard.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/prism/prism-show-language.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/prism/prism-line-numbers.min.js' | relative_url }}"></script>
```

### 4. Auto-initialization
DOM 로드 후 자동 설정:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // autoloader 경로 설정 (로컬 컴포넌트 사용)
    if (Prism.plugins && Prism.plugins.autoloader) {
        Prism.plugins.autoloader.languages_path = '{{ "/assets/js/prism/components/" | relative_url }}';
    }
    
    // 기존 코드 블록에 line-numbers 클래스 자동 추가
    Prism.highlightAll();
});
```

## Current Features

### ✅ 구현된 기능
- **Material Design 테마**: 현대적이고 가독성 높은 디자인
- **라인 번호**: 모든 코드 블록에 자동 적용
- **복사 버튼**: 클립보드로 코드 간편 복사
- **언어 표시**: 코드 블록 상단에 언어명 레이블
- **자동 언어 로딩**: 사용된 언어만 동적 로딩
- **로컬 호스팅**: CDN 의존성 없는 빠른 로딩
- **Jekyll 통합**: Rouge와의 충돌 없는 완전한 대체

### 🎯 핵심 장점
- **성능**: 로컬 호스팅으로 빠른 로딩 속도
- **안정성**: CDN 의존성 없는 안정적 서비스
- **확장성**: 200+ 언어 지원 및 플러그인 시스템
- **사용성**: 복사, 라인 번호 등 개발자 친화적 기능
- **접근성**: Material Design 가이드라인 준수
- **유지보수**: 모듈화된 구조로 쉬운 업데이트

## Migration from Rouge
Jekyll의 기본 Rouge highlighter에서 완전히 마이그레이션:
1. `_config.yml`에서 Rouge 완전 비활성화
2. 기존 코드 블록 마크업 그대로 사용 가능
3. Prism.js가 자동으로 하이라이팅 적용
4. 추가 기능 자동 활성화 (라인 번호, 복사 등)

## Performance Considerations
- **로컬 호스팅**: 외부 CDN 의존성 제거
- **Lazy Loading**: 필요한 언어만 동적 로딩
- **Minified Assets**: 모든 JS/CSS 파일 최적화
- **캐싱**: 브라우저 캐싱 활용
- **No Conflicts**: Jekyll 빌드 프로세스와 충돌 없음

## Testing & Validation

### 수동 테스트 확인사항
- [ ] 다양한 언어 코드 블록 하이라이팅
- [ ] 라인 번호 정상 표시
- [ ] 복사 버튼 동작
- [ ] 언어 레이블 표시
- [ ] 반응형 디자인 (모바일/데스크톱)
- [ ] 브라우저 호환성 (Chrome, Firefox, Safari, Edge)

### 성능 테스트
- 페이지 로딩 속도 (Lighthouse 점수)
- JavaScript 초기화 시간
- 언어별 컴포넌트 로딩 시간
- 메모리 사용량

### 접근성 테스트
- 스크린 리더 호환성
- 키보드 네비게이션
- 색상 대비 확인 (WCAG 준수)
- 폰트 크기 조정 대응

## Troubleshooting

### 일반적인 문제
1. **하이라이팅이 적용되지 않음**
   - Jekyll 빌드 후 브라우저 새로고침
   - 개발자 도구에서 JavaScript 에러 확인
   - `_config.yml`에서 Rouge 비활성화 확인

2. **복사 버튼이 작동하지 않음**
   - HTTPS 환경에서 테스트 (Clipboard API 요구사항)
   - 브라우저 권한 설정 확인

3. **특정 언어가 하이라이팅되지 않음**
   - `components/` 디렉토리에 해당 언어 파일 존재 확인
   - 네트워크 탭에서 로딩 상태 확인

### 디버깅 방법
```javascript
// 브라우저 콘솔에서 Prism 상태 확인
console.log('Prism loaded:', typeof Prism !== 'undefined');
console.log('Plugins:', Prism.plugins);
console.log('Languages:', Object.keys(Prism.languages));
```

## Future Enhancements

### 계획된 기능
- [ ] 코드 블록 접기/펼치기 기능
- [ ] 코드 하이라이트 라인 지정
- [ ] 다크/라이트 테마 토글
- [ ] 추가 플러그인 통합 (Diff 하이라이팅 등)
- [ ] 사용자 정의 테마 지원

### 고려사항
- Jekyll 빌드 성능 영향 최소화
- 브라우저 호환성 유지
- 접근성 기준 준수
- SEO 영향 없음 보장

---

📅 **마지막 업데이트**: 2025년 11월 6일  
🔧 **현재 버전**: Prism.js 1.29.0 (Material Theme)  
📚 **관련 문서**: [`../architecture/SYSTEM_ARCHITECTURE.md`](../architecture/SYSTEM_ARCHITECTURE.md)