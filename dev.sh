#!/bin/bash

# Jekyll 블로그 통합 개발 도구
# 사용법: ./dev.sh [명령어] [옵션]

set -e

# Initialize rbenv if available
if command -v rbenv &> /dev/null; then
    eval "$(rbenv init -)"
fi

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 기본 설정
PORT="${PORT:-4000}"

# 함수: 도움말 출력
show_help() {
    echo -e "${BLUE}🛠️ Jekyll 블로그 통합 개발 도구${NC}"
    echo ""
    echo "사용법: ./dev.sh <명령어> [옵션]"
    echo ""
    echo -e "${CYAN}개발 명령어:${NC}"
    echo "  serve [옵션]       개발 서버 시작"
    echo "    --port <포트>    포트 지정 (기본: 4000)"
    echo "    --drafts         초안 포함"
    echo "    --livereload     라이브 리로드 활성화"
    echo ""
    echo "  build [옵션]       사이트 빌드"
    echo "    --production     프로덕션 모드"
    echo "    --clean          빌드 전 캐시 정리"
    echo ""
    echo "  test-prod          프로덕션 빌드 후 로컬 테스트 (포트 8080)"
    echo ""
    echo -e "${CYAN}콘텐츠 명령어:${NC}"
    echo "  new-post           새 포스트 생성"
    echo "  stats              블로그 통계"
    echo ""
    echo -e "${CYAN}유지보수 명령어:${NC}"
    echo "  sync-categories    카테고리 페이지 자동 동기화"
    echo "  clean              캐시 및 빌드 파일 정리"
    echo "  deps               의존성 업데이트"
    echo "  install            의존성 설치"
    echo ""
    echo -e "${CYAN}자동완성:${NC}"
    echo "  completions [셸]   자동완성 스크립트 출력 (zsh/bash)"
    echo "  setup-completions  셸 설정 파일에 자동완성 자동 등록"
    echo ""
    echo -e "${CYAN}예시:${NC}"
    echo "  ./dev.sh serve --port 3000 --drafts"
    echo "  ./dev.sh build --production --clean"
    echo "  ./dev.sh new-post"
    echo "  source <(./dev.sh completions)    # 자동완성 즉시 활성화"
    echo ""
}

# 함수: 의존성 확인 및 설치
check_deps() {
    if ! command -v bundle &> /dev/null; then
        echo -e "${RED}❌ Bundler가 설치되지 않았습니다.${NC}"
        echo -e "${YELLOW}💡 gem install bundler 로 설치하세요.${NC}"
        exit 1
    fi
    
    if [ ! -f "Gemfile" ]; then
        echo -e "${RED}❌ Gemfile을 찾을 수 없습니다.${NC}"
        exit 1
    fi
    
    if ! bundle check &> /dev/null; then
        echo -e "${YELLOW}📦 의존성 설치 중...${NC}"
        bundle install
    fi
}

# 함수: 개발 서버 실행
cmd_serve() {
    local port="$PORT"
    local drafts=""
    local livereload=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --port) port="$2"; shift 2 ;;
            --drafts) drafts="--drafts"; shift ;;
            --livereload) livereload="--livereload"; shift ;;
            *) shift ;;
        esac
    done
    
    check_deps
    
    echo -e "${BLUE}🚀 개발 서버 시작${NC}"
    echo "=================================="
    echo -e "${GREEN}📍 URL: http://localhost:$port${NC}"
    echo -e "${YELLOW}🛑 종료: Ctrl+C${NC}"
    echo ""
    
    export JEKYLL_ENV=development
    bundle exec jekyll serve --host 0.0.0.0 --port "$port" $drafts $livereload
}

