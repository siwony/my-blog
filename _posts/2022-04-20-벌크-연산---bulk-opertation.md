---
author: jeongcool
categories: jpa
date: '2022-04-20'
layout: post
tags:
- spring
- jpa
title: "[JPA] 벌크 연산 - Bulk Opertation"
description: "JPA의 벌크 연산으로 대량 데이터를 효율적으로 업데이트/삭제하는 방법과 영속성 컨텍스트 관리"
---
> `executeUpdate()`
- 여러 건을 하나의 쿼리로 수정하거나 삭제하는 방법


### 주의사항
**벌크 연산은 영속성 컨텍스르를 무시하고 DB에 직접 쿼리**하므로 벌크 연산을 먼저 실행 후 영속성 컨텍스트를 초기화 하는 방법을 추천한다. 그렇지 않으면 영속성 컨텍스트에 저장된 값과 DB에 저장되어 있는 값에 대한 데이터 정합성이 발생한다.