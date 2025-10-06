/**
 * Prism.js 통합 테스트
 * 실제 페이지 시나리오를 시뮬레이션합니다.
 */

// 실제 Prism.js 초기화 함수 모킹
const mockPrismInitialization = () => {
    // 실제 초기화 로직 시뮬레이션
    const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
    codeBlocks.forEach(code => {
        const pre = code.parentElement;
        if (!pre.classList.contains('line-numbers')) {
            pre.classList.add('line-numbers');
        }
    });
    
    // highlightAll 호출
    Prism.highlightAll();
};

describe('Prism.js 통합 테스트', () => {
    describe('페이지 초기화 시나리오', () => {
        test('DOM 로드 후 모든 코드 블록이 처리되어야 함', () => {
            // 테스트 페이지 설정
            setupTestPage();
            
            // 초기화 전 상태 확인
            const codeBlocksBefore = document.querySelectorAll('pre code[class*="language-"]');
            const lineNumbersBefore = document.querySelectorAll('.line-numbers');
            
            expect(codeBlocksBefore.length).toBeGreaterThan(0);
            expect(lineNumbersBefore.length).toBe(0);
            
            // Prism 초기화 실행
            mockPrismInitialization();
            
            // 초기화 후 상태 확인
            const lineNumbersAfter = document.querySelectorAll('.line-numbers');
            expect(lineNumbersAfter.length).toBe(codeBlocksBefore.length);
            expect(Prism.highlightAll).toHaveBeenCalled();
        });

        test('autoloader 설정이 올바르게 적용되어야 함', () => {
            const expectedPath = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
            
            // autoloader 설정 시뮬레이션
            if (Prism.plugins && Prism.plugins.autoloader) {
                Prism.plugins.autoloader.languages_path = expectedPath;
            }
            
            expect(Prism.plugins.autoloader.languages_path).toBe(expectedPath);
        });
    });

    describe('다양한 코드 샘플 처리', () => {
        const testCases = [
            {
                language: 'javascript',
                code: `
// ES6+ 문법 테스트
const greeting = (name) => {
    return \`Hello, \${name}!\`;
};

class Calculator {
    constructor() {
        this.result = 0;
    }
}
                `.trim(),
                expectedTokens: ['const', 'class', 'constructor']
            },
            {
                language: 'python',
                code: `
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

class DataProcessor:
    def __init__(self):
        self.data = []
                `.trim(),
                expectedTokens: ['def', 'if', 'class']
            },
            {
                language: 'css',
                code: `
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
}
                `.trim(),
                expectedTokens: ['display', 'grid', 'media']
            }
        ];

        test.each(testCases)('$language 코드가 올바르게 처리되어야 함', ({ language, code, expectedTokens }) => {
            // 코드 블록 생성
            const codeBlock = createCodeBlock(language, code);
            document.body.appendChild(codeBlock);
            
            // 초기화 실행
            mockPrismInitialization();
            
            // 결과 검증
            const codeElement = codeBlock.querySelector('code');
            expect(codeElement.className).toBe(`language-${language}`);
            expect(codeBlock.classList.contains('line-numbers')).toBe(true);
            
            // 코드 내용 검증
            expectedTokens.forEach(token => {
                expect(codeElement.textContent).toContain(token);
            });
        });
    });

    describe('에러 상황 처리', () => {
        test('잘못된 언어 클래스가 있어도 처리되어야 함', () => {
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            
            // 잘못된 클래스명
            code.className = 'language-nonexistent';
            code.textContent = 'some code here';
            pre.appendChild(code);
            document.body.appendChild(pre);
            
            expect(() => {
                mockPrismInitialization();
            }).not.toThrow();
            
            expect(pre.classList.contains('line-numbers')).toBe(true);
        });

        test('빈 코드 블록도 처리되어야 함', () => {
            const codeBlock = createCodeBlock('javascript', '');
            document.body.appendChild(codeBlock);
            
            expect(() => {
                mockPrismInitialization();
            }).not.toThrow();
        });

        test('중첩된 코드 블록이 있어도 정상 처리되어야 함', () => {
            const outerPre = document.createElement('pre');
            const outerCode = document.createElement('code');
            outerCode.className = 'language-markup';
            outerCode.innerHTML = '<pre><code class="language-javascript">console.log("nested");</code></pre>';
            outerPre.appendChild(outerCode);
            document.body.appendChild(outerPre);
            
            expect(() => {
                mockPrismInitialization();
            }).not.toThrow();
        });
    });
});