# 함수: 사이트 빌드
cmd_build() {
    local production=""
    local clean=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production) production="1"; shift ;;
            --clean) clean="1"; shift ;;
            *) shift ;;
        esac
    done
    
    check_deps
    
    echo -e "${BLUE}🔨 사이트 빌드${NC}"
    echo "=================================="
    
    if [ "$clean" = "1" ]; then
        echo -e "${YELLOW}🧹 캐시 정리 중...${NC}"
        bundle exec jekyll clean
        rm -rf .sass-cache/
    fi
    
    if [ "$production" = "1" ]; then
        export JEKYLL_ENV=production
        echo -e "${GREEN}🏭 프로덕션 모드${NC}"
        
        if command -v npm &> /dev/null && [ -f "package.json" ]; then
            echo -e "${YELLOW}📦 JS/CSS 최적화 중...${NC}"
            START_TIME=$(date +%s)
            npm run build:prod 2>/dev/null || true
            END_TIME=$(date +%s)
            echo ""
            echo -e "${GREEN}✅ 빌드 완료! ($(($END_TIME - $START_TIME))초)${NC}"
            echo -e "📦 출력: _site/ ($(du -sh _site 2>/dev/null | cut -f1))"
            return
        fi
    else
        export JEKYLL_ENV=development
        echo -e "${GREEN}🔧 개발 모드${NC}"
    fi
    
    START_TIME=$(date +%s)
    bundle exec jekyll build
    END_TIME=$(date +%s)
    
    echo ""
    echo -e "${GREEN}✅ 빌드 완료! ($(($END_TIME - $START_TIME))초)${NC}"
    echo -e "�� 출력: _site/ ($(du -sh _site 2>/dev/null | cut -f1))"
}

# 함수: 프로덕션 테스트
cmd_test_prod() {
    echo -e "${BLUE}🧪 프로덕션 테스트${NC}"
    echo "=================================="
    
    check_deps
    
    echo -e "${YELLOW}🔨 프로덕션 빌드 중...${NC}"
    export JEKYLL_ENV=production
    
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        npm run build:prod 2>/dev/null || bundle exec jekyll build
    else
        bundle exec jekyll build
    fi
    
    if [ ! -d "_site" ]; then
        echo -e "${RED}❌ 빌드 실패${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}📊 빌드 통계:${NC}"
    echo "   파일 수: $(find _site -type f | wc -l | tr -d ' ')"
    echo "   크기: $(du -sh _site | cut -f1)"
    echo ""
    echo -e "${GREEN}🌐 서버 시작: http://localhost:8080${NC}"
    echo -e "${YELLOW}🛑 종료: Ctrl+C${NC}"
    
    cd _site && python3 -m http.server 8080
}

# 함수: 새 포스트 생성
cmd_new_post() {
    echo -e "${CYAN}📝 새 포스트 생성${NC}"
    echo "=================================="
    
    read -p "포스트 제목: " title
    if [ -z "$title" ]; then
        echo -e "${RED}❌ 제목을 입력해주세요.${NC}"
        return 1
    fi
    
    read -p "카테고리 (기본: general): " category
    category=${category:-general}
    
    date_str=$(date +%Y-%m-%d)
    filename_title=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9가-힣]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    filename="${date_str}-${filename_title}.md"
    filepath="_posts/$filename"
    
    if [ -f "$filepath" ]; then
        echo -e "${RED}❌ 파일이 이미 존재합니다: $filepath${NC}"
        return 1
    fi
    
    cat > "$filepath" << EOF
---
layout: post
title: "$title"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
categories: $category
tags: []
author: jeongcool
---

# $title

여기에 내용을 작성하세요.
EOF

    echo -e "${GREEN}✅ 생성됨: $filepath${NC}"
}

