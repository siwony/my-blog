---
author: jeongcool
categories: devops
date: '2025-10-07'
layout: post
tags:
- gradle
- maven
- build
title: "[Gradle] Maven에서 Gradle로 이전"
---

# Maven 에서 Gradle로 이전

Maven에서 Gradle로 이전하는 방법은 꽤 쉽다. `gradle init` 명령어를 통해 쉽게 이전이 가능하다

gradle이 `pom.xml` 를 읽어서 gradle 프로젝트로 알아서 변환해준다.

# Gradle 설치방법

## Windows - chocolatey

1. 관리자 모드로 Powershell 실행
2. `choco install gradle` 입력

## Mac - Homebrew

1. open terminal
2. `brew install gradle` 입력

# gradle init

프로젝트에서 `gradle init` 을 하는 방법에 대해 기술한다.

pom.xml이 있는 프로젝트에서 `gradle init` 을 호출하는 경우 Maven 빌드를 찾았다며, 이를 기반으로 빌드 할 건지 물어보게 된다. 따라서 yes를 입력하여 엔터한다.

![gradle init step 1](/assets/img/posts/2025-10-07-maven-gradle-이전/CleanShot_2025-10-07_at_00.19.032x.png)

그 이후 build script를 어떤 언어로 작성할 선택하라고 한다. 선택할 수 있는 언어는 Groovy와 Kotlin이 있다.

선택은 취향차이긴 하나 점진적으로 

- gradle이 kotlin으로 이동하려는 추세이고
- intellij의 강력한 kotlin 지원으로 인해 필자는 kotlin을 선택하려고 한다.

![gradle init step 2](/assets/img/posts/2025-10-07-maven-gradle-이전/CleanShot_2025-10-07_at_00.22.162x.png)

이후 "Generate build using new APIs and behavior (some features may change in the next minor release)" 문구가 뜨면서 yes, no를 입력하라고 하는데 no를 한다.

만약 yes를 하는 경우 gradle의 최신기능을 사용할 수 있으나 안정적이지 않으므로 no로 입력한다. (기본값도 no이다)

![gradle init step 3](/assets/img/posts/2025-10-07-maven-gradle-이전/CleanShot_2025-10-07_at_00.30.072x.png)

이후 완료되면 아래와 같이 출력된다.

![gradle init step 4](/assets/img/posts/2025-10-07-maven-gradle-이전/CleanShot_2025-10-07_at_00.30.372x.png)

그리고 프로젝트에 gradle 관련 파일이 생성된 것을 확인할 수 있을것이다.

![gradle init step 5](/assets/img/posts/2025-10-07-maven-gradle-이전/CleanShot_2025-10-07_at_00.31.002x.png)

이후 gradle warpper를 사용하여 build가 올바르게 되는지 확인한다.

- `./gradlew build` or `./gradlew.bat build`

## 생성된 파일 설명

- `gradle`
    - 해당 디랙토리는 gradle에 대한 wapper와 version catalog기능에서 사용되는 `libs.versions.toml` 파일을 담고있다.
    - version catalog 관련 글은 아래 레퍼런스를 참고하면 도움이 된다.
        - https://docs.gradle.org/current/userguide/version_catalogs.html
        - https://cheonjaeung.com/posts/manage-dependencies-with-gradle-version-catalogs/
- `build.gradle.kts`
    - 해당 파일은 maven의 `pom.xml` 과 같은 역할을 수행한다.
    - `.kts` 확장자는 kotlin을 나타내며 kotlin으로 빌드 스크립트를 작성한다.
- `gradle.properties`
    - gradle에 대한 환경 변수에 대한 정보를 담고있다.
    - 자세한 내용은 https://docs.gradle.org/current/userguide/build_environment.html 를 참고한다.
- `gradlew`
    - gradle에 대한 wapper (Unix 계열)
- `gradlew.bat`
    - gradle에 대한 wapper (Windows 계열)
- `setting.gradle.kts`
    - gradle에 대한 설정 파일이다.
    - 프로젝트 수준 저장소 설정을 정의하고, 앱을 빌드할 때 포함해야 하는 모듈을 Gradle에 알려준다.

# 이전 후 확인해야 하는 사항들

maven 에서 gradle로 이전시 확인이 필요한 부분에 대해 기술한다.

## 버전 카탈로그 확인

`project-root/gradle/libs.versions.toml` 파일에 모든 의존성에 대한 버전이 명시되어 있다. 적절히 버전을 풀어서 build.gradle에 dependencies에 명시하거나 아니면 spring boot bom 과 같이 버전 메니징 관련된 코드는 제거하는 등 작업이 필요하다.

## Spring Boot 프로젝트를 gradle로 이전하는 경우

maven에서 적용한 spring boot의 dependency manage (BOM)이 적용되지 않으므로 수동으로 plugin을 추가해야 한다.

`pom.xml` 를 살펴보면 아래와 같은 구문이 존재한다.

```xml
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.5.3</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
```

해당 구문을 build.gradle.kts로 치환하면 다음과 같다

```kotlin
plugins { // plugin 선언
    id("io.spring.dependency-management") version "1.1.7" // spring dependency-managenet 플러그인 선언
    id("org.springframework.boot") version "3.5.3" // spring boot 3.5.3사용
}
```

아래와 같이 선언이 되어야 spring boot관련 의존성에 대해 버전명시 없이 사용이 가능하다.

## Querydsl 사용

querydsl은 아래와 같이 annotationProcessor를 명시해야 한다.

```kotlin
dependencies {
		...생략
    
    implementation("com.querydsl:querydsl-jpa:5.1.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.1.0:jakarta")
    annotationProcessor("jakarta.annotation:jakarta.annotation-api:2.1.1")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api:3.1.0")
   
		...생략
}
```

querydsl의 표준 annotationProcessor를 통해 QClass를 생성해야 build시 정상적인 querydsl 사용이 가능하다.

## Lombok 사용

lombok사용시 다음과 같이 annotationProcessor를 명시해야 한다.

```kotlin
dependencies {
		...생략
    implementation("org.projectlombok:lombok") // lombok에 대한 의존성 명시 (spring boot에서는 버전 생략_
    annotationProcessor("org.projectlombok:lombok") // lombok에 대한 annotation processor 선언 
		...생략
}
```

# Referenece

- https://shanepark.tistory.com/360
- https://docs.gradle.org/current/javadoc/org/gradle/buildinit/tasks/InitBuild.html?utm_source=chatgpt.com - Generate build using new APIs and behavior 관련 레퍼런스
