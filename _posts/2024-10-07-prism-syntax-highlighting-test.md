---
layout: post
title: "Prism.js Syntax Highlighting 테스트"
date: 2024-10-07 12:00:00 +0900
categories: programming
tags: [javascript, python, java, prism, syntax-highlighting]
---

이 포스트는 새로 적용된 Prism.js syntax highlighting을 테스트하기 위한 글입니다.

## JavaScript 예제

```javascript
// 피보나치 수열 생성 함수
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 배열 메서드 활용
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(`Original: ${numbers}`);
console.log(`Doubled: ${doubled}`);
```

## Python 예제

```python
# 클래스 정의
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def get_history(self):
        return self.history

# 사용 예제
calc = Calculator()
result = calc.add(10, 20)
print(f"결과: {result}")

# 리스트 컴프리헨션
squares = [x**2 for x in range(10) if x % 2 == 0]
print(f"짝수의 제곱: {squares}")
```

## CSS 예제

```css
/* 반응형 그리드 레이아웃 */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
```

## HTML 예제

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>샘플 페이지</title>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <ul class="nav-list">
                <li><a href="#home">홈</a></li>
                <li><a href="#about">소개</a></li>
                <li><a href="#contact">연락처</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="main-content">
        <section id="hero">
            <h1>환영합니다!</h1>
            <p>이것은 샘플 HTML 코드입니다.</p>
        </section>
    </main>
</body>
</html>
```

## Java 예제

```java
// 제네릭 클래스
public class Stack<T> {
    private ArrayList<T> items;
    
    public Stack() {
        this.items = new ArrayList<>();
    }
    
    public void push(T item) {
        items.add(item);
    }
    
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return items.remove(items.size() - 1);
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    public int size() {
        return items.size();
    }
}

// 사용 예제
Stack<String> stringStack = new Stack<>();
stringStack.push("Hello");
stringStack.push("World");
System.out.println(stringStack.pop()); // "World"
```

## Inline 코드 테스트

여기서 `console.log()`는 JavaScript의 출력 함수이고, `print()`는 Python의 출력 함수입니다. 
CSS에서는 `display: flex;`를 사용하여 플렉스 레이아웃을 만들 수 있습니다.

## 기능 테스트

Prism.js의 주요 기능들:
- ✅ 자동 언어 감지
- ✅ 라인 번호 표시
- ✅ 코드 복사 기능
- ✅ 언어 표시
- ✅ 문법 하이라이팅

코드 블록 위에 마우스를 올려보시면 복사 버튼이 나타납니다!