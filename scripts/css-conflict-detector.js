#!/usr/bin/env node

/**
 * CSS Conflict Detection Script
 * 라이브러리와 충돌할 수 있는 CSS 클래스명을 감지합니다.
 */

const fs = require('fs');
const path = require('path');

// 라이브러리에서 사용하는 일반적인 클래스명들
const DANGEROUS_CLASSES = [
  // Prism.js classes
  'token', 'keyword', 'string', 'comment', 'number', 'operator',
  'punctuation', 'tag', 'attr-name', 'attr-value', 'namespace',
  'deleted', 'inserted', 'language-*', 'line-numbers',
  
  // Common UI library classes
  'button', 'input', 'form', 'modal', 'dropdown', 'navbar',
  'container', 'row', 'col', 'card', 'header', 'footer',
  'sidebar', 'content', 'main', 'navigation', 'menu',
  
  // Bootstrap classes
  'btn', 'nav', 'tab', 'fade', 'show', 'active', 'disabled',
  
  // Common generic names
  'text', 'bg', 'border', 'shadow', 'rounded', 'flex',
  'grid', 'block', 'inline', 'hidden', 'visible'
];

// 권장하는 안전한 접두사들
const SAFE_PREFIXES = [
  'blog-', 'post-', 'category-', 'sidebar-', 'pagination-',
  'metadata-', 'navigation-', 'header-', 'footer-'
];

/**
 * CSS 파일에서 클래스 선택자를 추출합니다.
 */
function extractClasses(cssContent) {
  const classRegex = /\.([a-zA-Z][\w-]*)/g;
  const classes = [];
  let match;
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    classes.push(match[1]);
  }
  
  return [...new Set(classes)]; // 중복 제거
}

/**
 * 위험한 클래스명을 감지합니다.
 */
function detectConflicts(classes) {
  const conflicts = [];
  const warnings = [];
  
  classes.forEach(className => {
    // 정확한 매치
    if (DANGEROUS_CLASSES.includes(className)) {
      conflicts.push({
        class: className,
        type: 'exact',
        reason: '라이브러리 클래스명과 정확히 일치'
      });
    }
    
    // 패턴 매치 (language-* 등)
    DANGEROUS_CLASSES.forEach(dangerousPattern => {
      if (dangerousPattern.includes('*')) {
        const pattern = dangerousPattern.replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(className)) {
          conflicts.push({
            class: className,
            type: 'pattern',
            reason: `패턴 ${dangerousPattern}과 일치`
          });
        }
      }
    });
    
    // 일반적인 단어 사용 경고
    if (className.length <= 4 && !SAFE_PREFIXES.some(prefix => className.startsWith(prefix.slice(0, -1)))) {
      warnings.push({
        class: className,
        type: 'short',
        reason: '너무 짧은 클래스명 (충돌 위험)'
      });
    }
    
    // 접두사 없는 일반적인 단어
    if (!SAFE_PREFIXES.some(prefix => className.startsWith(prefix.slice(0, -1))) && 
        className.match(/^(button|input|form|modal|card|text|bg)$/)) {
      warnings.push({
        class: className,
        type: 'generic',
        reason: '일반적인 단어 사용 (접두사 권장)'
      });
    }
  });
  
  return { conflicts, warnings };
}

/**
 * 개선 제안을 생성합니다.
 */
function generateSuggestions(className) {
  const suggestions = [];
  
  // 접두사 추가 제안
  SAFE_PREFIXES.forEach(prefix => {
    suggestions.push(`${prefix}${className}`);
  });
  
  // BEM 스타일 제안
  suggestions.push(`blog__${className}`);
  suggestions.push(`component__${className}`);
  
  return suggestions.slice(0, 3); // 상위 3개만
}

/**
 * CSS 파일을 분석합니다.
 */
function analyzeCSS(filePath) {
  try {
    const cssContent = fs.readFileSync(filePath, 'utf8');
    const classes = extractClasses(cssContent);
    const { conflicts, warnings } = detectConflicts(classes);
    
    return {
      filePath,
      totalClasses: classes.length,
      classes,
      conflicts,
      warnings
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * 결과를 출력합니다.
 */
function printResults(results) {
  console.log('🔍 CSS 충돌 감지 결과\\n');
  
  results.forEach(result => {
    if (!result) return;
    
    console.log(`📄 파일: ${result.filePath}`);
    console.log(`📊 총 클래스 수: ${result.totalClasses}`);
    
    if (result.conflicts.length > 0) {
      console.log('\\n❌ 충돌 위험:');
      result.conflicts.forEach(conflict => {
        console.log(`  • .${conflict.class} - ${conflict.reason}`);
        const suggestions = generateSuggestions(conflict.class);
        console.log(`    제안: ${suggestions.map(s => `.${s}`).join(', ')}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('\\n⚠️  경고:');
      result.warnings.forEach(warning => {
        console.log(`  • .${warning.class} - ${warning.reason}`);
      });
    }
    
    if (result.conflicts.length === 0 && result.warnings.length === 0) {
      console.log('✅ 충돌 위험 없음');
    }
    
    console.log('\\n' + '─'.repeat(50) + '\\n');
  });
}

/**
 * 메인 실행 함수
 */
function main() {
  const cssFiles = [
    path.join(__dirname, '..', 'assets', 'css', 'style.css')
  ];
  
  const results = cssFiles.map(analyzeCSS);
  printResults(results);
  
  // 요약 통계
  const totalConflicts = results.reduce((sum, r) => r ? sum + r.conflicts.length : sum, 0);
  const totalWarnings = results.reduce((sum, r) => r ? sum + r.warnings.length : sum, 0);
  
  console.log('📈 요약:');
  console.log(`총 충돌: ${totalConflicts}개`);
  console.log(`총 경고: ${totalWarnings}개`);
  
  if (totalConflicts > 0) {
    console.log('\\n💡 충돌을 해결하려면:');
    console.log('1. 접두사 사용: blog-, post-, component-');
    console.log('2. BEM 방법론 적용: block__element--modifier');
    console.log('3. CSS 변수 활용: var(--blog-primary-color)');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  extractClasses,
  detectConflicts,
  analyzeCSS,
  DANGEROUS_CLASSES,
  SAFE_PREFIXES
};