# 함수: 블로그 통계
cmd_stats() {
    echo -e "${PURPLE}📊 블로그 통계${NC}"
    echo "=================================="
    
    if [ -d "_posts" ]; then
        total=$(find _posts -name "*.md" | wc -l | tr -d ' ')
        echo -e "${GREEN}📝 총 포스트: $total${NC}"
        echo ""
        
        echo -e "${YELLOW}📂 카테고리별:${NC}"
        grep -rh "^categories:" _posts/ 2>/dev/null | sed 's/categories: //' | sort | uniq -c | sort -nr | head -10
        echo ""
        
        echo -e "${YELLOW}📅 최근 포스트:${NC}"
        ls -1 _posts/*.md 2>/dev/null | sort -r | head -5 | while read file; do
            title=$(grep "^title:" "$file" 2>/dev/null | head -1 | sed -E 's/^title: *"?//' | sed -E 's/"? *$//')
            date=$(basename "$file" | cut -d'-' -f1-3)
            echo "  $date - $title"
        done
    fi
    
    if [ -d "_site" ]; then
        echo ""
        echo -e "${GREEN}🌐 빌드 사이트: $(du -sh _site 2>/dev/null | cut -f1)${NC}"
    fi
}

# 함수: 정리
cmd_clean() {
    echo -e "${YELLOW}🧹 정리 중...${NC}"
    
    bundle exec jekyll clean 2>/dev/null || true
    rm -rf .sass-cache/ .jekyll-cache/ .jekyll-metadata _site/ 2>/dev/null
    
    echo -e "${GREEN}✅ 정리 완료${NC}"
}

# 함수: 의존성 업데이트
cmd_deps() {
    echo -e "${CYAN}📦 의존성 업데이트${NC}"
    
    if command -v bundle &> /dev/null; then
        bundle update
        echo -e "${GREEN}✅ Bundle 업데이트 완료${NC}"
    fi
    
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        npm update
        echo -e "${GREEN}✅ npm 업데이트 완료${NC}"
    fi
}

# 함수: 의존성 설치
cmd_install() {
    echo -e "${CYAN}📦 의존성 설치${NC}"
    
    if command -v bundle &> /dev/null; then
        bundle install
        echo -e "${GREEN}✅ Bundle 설치 완료${NC}"
    fi
    
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        npm install
        echo -e "${GREEN}✅ npm 설치 완료${NC}"
    fi
}

# 함수: 자동완성 스크립트 생성
cmd_completions() {
    local shell_type="${1:-auto}"

    # 셸 자동 감지
    if [ "$shell_type" = "auto" ]; then
        if [ -n "$ZSH_VERSION" ] || [[ "$SHELL" == */zsh ]]; then
            shell_type="zsh"
        else
            shell_type="bash"
        fi
    fi

    case "$shell_type" in
        zsh)
            cat << 'ZSHCOMP'
# dev.sh zsh 자동완성
# 아래 중 하나를 ~/.zshrc에 추가하세요:
#   eval "$(./dev.sh completions zsh)"
#   source <(./dev.sh completions zsh)

_dev_sh() {
    local -a commands serve_opts build_opts
    commands=(
        'serve:개발 서버 시작'
        'build:사이트 빌드'
        'test-prod:프로덕션 빌드 후 로컬 테스트'
        'new-post:새 포스트 생성'
        'stats:블로그 통계'
        'sync-categories:카테고리 페이지 자동 동기화'
        'clean:캐시 및 빌드 파일 정리'
        'deps:의존성 업데이트'
        'install:의존성 설치'
        'completions:자동완성 스크립트 출력'
        'help:도움말 출력'
    )

    serve_opts=(
        '--port:포트 지정 (기본: 4000)'
        '--drafts:초안 포함'
        '--livereload:라이브 리로드 활성화'
    )

    build_opts=(
        '--production:프로덕션 모드'
        '--clean:빌드 전 캐시 정리'
    )

    completions_opts=(
        'zsh:zsh 자동완성 스크립트'
        'bash:bash 자동완성 스크립트'
    )

    if (( CURRENT == 2 )); then
        _describe 'command' commands
    elif (( CURRENT >= 3 )); then
        case "${words[2]}" in
            serve)
                _describe 'option' serve_opts
                ;;
            build)
                _describe 'option' build_opts
                ;;
            completions)
                _describe 'shell' completions_opts
                ;;
        esac
    fi
}

compdef _dev_sh dev.sh
compdef _dev_sh ./dev.sh
ZSHCOMP
            ;;
        bash)
            cat << 'BASHCOMP'
# dev.sh bash 자동완성
# 아래를 ~/.bashrc 또는 ~/.bash_profile에 추가하세요:
#   eval "$(./dev.sh completions bash)"
#   source <(./dev.sh completions bash)

_dev_sh_completions() {
    local cur prev commands
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    commands="serve build test-prod new-post stats sync-categories clean deps install completions help"

    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=( $(compgen -W "$commands" -- "$cur") )
        return 0
    fi

    case "${COMP_WORDS[1]}" in
        serve)
            COMPREPLY=( $(compgen -W "--port --drafts --livereload" -- "$cur") )
            ;;
        build)
            COMPREPLY=( $(compgen -W "--production --clean" -- "$cur") )
            ;;
        completions)
            COMPREPLY=( $(compgen -W "zsh bash" -- "$cur") )
            ;;
    esac
    return 0
}

