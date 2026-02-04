---
author: jeongcool
categories: devops
date: '2025-09-30'
layout: post
tags:
- gitlab
- docker
- docker-compose
title: "GitLab Docker Compose install"
---

docker compose로 GItLab을 설치하는 가이드를 작성한다.

# 설치할 디랙토리 생성

최소 2.5GB이상 여유 공간이 존재해야 한다.

```bash
sudo mkdir -p /app/gitlab
cd /app/gitlab
```

GitLab 데이터를 영속적으로 저장하기 위한(컨테이너가 제거되어도 저장되기 위한) Bind Mount용 디렉토리 생성

```bash
sudo mkdir data
sudo mkdir logs
sudo mkdir config
```

| **Directory** | **Container location** | **Usage** |
| --- | --- | --- |
| data | /var/opt/gitlab | 애플리케이션 데이터 저장용 |
| logs | /var/log/gitlab | 로그 저장용 |
| config | /etc/gitlab | GitLab 구성 파일 저장용 |

gitlab 디렉토리 소유권을 현재유저 (`$USER`)로 변경합니다

```bash
sudo chown -R $USER:$USER /data/gitlab
```

권한을 변경합니다.

```bash
sudo chmod -R 755 /data/gitlab
```

# docker-compose.yml 파일 준비

위에서 GitLab 작업 디렉토리에 docker-compose.yml 파일을 생성한다.

```bash
vim docker-compose.yml
```

```yaml
version: '3.9'

services:
  gitlab:
    image: 'gitlab/gitlab-ee:18.4.2-ee.0' # GitLab버전(2025.09.30 기준 최신버전)
    container_name: gitlab
    restart: always
    hostname: 'gitlab.example.com' # 호스트의 도메인 혹은 IP 주소
    environment:
	    # external url 부분을 servcie.gitlab.hostname과 같이 맞춰준다.
      GITLAB_OMNIBUS_CONFIG: | 
        external_url 'https://gitlab.example.com'
        gitlab_rails['gitlab_shell_ssh_port'] = 8022
        # Add any other gitlab.rb configuration here, each on its own line
      TZ: 'Asia/Seoul'
    ports:
      - '80:80' # http 포트 
      - '443:443' # https 포트
      - '8022:22' # gitlab ssh 포트
    volumes:
      - './config:/etc/gitlab'
      - './logs:/var/log/gitlab'
      - './data:/var/opt/gitlab'
```

## GitLab Enterprise Edition을 설치한 이유

- Community Edition과 동일한 기능을 가짐
- 이후 언제든지 유로 기능을 체험하고 싶으면 새 인스턴스를 설치할 필요가 없이 단순히 활성화하면됨
- 버튼 한번으로 Enterprise Edition을 사용할 수 있음

# GitLab 시작

작업 디렉터리에서 아래 명령을 실행하여 GitLab을 시작한다.

```yaml
docker compose up -d
```

# 초기 비밀번호 확인

아래 명령을 실행하여 GItLab root 계정의 초기 패스워드를 확인한다.

```yaml
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

# GitLab 설치 확인

80포트로 GitLab web에 접속하여 확인한다.
