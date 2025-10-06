/**
 * Jest 테스트 환경 설정
 * DOM 환경과 Prism.js를 모킹합니다.
 */

// Mock Prism.js 객체
global.Prism = {
    plugins: {
        autoloader: {
            languages_path: ''
        },
        lineNumbers: true,
        toolbar: true,
        copyToClipboard: true
    },
    highlightAll: jest.fn(),
    highlight: jest.fn((code, grammar, language) => {
        // 간단한 토큰화 시뮬레이션
        return code.replace(/\b(function|const|let|var|class|if|else|for|while)\b/g, 
            '<span class="token keyword">$1</span>');
    }),
    languages: {
        javascript: {},
        python: {},
        css: {},
        markup: {},
        java: {}
    }
};

// DOM 요소 생성 헬퍼 함수들
global.createCodeBlock = (language, code) => {
    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');
    
    pre.className = `language-${language}`;
    codeElement.className = `language-${language}`;
    codeElement.textContent = code;
    
    pre.appendChild(codeElement);
    return pre;
};

global.createHighlightedCodeBlock = (language, code) => {
    const pre = global.createCodeBlock(language, code);
    const codeElement = pre.querySelector('code');
    
    // 토큰 요소 추가 (하이라이팅 시뮬레이션)
    const tokens = code.match(/\b(function|const|let|var|class|if|else|for|while)\b/g) || [];
    tokens.forEach(() => {
        const token = document.createElement('span');
        token.className = 'token keyword';
        codeElement.appendChild(token);
    });
    
    return pre;
};

// 테스트용 페이지 상태 초기화
global.setupTestPage = () => {
    document.body.innerHTML = '';
    
    // 여러 언어의 코드 블록 추가
    const testCodes = [
        { language: 'javascript', code: 'function test() { const x = 1; }' },
        { language: 'python', code: 'def test(): x = 1' },
        { language: 'css', code: '.test { color: red; }' },
        { language: 'markup', code: '<div class="test">Hello</div>' },
        { language: 'java', code: 'public class Test { private int x; }' }
    ];
    
    testCodes.forEach(({ language, code }) => {
        const block = global.createHighlightedCodeBlock(language, code);
        document.body.appendChild(block);
    });
};

// 각 테스트 전에 DOM 초기화
beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = '';
    
    // Prism 모킹 함수 초기화
    global.Prism.highlightAll.mockClear();
    global.Prism.highlight.mockClear();
});