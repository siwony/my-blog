---
layout: post
title: "CIFS 환경에서 발생한 Bad file descriptor 원인 파악 (WIP)"
date: 2026-01-22 19:22:34 +0900
categories: linux
tags: [사내발표, java, linux]
author: jeongcool
---

# 개요

이번글은 CIFS 마운트된 네트워크 디스크에서 파일을 다룰 떄 Bad File Descriptor가 발생하며 왜 발생하는지에 대한 원인을 분석하고 해결하기 위한 글이다.

# 요약
- 환경: Rocky 9.5, CIFS, Java 17, Spring Boot
- 증상: 간헐적으로 파일 이동 후 복사시 Bad file descriptor (tail, Java 모두)
- 원인: CIFS가 noserverino로 마운트되어 inode 불일치 및 핸들 꼬임 발생
- 해결: serverino 옵션으로 재마운트 및 `/etc/fstab` 수정 예정

# 문제 발단

## 발생한 환경
- Rocky OS 9.5
- Java 17
- Spring Boot
  g
사내에서 CIFS 타입의 네트워크 디스크가 마운트 되어있고 마운트된 드라이브 속 파일을 다루게 되었디.  

SFTP로 네트워크 드라이브에 바로 파일을 업로드 하면 서버에서 이를 감지하여 파일을 확장자별로 복사 및 이동을 수행하게 되는데 이동 후 파일을 복사하는 Java로직에서 `IOException` 중 Bad File Descriptor 가 발생하여 해당 글을 적게되었다.

# 파일 복사로직 설명
```java
/**
 * 파일을 Zero-Copy 방식으로 복사합니다.
 * * Zero-Copy는 파일을 메모리 버퍼를 사용하지 않고 직접 디스크 간에 전송하여 성능을 향상시킵니다.
 * * 이 메서드는 파일이 존재하는지 확인하고, 대상 디렉토리가 없으면 생성합니다.
 * <p>
 * Zero-Copy가 동작하는지 확인하는 방법은 대상 디스크에 파일 복사시 시스템 콜의 sendfile() 사용 여부를 확인하는 것입니다.
 *
 * @param source 원본 파일 경로 (파일이름 포함)
 * @param target 대상 파일 경로 (파일이름 포함)
 */
public static void copyFileUsingZeroCopy(
        Path source,
        Path target
) throws IOException {
    if (!Files.isRegularFile(source)) {
        throw new IllegalArgumentException("Source must be a regular file: " + source);
    }

    if (!Files.exists(source)) {
        throw new CustomFileNotExistsException(source);
    }

    // 대상 디렉토리 생성
    Path parent = target.getParent();
    if (parent != null && !Files.exists(parent)) {
        Files.createDirectories(parent);
    }

    // 복사
    try (
            FileChannel sourceChannel = FileChannel.open(source, StandardOpenOption.READ);
            FileChannel targetChannel = FileChannel.open(target,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE)
    ) {
        long position = 0;
        long size = sourceChannel.size();

        while (position < size) { // 일부 플랫폼에서는 transferTo가 한 번에 전체 파일을 전송하지 않을 수 있으므로 전송될 떄 까지 for문을 사용
            long transferred = sourceChannel.transferTo(position, size - position, targetChannel);
            if (transferred <= 0) {
                logger.warn("File transfer stopped unexpectedly. No bytes transferred. Source: {}, Target: {}", source, target);
                break;
            } // EOF or error
            position += transferred;
        }
    }
}
```
로직을 간략하게 설명하자면
1. 파일에 대한 유효성 검사를 수행한다.
2. Java NIO API인 `FileChannel#transferTo`를 활용하여 파일을 파일을 복사한다.
   - 내부적으로 `sendfile()` 시스템 콜을 호출하여 유저 메모리를 거치지 않고 커널에서 바로 파일을 전송하여 CPU load 및 파일 이동 속도에 이점이 있다.

### `Files.copy()` 사용하지 않는 이유

내가 구현해야 하는 서비스는 수십수백 GB의 파일을 다루기 때문에 `Files.copy()`는 파일 복사시 메타데이터 등을 모두 copy하려고 하므로 이를 최소화 한 파일 복사 로직을 구현했다.

# 문제 원인 파악

## 문제 원인 파악 과정

다음과 같이 문제 원인을 파악했다.  
파일명은 `00_숙모의_미소는_달콤했다.psd` 와 같은 한국어와 영어가 섞인 문자열이다.

코드에 대한 의심은 하지 않았다. 이미 try-catch-with-resources로 올바르게 자원 반환하는 부분을 확인했고, 별도로 비 정상적으로 애플리케이션이 종료되는 경우가 없었기 때문이다.

1. 문제가 발생한 파일에 대해 `tail` 명령어를 통해 파일 내용을 읽을 수 있는지 파악했다. -> Bad File Descriptor 발생
   1. `tail 00_숙모의_미소는_달콤했다.psd`
