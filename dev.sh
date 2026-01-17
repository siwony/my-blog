#!/bin/bash

# Jekyll 블로그 통합 개발 도구
# 사용법: ./dev.sh [명령어] [옵션]

set -e

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
    echo "  clean              캐시 및 빌드 파일 정리"
    echo "  deps               의존성 업데이트"
    echo "  install            의존성 설치"
    echo ""
    echo -e "${CYAN}예시:${NC}"
    echo "  ./dev.sh serve --port 3000 --drafts"
    echo "  ./dev.sh build --production --clean"
    echo "  ./dev.sh new-post"
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
            npm run build:prod 2>/dev/null || true
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
        ls -1t _posts/*.md 2>/dev/null | head -5 | while read file; do
            title=$(grep "^title:" "$file" 2>/dev/null | sed 's/title: *"\?\(.*\)"\?/\1/' | head -1)
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

# 메인 실행
case "${1:-help}" in
    serve)      shift; cmd_serve "$@" ;;
    build)      shift; cmd_build "$@" ;;
    test-prod)  cmd_test_prod ;;
    new-post)   cmd_new_post ;;
    stats)      cmd_stats ;;
    clean)      cmd_clean ;;
    deps)       cmd_deps ;;
    install)    cmd_install ;;
    help|--help|-h) show_help ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령어: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
