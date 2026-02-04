---
author: jeongcool
categories: devops
date: '2025-09-19'
layout: post
tags:
- clamav
- antivirus
- configuration
title: "ClamAV conf 메뉴얼 freshclam.conf(5)"
---

[https://manpages.debian.org/testing/clamav-freshclam/freshclam.conf.5.en.html](https://manpages.debian.org/testing/clamav-freshclam/freshclam.conf.5.en.html)

| 옵션 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- |
| Example | BOOL | 설정 시 freshclam 실행 안 함 | - |
| LogFileMaxSize | SIZE | 로그 파일 최대 크기. 0 = 제한 없음 | 1M |
| LogTime | BOOL | 로그에 시간 기록 | no |
| LogSyslog | BOOL | Syslog 로깅 | disabled |
| LogFacility | STRING | Syslog facility (예: LOG_LOCAL6) | LOG_LOCAL6 |
| LogVerbose | BOOL | 상세 로그 출력 | disabled |
| LogRotate | BOOL | 로그 로테이션 (LogFileMaxSize 필요) | no |
| PidFile | STRING | PID 파일 경로 | disabled |
| DatabaseDirectory | STRING | DB 저장 디렉토리 | /var/lib/clamav |
| Foreground | BOOL | 백그라운드 실행 안 함 | no |
| Debug | BOOL | 디버그 메시지 출력 | no |
| UpdateLogFile | STRING | 로그 파일 경로 지정 | disabled |
| DatabaseOwner | STRING | 루트 실행 시 권한을 내릴 사용자 | clamav |
| Checks | NUMBER | 하루 DB 체크 횟수 | 12 |
| DNSDatabaseInfo | STRING | DNS TXT 레코드로 DB 검증 도메인 | current.cvd.clamav.net |
| DatabaseMirror | STRING | DB 미러 주소 | database.clamav.net |
| PrivateMirror | STRING | 프라이빗 미러 지정 (여러 번 사용 가능) | disabled |
| MaxAttempts | NUMBER | 미러당 시도 횟수 | 3 |
| ScriptedUpdates | BOOL | 스크립트 업데이트 허용 | yes |
| TestDatabases | BOOL | 새 DB 로드 테스트 후 교체 | enabled |
| CompressLocalDatabase | BOOL | 로컬 DB 압축 | no |
| ExtraDatabase | STRING | 추가 서명 DB 다운로드 (여러 번 가능) | disabled |
| ExcludeDatabase | STRING | 표준 DB 제외 (여러 번 가능) | disabled |
| DatabaseCustomURL | STRING | DB 직접 URL 지정 (http, ftp, file 지원) | disabled |
| HTTPProxyServer / HTTPProxyPort | STRING/NUMBER | 프록시 서버 및 포트 | disabled |
| HTTPProxyUsername / HTTPProxyPassword | STRING | 프록시 인증 정보 | disabled |
| HTTPUserAgent | STRING | User-Agent 변경 (private mirror에서만 사용 가능) | clamav/version_number |
| NotifyClamd | STRING | clamd(8)에 DB 갱신 알림 (clamd.conf 경로 필요) | disabled |
| OnUpdateExecute | STRING | 업데이트 성공 시 실행할 명령 | disabled |
| OnErrorExecute | STRING | 업데이트 실패 시 실행할 명령 | disabled |
| OnOutdatedExecute | STRING | DB 구버전 시 실행할 명령 (%v = 새 버전) | disabled |
| LocalIPAddress | IP | 다운로드 시 사용할 로컬 IP | 시스템 기본 |
| ConnectTimeout | NUMBER | DB 서버 연결 타임아웃 (초) | 10 |
| ReceiveTimeout | NUMBER | 다운로드 타임아웃 (초). 0 = 제한 없음 | 0 |
| Bytecode | BOOL | bytecode.cvd 다운로드 | yes |
