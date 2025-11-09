# Markdown Table Rendering Feature

## 개요
Markdown 문법으로 작성된 테이블을 GitHub 스타일의 UI로 렌더링하는 기능을 구현합니다.

## 기능 요구사항

### 1. Markdown 테이블 파싱
- 표준 Markdown 테이블 문법 지원
- 헤더 행과 구분선 인식
- 컬럼 정렬 지원 (좌측, 중앙, 우측)

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Left     | Center   | Right    |
| Data 1   | Data 2   | Data 3   |
```

### 2. GitHub 스타일 UI 구현

#### 시각적 특징
- **테두리**: 회색 테두리 (`#d1d9e0`)
- **헤더 배경**: 연한 회색 (`#f6f8fa`)
- **줄무늬**: 홀수/짝수 행 구분 (`#f6f8fa` / `transparent`)
- **호버 효과**: 행에 마우스 오버 시 하이라이트
- **반응형**: 모바일에서 가로 스크롤 지원

#### CSS 스타일 가이드
```css
.markdown-table {
  border-collapse: collapse;
  margin: 16px 0;
  width: 100%;
  overflow: auto;
  border-spacing: 0;
}

.markdown-table th,
.markdown-table td {
  padding: 6px 13px;
  border: 1px solid #d1d9e0;
}

.markdown-table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-table tr:hover {
  background-color: #f5f5f5;
}
```

### 3. 정렬 기능
- `:---` (좌측 정렬)
- `:---:` (중앙 정렬)  
- `---:` (우측 정렬)

### 4. 접근성 고려사항
- 스크린 리더를 위한 table 요소 사용
- 헤더 셀에 `th` 태그 적용
- `scope` 속성 추가

## 구현 방법

### 1. 정규표현식을 이용한 테이블 감지
```javascript
const tableRegex = /\|(.+)\|\s*\n\|[-:\s\|]+\|\s*\n((?:\|.*\|\s*\n?)*)/gm;
```

### 2. 파싱 로직
```javascript
function parseMarkdownTable(markdown) {
  const tables = [];
  let match;
  
  while ((match = tableRegex.exec(markdown)) !== null) {
    const headerRow = match[1];
    const alignmentRow = match[2];
    const bodyRows = match[3];
    
    // 테이블 객체 생성
    tables.push({
      headers: parseRow(headerRow),
      alignments: parseAlignment(alignmentRow),
      rows: parseBodyRows(bodyRows)
    });
  }
  
  return tables;
}
```

### 3. HTML 렌더링
```javascript
function renderTable(tableData) {
  return `
    <div class="table-wrapper">
      <table class="markdown-table">
        <thead>
          <tr>
            ${tableData.headers.map((header, index) => 
              `<th style="text-align: ${tableData.alignments[index]}">${header}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableData.rows.map(row => 
            `<tr>
              ${row.map((cell, index) => 
                `<td style="text-align: ${tableData.alignments[index]}">${cell}</td>`
              ).join('')}
            </tr>`
          ).join('')}
        </tbody>
      </table>
    </div>
  `;
}
```

## 예상 결과

### 입력 (Markdown)
```markdown
| Name | Age | City |
|------|:---:|-----:|
| John | 25  | NYC  |
| Jane | 30  | LA   |
```

### 출력 (HTML)
GitHub과 동일한 스타일의 테이블이 렌더링됩니다:
- 헤더는 굵은 글씨와 회색 배경
- 데이터 행은 번갈아가며 회색/투명 배경
- 호버 시 하이라이트 효과
- Age 컬럼은 중앙 정렬, City 컬럼은 우측 정렬

## 추가 고려사항

### 1. 성능 최적화
- 큰 테이블의 경우 가상 스크롤링 고려
- 렌더링 최적화를 위한 메모이제이션

### 2. 확장 기능
- 테이블 정렬 기능 (클릭으로 정렬)
- 테이블 검색/필터링
- CSV 내보내기 기능

### 3. 모바일 대응
```css
@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

## 테스트 케이스

### 기본 테이블
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### 정렬 테이블
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
```

### 복잡한 내용
```markdown
| Code | Description | Status |
|------|-------------|:------:|
| `200` | OK | ✅ |
| `404` | Not Found | ❌ |
```
