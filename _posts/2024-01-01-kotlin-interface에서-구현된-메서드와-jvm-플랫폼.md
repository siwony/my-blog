---
author: jeongcool
categories: kotlin
date: '2024-01-01'
layout: post
tags:
- kotlin
- jvm
- interface
title: "Kotlin interface에서 구현된 메서드와 JVM 플랫폼"
---
# 발표 동기

![회사에 던진 의문점](/assets/images/posts/2024-kotlin-interface-jvm/회사에던진의문.png)

![이 글을 적게 된 계기](/assets/images/posts/2024-kotlin-interface-jvm/박사학위받음.png)

~~박사 학위가 생겨서 좋네요~~

# Kotlin interface in JVM

Kotlin의 interface는 아래와 같이 메서드를 구현을 할 수 있습니다.

```kotlin
interface 인터페이스 {
    fun 기본매서드() {
        println("기본메서드 실행!!")
    }
}
```

Java에서는 Java 1.8 이후부터 `default` 키워드를 제공하여 interface에 default method를 사용할 수 있습니다.

```java
public interface 인터페이스 {
    default void 기본매서드() {
        System.out.println("기본메서드 실행!!")
    }
}
```

그러면 위 Kotlin 코드를 Bytecode로 반환하면 어떻게 표현될까요?

```
// ================siwony/kotlin14/인터페이스.class =================
// class version 61.0 (61)
// access flags 0x601
public abstract interface siwony/kotlin14/인터페이스 {

// compiled from: 인터페이스.kt

@Lkotlin/Metadata;(mv={1, 9, 0}, k=1, xi=48, d1={"\u0000\u0010\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0002\n\u0000\u0008f\u0018\u0019
// access flags 0x19
public final static INNERCLASS siwony/kotlin14/인터페이스$DefaultImpls siwony/kotlin14/인터페이스 DefaultImpls

// access flags 0x401
public abstract 기본매서드()V
}


// ================siwony/kotlin14/인터페이스$DefaultImpls.class ===============
// class version 61.0 (61)
// access flags 0x31
public final class siwony/kotlin14/인터페이스$DefaultImpls {

// compiled from: 인터페이스.kt

@Lkotlin/Metadata;(mv={1, 9, 0}, k=3, xi=48)
// access flags 0x19
public final static INNERCLASS siwony/kotlin14/인터페이스$DefaultImpls siwony/kotlin14/인터페이스 DefaultImpls

// access flags 0x9
public static 기본매서드(Lsiwony/kotlin14/인터페이스;)V
// annotable parameter count: 1 (invisible)
@Lorg/jetbrains/annotations/NotNull;() // invisible, parameter 0
L0
LINENUMBER 5 L0
LDC "\uae30\ubcf8\uba54\uc11c\ub4dc \uc2e4\ud589!!"
GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
SWAP
INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V
L1
LINENUMBER 6 L1
RETURN
L2
LOCALVARIABLE $this Lsiwony/kotlin14/인터페이스; L0 L2 0
MAXSTACK = 2
MAXLOCALS = 1
}
```

이를 Java 코드로 Decompile 해보면 `인터페이스`에 static inner class가 선언되어 있습니다. 안에는 kotlin코드에서 작성한 기본 메서드가 선언되어 있네요.

```java
@Metadata(
    mv = {1, 9, 0},
    k = 1,
    xi = 48,
    d1 = {"\u0000\u0010\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0002\n\u0000\bf\u0018\u00002\u00020\u0001J\b\u0010\u0002\u001a\u0"},
    d2 = {"Lsiwony/kotlin14/인터페이스;", "", "기본매서드", "", "kotlin14"}
)
public interface 인터페이스 {
    void 기본매서드();

    @Metadata(
        mv = {1, 9, 0},
        k = 3,
        xi = 48
    )
    public static final class DefaultImpls {
        public static void 기본매서드(@NotNull 인터페이스 $this) {
            String var1 = "기본메서드 실행!!";
            System.out.println(var1);
        }
    }
}
```

# Kotlin 1.2

kotlin1.2 부터 Java 8를 대상으로 `@JvmDefault`를 이용해 default method를 지원하기 시작했습니다. 다만 `-Xjvm-default` 컴파일 옵션에서만 작동합니다.

```kotlin
interface Alien {
    @JvmDefault
    fun speak() = "Wubba lubba dub dub"
}

class BirdPerson : Alien
```

하지만 kotlin1.4 `@JvmDefault`는 Deprecated 되었습니다.

# Kotlin 1.4 ~ 현재

인터페이스에서 기본 메서드를 생성하기 위한 새로운 모드 2개

## -Xjvm-default=all

- default method만 존재하고, DefaultImpls 객체가 더 이상 없음

## -Xjvm-default=all-compatibility

- binary compatibility(이진 호환성)을 보장하는 모드
- default method와 DefaultImpls 둘 다 생기지만 DefaultImpls method는 정의된 default method를 호출하도록 함

# 더 찾아보면 좋은 문서들

- [Kotlin 1.4-M3: Generating Default Methods in Interfaces | The Kotlin Blog](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) - 발표의 베이스가 되는 글
- [Get started with Kotlin/JVM | Kotlin](https://kotlinlang.org/docs/jvm-get-started.html) - JVM 생태계에서 개발하면 한번 쯤 훑어 보는게 좋은 문서

# Reference

- [Kotlin 1.4-M3: Generating Default Methods in Interfaces | The Kotlin Blog](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)
