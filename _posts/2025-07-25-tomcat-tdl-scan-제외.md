---
author: jeongcool
categories: devops
date: '2025-07-25'
layout: post
tags:
- tomcat
- performance
- optimization
title: "불필요한 TDL scan 제외로 tomcat 구동시간 개선하기"
---

tomcat 환경에서 개발하다보면 간혹 아래와 같은 로그가 보일때가 있다.

```powershell
org.apache.jasper.servlet.TldScanner.scanJars At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.

혹은

적어도 하나의 JAR가 TLD들을 찾기 위해 스캔되었으나 아무 것도 찾지 못했습니다. 스캔했으나 TLD가 없는 JAR들의 전체 목록을 보시려면, 로그 레벨을 디버그 레벨로 설정하십시오. 스캔 과정에서 불필요한 JAR들을 건너뛰면, 시스템 시작 시간과 JSP 컴파일 시간을 단축시킬 수 있습니다.
```

tomcat은 기본적으로 아래와 같은 jar 파일을 스켄한다`

- 특정 애노테이션을 가진 클래스 검색
- TLD 파일

해당 글은 TLD파일의 스캔을 제외하여 tomcat 구동시간을 단축할것이다.

그러면 어떻게 제외할 jar를 찾을 수 있을까? `logging.properties` 파일에서 logging을 활성화 하면 된다.

```bash
# 탐색하는 Jar 파일 목록 출력
org.apache.catalina.startup.ContextConfig.level = FINE

# TLD 관련 로그 출력
org.apache.jasper.servlet.TldScanner.level = FINE
```

그 후 아래와 같은 로그가 나올것이다.

```bash
5-Jul-2025 10:26:21.790 미세 [RMI TCP Connection(2)-127.0.0.1] org.apache.jasper.servlet.TldScanner$TldScannerCallback.scan [file:/Users/jeongcool/tomcat/tomcat-9.0.102/webapps/ROOT/WEB-INF/lib/aws-java-sdk-cloudwatchmetrics-1.11.154.jar]에서 TLD 파일들을 찾을 수 없습니다. CATALINA_BASE/conf/catalina.properties 파일 내의 tomcat.util.scan.StandardJarScanFilter.jarsToSkip 프로퍼티에, 해당 JAR를 추가하는 것을 고려하십시오.
25-Jul-2025 10:26:21.790 미세 [RMI TCP Connection(2)-127.0.0.1] org.apache.jasper.servlet.TldScanner$TldScannerCallback.scan [file:/Users/jeongcool/tomcat/tomcat-9.0.102/webapps/ROOT/WEB-INF/lib/lucy-xss-1.6.3.jar]에서 TLD 파일들을 찾을 수 없습니다. CATALINA_BASE/conf/catalina.properties 파일 내의 tomcat.util.scan.StandardJarScanFilter.jarsToSkip 프로퍼티에, 해당 JAR를 추가하는 것을 고려하십시오.
```

그러면 해당 jar 파일들을 `catalina.properties` 를 수정하여 TDL 스켄 제외 대상을 설정하면 된다.

```bash
... 생략

tomcat.util.scan.StandardJarScanFilter.jarsToSkip=\
annotations-api.jar,\ # 위 로그에서 나온 jar 파일 명시
ant-junit*.jar,\ # *로 와일드카드 문법을 사용할 수 있다.
ant-launcher*.jar,\
ant*.jar,\
asm-*.jar,\
aspectj*.jar,\
bcel*.jar,\
biz.aQute.bnd*.jar

... 생략
```

아래는 tomcat 프로젝트에서 테스트 한 결과인데 대략 7.4초 정도 걸렸던 배포 시간이 5.7초 정도로 약 23% 개선되었다.

- 테스트 환경 :
    - tomcat 9.0.102
    - macbook pro m4
    - RAM : 24 GB
    - CORE : 14

아래는 프로젝트에 추가한 jar 제외 목록들이다.

```bash
aws-java-sdk-*.jar,\
javax.annotation-api-*.jar,\
jjwt-*.jar,\
jcl-over-slf4j-*.jar,\
gson-*.jar,\
common-io-*.jar,\
common-image-*.jar,\
json-*.jar,\
json-smart-*.jar,\
filters-*.jar,\
activation-*.jar,\
javax.servlet-api-*.jar,\
jakarta.inject-*.jar,\
poi-*.jar,\
poi-ooxml-*.jar,\
poi-ooxml-schemas-*.jar,\
tiles-*.jar,\
tiles-request-*.jar,\
tiles-core-*.jar,\
tiles-servlet-*.jar,\
tiles-jsp-*.jar,\
tiles-template-*.jar,\
tiles-request-servlet-*.jar,\
spring-webmvc-*.jar,\
spring-web-*.jar,\
spring-core-*.jar,\
spring-beans-*.jar,\
spring-context-*.jar,\
spring-expression-*.jar,\
spring-tx-*.jar,\
spring-jdbc-*.jar,\
spring-data-commons-*.jar,\
mybatis-*.jar,\
caffeine-*.jar,\
guava-*.jar,\
joda-time-*.jar,\
curvesapi-*.jar,\
accessors-smart-*.jar,\
spire.presentation.free-*.jar,\
jackson-core-*.jar,\
swagger-models-*.jar,\
jsoup-*.jar,\
servlet-*.jar,\
byte-buddy-*.jar,\
xercesImpl-*.jar,\
xmlbeans-*.jar,\
xfire-core-*.jar,\
jmespath-java-*.jar,\
logkit-*.jar,\
springfox-spring-web-*.jar,\
spring-jcl-*.jar,\
java-image-scaling-*.jar,\
ion-java-*.jar,\
jsch-*.jar,\
classmate-*.jar,\
imageio-tiff-*.jar,\
connector-api-*.jar,\
imageio-core-*.jar,\
avalon-framework-*.jar,\
jackson-dataformat-cbor-*.jar,\
logback-classic-*.jar,\
jackson-annotations-*.jar,\
springfox-swagger-ui-*.jar,\
error_prone_annotations-*.jar,\
HikariCP-*.jar,\
springfox-spi-*.jar,\
springfox-schema-*.jar,\
javax.inject-*.jar,\
mapstruct-*.jar,\
mariadb-java-client-*.jar,\
httpcore-*.jar,\
springfox-swagger-common-*.jar,\
springfox-core-*.jar,\
XmlSchema-*.jar,\
spring-plugin-metadata-*.jar,\
wstx-asl-*.jar,\
stax-api-*.jar,\
spring-aop-*.jar,\
common-lang-*.jar,\
lucy-xss-*.jar,\
lucy-xss-servlet-*.jar,\
jackson-databind-*.jar,\
spring-plugin-core-*.jar,\
imageio-metadata-*.jar,\
logback-core-*.jar,\
swagger-annotations-*.jar,\
SparseBitSet-*.jar,\
springfox-swagger2-*.jar,\
javax.activation-api-*.jar,\
logback-ext-spring-*.jar,\
checker-qual-*.jar,\
imageio-jpeg-*.jar
```
