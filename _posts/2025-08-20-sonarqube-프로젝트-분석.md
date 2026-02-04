---
author: jeongcool
categories: devops
date: '2025-08-20'
layout: post
tags:
- sonarqube
- code-quality
- maven
title: "SonarQube로 프로젝트 분석하기"
---

# 주의사항

- SonarQube Maven 플러그인 사용시 java17를 사용해야 한다.
    - 프로젝트 java version을 바꿀 필요가 없음

# SonarQube 원하는 프로젝트 생성하기

![Create Project 버튼 클릭](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/84fd09a6-13d4-4327-ba09-7b6865daab7e.png)

![Local Project 선택](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.18.10.png)

![프로젝트 정보 입력](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.21.22.png)

1. 초기 페이지에서 우측 상단 "Create Project" 클릭
2. LocalProject 클릭
3. create Create a local Project 화면에서 생성할 프로젝트 정보 입력
4. Next 버튼 클릭
5. Use the global setting 체크
    - 빠르게 만들기 위해 해당 설정을 사용함. 원하는 설정 있으면 적용하시길
6. Create Project 버튼 클릭으로 프로젝트 생성

# maven으로 코드 분석하기

![Locally 클릭](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.22.10.png)

![토큰 생성](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.25.59.png)

![프로젝트 타입 선택](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.27.11.png)

![명령어 복사](/assets/img/posts/2025-08-20-sonarqube-프로젝트-분석/CleanShot_2025-08-20_at_10.29.34.png)

1. 프로젝트 화면에서 Locally 클릭
2. Analyze Your Project에서 원하는 토큰이름
3. 만료일 입력 후
4. Generate 버튼클릭
5. 토큰 매모 후
6. Continue 버튼클릭
7. 원하는 Project 클릭 후 
8. 명령어 Copy
    - mvn 을 직접 사용하는 것 보다 project의 mvnw 를 사용하는걸 추천함
    - gradle인 경우 gradle 클릭해서 해당 명령어 copy
9. 이제 프로젝트에서 해당 명령어 실행

- 참고) 9번 명령어 실행 시 maven runtime version 에러가 날 때 (61.0 이상이 필요하다는 에러)
    - 플러그인 실행을 위해  61 = java 17 이상이 필요함 (프로젝트 java version을 올릴 필요는 없음)
    - 로컬 java 17 위치 찾아서 아래 명령어 실행
        - window cmd인 경우
            
            ```bash
            set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17
            set PATH=%JAVA_HOME%\bin;%PATH%
            ```
            
        - Git Bash인 경우
            
            ```bash
            export JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-17"
            export PATH="$JAVA_HOME/bin:$PATH"
            ```
            
        - 실행 후 아래 명령어로 메이븐 실행 버전 확인
            
            ```bash
            mvn -v 혹은 ./mvnw -v
            ```
            
        - Java version: 17 이상으로 나오면 됨