complete -F _dev_sh_completions dev.sh
complete -F _dev_sh_completions ./dev.sh
BASHCOMP
            ;;
        *)
            echo -e "${RED}❌ 지원하지 않는 셸: $shell_type${NC}"
            echo -e "${YELLOW}💡 사용법: ./dev.sh completions [zsh|bash]${NC}"
            return 1
            ;;
    esac
}

# 함수: 자동완성 설정 안내 및 자동 등록
cmd_setup_completions() {
    local shell_type
    local rc_file_display
    local rc_file_path
    if [ -n "$ZSH_VERSION" ] || [[ "$SHELL" == */zsh ]]; then
        shell_type="zsh"
        rc_file_display="~/.zshrc"
        rc_file_path="$HOME/.zshrc"
    else
        shell_type="bash"
        rc_file_display="~/.bashrc"
        rc_file_path="$HOME/.bashrc"
    fi

    # 프로젝트 루트 경로 자동 감지
    local project_root
    project_root="$(cd "$(dirname "$0")" && pwd)"
    local rel_path="${project_root/#$HOME/\$HOME}"

    # rc 파일에 추가할 줄
    local completion_marker="# dev.sh 자동완성 (${project_root})"
    local completion_line="[[ -f \"${rel_path}/dev.sh\" ]] && eval \"\$(\"${rel_path}/dev.sh\" completions ${shell_type})\""

    echo -e "${CYAN}⌨️  자동완성 설정${NC}"
    echo "=================================="
    echo ""
    echo -e "${GREEN}감지된 셸: $shell_type${NC}"
    echo -e "${GREEN}프로젝트 경로: $project_root${NC}"
    echo ""

    # 이미 등록되어 있는지 확인
    if [ -f "$rc_file_path" ] && grep -qF "dev.sh completions" "$rc_file_path" && grep -qF "$project_root" "$rc_file_path"; then
        echo -e "${GREEN}✅ 이미 ${rc_file_display}에 등록되어 있습니다.${NC}"
        echo ""
        echo -e "${YELLOW}💡 제거하려면 ${rc_file_display}에서 아래 줄을 삭제하세요:${NC}"
        echo -e "  ${CYAN}${completion_marker}${NC}"
        echo -e "  ${CYAN}${completion_line}${NC}"
        return 0
    fi

    # 사용자에게 자동 등록 여부 확인
    echo -e "${YELLOW}${rc_file_display}에 자동완성을 등록하시겠습니까?${NC}"
    read -p "(y/n): " answer
    echo ""

    if [[ "$answer" =~ ^[Yy]$ ]]; then
        # rc 파일에 자동 추가
        {
            echo ""
            echo "$completion_marker"
            echo "$completion_line"
        } >> "$rc_file_path"

        echo -e "${GREEN}✅ ${rc_file_display}에 자동완성이 등록되었습니다!${NC}"
        echo ""
        echo -e "${YELLOW}적용하려면:${NC}"
        echo -e "  ${CYAN}source ${rc_file_display}${NC}"
        echo ""
        echo -e "${GREEN}💡 또는 새 터미널을 열면 자동으로 적용됩니다.${NC}"
    else
        echo -e "${YELLOW}수동으로 설정하려면 아래 줄을 ${rc_file_display}에 추가하세요:${NC}"
        echo ""
        echo -e "  ${CYAN}${completion_marker}${NC}"
        echo -e "  ${CYAN}${completion_line}${NC}"
        echo ""
        echo -e "${YELLOW}또는 현재 터미널에서 바로 적용:${NC}"
        echo ""
        echo -e "  ${CYAN}source <(./dev.sh completions $shell_type)${NC}"
    fi
}

# 메인 실행
case "${1:-help}" in
    serve)      shift; cmd_serve "$@" ;;
    build)      shift; cmd_build "$@" ;;
    test-prod)  cmd_test_prod ;;
    new-post)   cmd_new_post ;;
    stats)      cmd_stats ;;
    sync-categories) shift; bash "$PWD/scripts/sync_categories.sh" "$@" ;;
    clean)      cmd_clean ;;
    deps)       cmd_deps ;;
    install)    cmd_install ;;
    completions) shift; cmd_completions "$@" ;;
    setup-completions) cmd_setup_completions ;;
    help|--help|-h) show_help ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령어: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
