---
author: jeongcool
categories: programming
date: '2022-03-17'
layout: post
tags:
- coding
- development
title: "DDD(Domain Driven Design)"
description: "도메인 중심 설계(DDD)로 복잡한 비즈니스 로직을 효과적으로 모델링하는 방법"
---
: 도메인을 중심으로 하는 개발 방식이다.  
&rarr; 도메인에 관련된 문제를 해결하는것.

- 복잡한 도메인을 해결하는 것을 높은 우선순위로 생각해 서비스를 만들어 나아간다.
- 복잡한 소프트웨어는 기술 자체의 복잡성 보다 도메인 자체의 복잡성에 기인한다.

### 등장배경

#### 빈약한 도메인 모델

- Getter와 Setter만으로 구성된 모델
- 데이터만 가지는 데이터홀더 개념
- Big Service Layer  

&rarr; 모델과 코드의 불일치가 발생하고 소통이 어려워진다.