2. 인코딩 문제일 수 있으므로 파일명을 영어로 변경 후 tail 을 입력했다. -> 드디어 파일을 읽을 수 있었다!
   - `mv 00_숙모의_미소는_달콤했다.psd test.psd`
     - 파일에 대한 데이터가 정상적으로 출력됨
3. 파일을 다시 원래 파일명으로 변경 후 다시 파일을 읽을 수 있는지 확인했다. -> Bad File Descriptor 발생
   - `mv test.psd 00_숙모의_미소는_달콤했다.psd`
4. 인코딩 문제라고 생각을 했으나 다른 한글 파일들을 확인하면 잘 된다.
5. 다른 서버에서 Bad File Descriptor가 발생한 파일에 대해 tail를 통해 읽어지는지 확인했다. -> 정상적으로 읽어진다!

위 과정으로 일단 파일은 CIFS 디스크에 실재로 존재하고 읽을 수 있는 파일이라는 것을 확인했다.

-> 즉, 문제 원인을 추론해보자면 다른 서버에서 읽어지지만 **WAS를 구동중인 서버만** 특정 파일명을 핸들링 하지 못하는 현상이 발생했고, 따라서 "CIFS 마운트에 문제가 있을지도 모른다. 라고 생각이 들었다."

CIFS는 리눅스 환경에서 썩 호환이 잘 되는 프로토콜은 아니라고 알고있었기 때문에 휴리스틱하게 이 부분에 대해 찾아보고 있었는데,  
여기서 문뜩 리눅스는 inode 번호로 파일을 구분하니 이와 관련이 있지 않을까 싶어서 chatgpt 및 구글링을 열심히 진행해보았다.  

## 문제 원인 - inode값이 다르다.

리눅스는 기본적으로 inode 번호를 통해 파일을 다룬다. 따라서 정상/비정상 서버에서 각각 문제가 되는 파일에 대한 inode 번호를 확인했다.

```bash
# 정상서버
$ stat 00_숙모의_미소는_달콤했다.psd
File: 00_숙모의_미소는_달콤했다.psdsd Size: 139532291 Blocks: 272528 IO Block: 1048576 regular file Device: 2fh/47d Inode: 4885209962701260479 Links: 1 Access: (0775/-rwxrwxr-x) Uid: ( 마스킹/ 마스킹) Gid: ( 마스킹/ 마스킹) Access: 2026-01-20 11:31:00.980614000 +0900 Modify: 2026-01-19 14:17:39.800865300 +0900 Change: 2026-01-20 11:31:48.475686000 +0900 Birth: 2026-01-19 14:17:39.797968000 +0900

# 비정상서버
$ stat 00_숙모의_미소는_달콤했다.psd
File: 00_숙모의_미소는_달콤했다.psd Size: 139532291 Blocks: 272528 IO Block: 1048576 regular file Device: 3bh/59d Inode: 6137030 Links: 1 Access: (0775/-rwxrwxr-x) Uid: ( 마스킹/ 마스킹) Gid: ( 마스킹/ 마스킹) Access: 2026-01-20 11:31:00.980614000 +0900 Modify: 2026-01-19 14:17:39.800865300 +0900 Change: 2026-01-20 11:31:48.475686000 +0900 Birth: 2026-01-19 14:17:39.797968000 +09009.797968000 +0900

```

두 서버간 출력되는 inode가 다른걸 확인할 수 있다.
- 정상 : 4885209962701260479
- 비정상 : 6137030

왜 inode가 다른지에 대해 확인은 해보니 마운트 옵션차이에 따라 달라질 수 있다고 한다.

CIFS 마운트시 마운트 옵션에 `serverino` 옵션을 누락하여 네트워크 드라이브가 자동으로 `noserverino`로 마운트 되어 있었다.

아래와 같이 mount 명령어로 어떻게 마운트되어 있는지 확인했다.
```bash 
$ mount | grep 검색문자
//192.168.10.196/MOUNT_PATH_MASKED on MOUNT_PATH_MASKED type cifs (rw,relatime,vers=3.1.1,cache=strict,username=마스킹,uid=1001,noforceuid,gid=3001,noforcegid,addr=1.227.83.101,file_mode=0775,dir_mode=0775,soft,nounix,mapposix,rsize=1048576,wsize=1048576,bsize=1048576,echo_interval=60,actimeo=1,closetimeo=1)
```

위 콘솔에 출력된 문자열을 확인하면 마운트 옵션에 serverino이 명시적으로 설정되지 않고 있었다.

그러면 왜 Bad File Descriptor가 발생했을까?

## 문제 원인 - 추정



# 현재 성과

## 2026-01-25

아쉽게도 실제 상용 환경에 적용하지 않고 있다. 따라서 개발서버 및 테스트배드 환경에서 테스트 후 2026-03 배포 떄 실제 상용에서 성과를 확인할 수 있을 것 같다.


# Reference
- https://linux.die.net/man/8/mount.cifs - Linux man page(mount.cifs(8))
