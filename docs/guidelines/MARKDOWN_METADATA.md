# 📝 Markdown 메타데이터 작성 규칙

Jekyll에서 사용하는 **Front Matter**는 YAML 형식으로 작성되며, 모든 마크다운 파일 상단에 위치해야 합니다.

## 기본 구조

```yaml
---
layout: post                    # 필수: 사용할 레이아웃 (post, page, category)
title: "포스트 제목"            # 필수: 포스트 제목 (따옴표 권장)
date: 2024-01-01               # 필수: 발행 날짜 (YYYY-MM-DD 형식)
categories: programming        # 필수: 카테고리 (단일)
excerpt: "포스트 요약"         # 선택: 포스트 요약문
author: "작성자명"             # 선택: 작성자
tags: [javascript, tutorial]  # 선택: 태그 배열
published: true               # 선택: 발행 여부 (기본값: true)
---
```

## 카테고리 지정 방법

### 단일 카테고리
```yaml
categories: programming
```

### 다중 카테고리
```yaml
categories: [programming, tutorial]
# 또는
categories:
  - programming
  - tutorial
```

## 작성 규칙

1. **파일명 규칙**: `YYYY-MM-DD-title.md` 형식 준수
2. **Front Matter 위치**: 파일 최상단, `---`로 시작과 끝을 표시
3. **인코딩**: UTF-8 사용
4. **따옴표 사용**: 특수문자나 공백이 포함된 값은 따옴표로 감싸기
5. **날짜 형식**: `YYYY-MM-DD` 또는 `YYYY-MM-DD HH:MM:SS` 형식
6. **카테고리명**: 소문자, 하이픈 사용 (예: `web-development`)

## 예시

### 블로그 포스트
```yaml
---
layout: post
title: "JavaScript ES6 완벽 가이드"
date: 2024-01-15
categories: programming
tags: [javascript, es6, tutorial]
excerpt: "JavaScript ES6의 주요 기능들을 상세히 알아봅니다."
---
```

### 카테고리 페이지
```yaml
---
layout: category
category: programming
title: Programming Posts
permalink: /category/programming/
---
```

## 자주 사용하는 필드

| 필드 | 설명 | 예시 |
|------|------|------|
| `layout` | 사용할 레이아웃 템플릿 | `post`, `page`, `category` |
| `title` | 포스트 제목 | `"JavaScript 기초"` |
| `date` | 발행 날짜 | `2024-01-01` |
| `categories` | 카테고리 | `programming` 또는 `[programming, tutorial]` |
| `tags` | 태그 | `[javascript, tutorial, beginner]` |
| `excerpt` | 포스트 요약 | `"이 포스트에서는..."` |
| `author` | 작성자 | `"작성자명"` |
| `published` | 발행 여부 | `true` 또는 `false` |
| `permalink` | 고정 링크 | `"/custom-url/"` |

## 주의사항

- **특수문자**: 제목에 콜론(`:`)이나 따옴표가 있으면 반드시 전체를 따옴표로 감싸기
- **날짜 형식**: Jekyll은 `YYYY-MM-DD` 형식만 인식
- **카테고리명**: URL에 사용되므로 영문 소문자와 하이픈 권장
- **인코딩**: 한글 내용은 UTF-8로 저장
- **공백**: YAML에서 콜론(`:`) 뒤에는 반드시 공백 필요

## 고급 사용법

### 커스텀 변수 정의
```yaml
---
layout: post
title: "커스텀 변수 예시"
custom_field: "커스텀 값"
difficulty: "중급"
reading_time: 10
---
```

### 조건부 발행
```yaml
---
layout: post
title: "미발행 포스트"
published: false  # 빌드 시 제외됨
---
```

### 다국어 지원
```yaml
---
layout: post
title: "한국어 제목"
title_en: "English Title"
lang: ko
---
```

## 🔗 Open Graph (링크 미리보기) 설정

Discord, Slack, Twitter, Facebook 등에서 링크 공유 시 카드형 미리보기를 커스터마이징할 수 있습니다.

### 기본 동작

- **제목**: `title` 필드 사용
- **설명**: 포스트 본문에서 자동 추출 (마크다운 문법 제거됨)
- **이미지**: 기본 OG 이미지 (`/assets/images/og-default.png`) 사용

### 포스트별 대표 이미지 설정

`image` 필드를 사용하여 포스트별 Open Graph 이미지를 지정할 수 있습니다:

```yaml
---
layout: post
title: "JavaScript ES6 완벽 가이드"
date: 2024-01-15
categories: programming
image: /assets/images/posts/programming/es6-guide-og.png
---
```

### image 필드 규칙

| 항목 | 설명 |
|------|------|
| **경로** | `/assets/images/`로 시작하는 절대 경로 사용 |
| **권장 크기** | 1200 x 630 픽셀 (1.91:1 비율) |
| **최소 크기** | 600 x 315 픽셀 |
| **파일 형식** | PNG 또는 JPG 권장 |
| **파일 크기** | 5MB 이하 권장 |

### 설명(Description) 커스터마이징

자동 추출 대신 직접 설명을 지정하려면 `description` 필드를 사용합니다:

```yaml
---
layout: post
title: "JavaScript ES6 완벽 가이드"
description: "ES6의 주요 기능인 화살표 함수, 템플릿 리터럴, 구조 분해 할당 등을 상세히 알아봅니다."
image: /assets/images/posts/programming/es6-guide.png
---
```

### 미리보기 테스트 도구

링크 미리보기가 올바르게 표시되는지 테스트할 수 있는 도구들:

- **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)
- **일반**: [OpenGraph.xyz](https://www.opengraph.xyz/)

이 규칙들을 따르면 Jekyll에서 포스트가 올바르게 처리되고, 카테고리 시스템과 검색 기능이 정상적으로 작동합니다.