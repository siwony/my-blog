---
layout: post
title: "Markdown 테이블 기능 테스트"
date: 2025-11-09
categories: [test, markdown]
---

# Markdown 테이블 렌더링 테스트

이 포스트는 새로 구현된 GitHub 스타일 Markdown 테이블 기능을 테스트하기 위한 문서입니다.

## 1. 기본 테이블

| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |
| Bob  | 35  | SF   |

## 2. 정렬 테이블

| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| Left aligned | Center aligned | Right aligned |
| 왼쪽 정렬 | 중앙 정렬 | 오른쪽 정렬 |

## 3. 복잡한 내용이 포함된 테이블

| Method | Description | Status Code | Response |
|--------|-------------|:----------:|----------|
| `GET` | **조회** 요청 | `200` | ✅ Success |
| `POST` | *생성* 요청 | `201` | 🎉 Created |
| `PUT` | **수정** 요청 | `200` | ✏️ Updated |
| `DELETE` | ~~삭제~~ 요청 | `204` | 🗑️ Deleted |

## 4. 링크와 코드가 포함된 테이블

| Framework | Language | Documentation | Example |
|-----------|----------|---------------|---------|
| [React](https://react.dev) | JavaScript | `npm install react` | `<Component />` |
| [Vue](https://vuejs.org) | JavaScript | `npm install vue` | `{{ message }}` |
| [Spring Boot](https://spring.io/projects/spring-boot) | Java | `@SpringBootApplication` | `@RestController` |

## 5. 긴 내용이 포함된 테이블

| Feature | Description | Implementation Details |
|---------|-------------|------------------------|
| Authentication | 사용자 인증 및 권한 관리 시스템 | JWT 토큰 기반 인증, Role-based 접근 제어, OAuth 2.0 지원 |
| Database | 데이터베이스 연동 및 ORM | Spring Data JPA, MySQL 8.0, Connection Pooling with HikariCP |
| Caching | 성능 향상을 위한 캐싱 전략 | Redis 클러스터, Spring Cache Abstraction, Cache-aside 패턴 |

## 6. 빈 셀이 포함된 테이블

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   |          | Data 6   |
|          | Data 5   |          |
| Data 7   | Data 8   | Data 9   |

## 7. 특수문자가 포함된 테이블

| Symbol | Meaning | Usage |
|:------:|---------|-------|
| `&` | Ampersand | HTML entity: `&amp;` |
| `<` | Less than | HTML entity: `&lt;` |
| `>` | Greater than | HTML entity: `&gt;` |
| `"` | Quote | HTML entity: `&quot;` |

## 반응형 테스트 안내

- **데스크톱**: 테이블이 전체 너비로 표시됩니다
- **태블릿**: 테이블이 적절히 축소되어 표시됩니다  
- **모바일**: 가로 스크롤이 활성화되어 테이블을 볼 수 있습니다

## 접근성 기능

- 스크린 리더를 위한 `role="table"` 속성
- 헤더 셀에 `scope="col"` 속성 적용
- 키보드 네비게이션 지원
- 호버 효과로 현재 행 강조

---

**참고**: 이 기능은 GitHub 테이블 스타일을 참고하여 구현되었습니다.