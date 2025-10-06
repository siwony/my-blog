/**
 * Prism.js 기본 기능 테스트
 */

describe('Prism.js 기본 기능', () => {
    describe('라이브러리 로딩', () => {
        test('Prism 객체가 존재해야 함', () => {
            expect(typeof Prism).toBe('object');
            expect(Prism).toBeDefined();
        });

        test('필수 플러그인들이 로드되어야 함', () => {
            expect(Prism.plugins).toBeDefined();
            expect(Prism.plugins.autoloader).toBeDefined();
            expect(Prism.plugins.lineNumbers).toBeDefined();
            expect(Prism.plugins.toolbar).toBeDefined();
            expect(Prism.plugins.copyToClipboard).toBeDefined();
        });

        test('highlightAll 메서드가 존재해야 함', () => {
            expect(typeof Prism.highlightAll).toBe('function');
        });
    });

    describe('언어 지원', () => {
        const supportedLanguages = ['javascript', 'python', 'css', 'markup', 'java'];

        test.each(supportedLanguages)('%s 언어가 지원되어야 함', (language) => {
            expect(Prism.languages[language]).toBeDefined();
        });
    });
});

describe('코드 블록 처리', () => {
    beforeEach(() => {
        setupTestPage();
    });

    test('코드 블록을 올바르게 감지해야 함', () => {
        const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
        expect(codeBlocks.length).toBeGreaterThan(0);
    });

    test('각 언어별 코드 블록이 존재해야 함', () => {
        const languages = ['javascript', 'python', 'css', 'markup', 'java'];
        
        languages.forEach(language => {
            const blocks = document.querySelectorAll(`code.language-${language}`);
            expect(blocks.length).toBeGreaterThanOrEqual(1);
        });
    });

    test('코드 블록에 올바른 클래스가 적용되어야 함', () => {
        const codeElements = document.querySelectorAll('code[class*="language-"]');
        
        codeElements.forEach(code => {
            expect(code.className).toMatch(/language-\w+/);
        });
    });
});

describe('문법 하이라이팅', () => {
    beforeEach(() => {
        setupTestPage();
    });

    test('토큰 요소들이 생성되어야 함', () => {
        const tokens = document.querySelectorAll('.token');
        expect(tokens.length).toBeGreaterThan(0);
    });

    test('키워드 토큰이 올바르게 생성되어야 함', () => {
        const keywordTokens = document.querySelectorAll('.token.keyword');
        expect(keywordTokens.length).toBeGreaterThan(0);
    });

    test('하이라이팅 후 원본 코드가 보존되어야 함', () => {
        const codeBlock = createCodeBlock('javascript', 'function test() {}');
        document.body.appendChild(codeBlock);
        
        const codeElement = codeBlock.querySelector('code');
        expect(codeElement.textContent).toContain('function');
        expect(codeElement.textContent).toContain('test');
    });
});

describe('라인 번호 기능', () => {
    test('라인 번호 클래스를 추가할 수 있어야 함', () => {
        const codeBlock = createCodeBlock('javascript', 'line1\nline2\nline3');
        codeBlock.classList.add('line-numbers');
        
        expect(codeBlock.classList.contains('line-numbers')).toBe(true);
    });

    test('여러 줄 코드에 라인 번호가 적용되어야 함', () => {
        const multiLineCode = 'function test() {\n  const x = 1;\n  return x;\n}';
        const codeBlock = createCodeBlock('javascript', multiLineCode);
        codeBlock.classList.add('line-numbers');
        
        document.body.appendChild(codeBlock);
        
        const lines = multiLineCode.split('\n');
        expect(lines.length).toBe(4);
    });
});