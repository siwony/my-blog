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
- GitHub 스타일의 모던한 syntax highlighting
- 라인 번호 표시
- 코드 복사 기능
- 언어 표시
- 200+ 프로그래밍 언어 지원
- 자동 언어 감지

## Architecture

### Components
1. **Prism.js Core**: 기본 syntax highlighting 엔진
2. **Plugins**: 
   - AutoLoader: 필요한 언어 파일 자동 로딩
   - Line Numbers: 라인 번호 표시
   - Toolbar: 툴바 및 복사 버튼
   - Copy to Clipboard: 클립보드 복사 기능
   - Show Language: 언어명 표시
3. **CSS Integration**: 기존 Jekyll 테마와의 통합
4. **JavaScript Initialization**: DOM 로드 후 자동 초기화

### Integration Points
- Jekyll `_layouts/default.html`: Prism.js 라이브러리 로딩
- `assets/css/style.css`: 커스텀 스타일링
- `_config.yml`: Jekyll syntax highlighting 비활성화

## Implementation Details

### 1. Jekyll Configuration
```yaml
# Rouge highlighter 비활성화
highlighter: none
kramdown:
  syntax_highlighter: none
  syntax_highlighter_opts:
    disable: true
```

### 2. Library Integration
CDN을 통한 Prism.js 로딩:
- Core library: `prism-core.min.js`
- Plugin autoloader: 언어별 파일 자동 로딩
- CSS theme: GitHub 스타일 테마

### 3. Custom Styling
GitHub 스타일을 기반으로 한 커스텀 CSS:
- 반응형 디자인
- 접근성 고려
- 브랜드 색상 통합

## Benefits
- ✅ 향상된 코드 가독성
- ✅ 사용자 친화적인 기능 (복사, 라인 번호)
- ✅ 200+ 언어 지원
- ✅ 빠른 로딩 속도 (CDN 사용)
- ✅ 유지보수 용이성
- ✅ 모던한 UI/UX

## Testing Strategy
Jest 기반 테스트 스위트를 구축하여 다음을 검증:
- 라이브러리 로딩 상태
- 플러그인 기능
- 언어별 하이라이팅
- 성능 및 접근성
- 브라우저 호환성