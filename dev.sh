#!/bin/bash

# Jekyll 블로그 개발 도구 스크립트
# 사용법: ./dev.sh [명령어]

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 함수: 도움말 출력
show_help() {
    echo -e "${BLUE}🛠️ Jekyll 블로그 개발 도구${NC}"
    echo ""
    echo "사용법:"
    echo "  ./dev.sh serve          # 개발 서버 시작"
    echo "  ./dev.sh build          # 프로덕션 빌드"
    echo "  ./dev.sh new-post       # 새 포스트 생성"
    echo "  ./dev.sh new-category   # 새 카테고리 생성"
    echo "  ./dev.sh stats          # 블로그 통계 확인"
    echo "  ./dev.sh clean          # 캐시 및 빌드 파일 정리"
    echo "  ./dev.sh deps           # 의존성 업데이트"
    echo "  ./dev.sh help           # 도움말 출력"
    echo ""
}

# 함수: 새 포스트 생성
new_post() {
    echo -e "${CYAN}📝 새 포스트 생성${NC}"
    echo "=================================="
    
    read -p "포스트 제목을 입력하세요: " title
    if [ -z "$title" ]; then
        echo -e "${RED}❌ 제목을 입력해주세요.${NC}"
        return 1
    fi
    
    read -p "카테고리를 입력하세요 (기본값: general): " category
    category=${category:-general}
    
    # 파일명 생성 (날짜 + 제목)
    date_str=$(date +%Y-%m-%d)
    filename_title=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9가-힣]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    filename="${date_str}-${filename_title}.md"
    filepath="_posts/$filename"
    
    # 이미 존재하는지 확인
    if [ -f "$filepath" ]; then
        echo -e "${RED}❌ 파일이 이미 존재합니다: $filepath${NC}"
        return 1
    fi
    
    # 포스트 템플릿 생성
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

## 섹션 제목

내용...

## 참고 자료

- [링크 제목](URL)
EOF

    echo -e "${GREEN}✅ 새 포스트가 생성되었습니다!${NC}"
    echo -e "${GREEN}📁 파일: $filepath${NC}"
}

# 함수: 블로그 통계
show_stats() {
    echo -e "${PURPLE}📊 블로그 통계${NC}"
    echo "=================================="
    
    if [ -d "_posts" ]; then
        total_posts=$(find _posts -name "*.md" | wc -l | tr -d ' ')
        echo -e "${GREEN}📝 총 포스트 수: $total_posts${NC}"
        
        echo ""
        echo -e "${YELLOW}📂 카테고리별 포스트 수:${NC}"
        grep -rh "^categories:" _posts/ 2>/dev/null | sed 's/categories: //' | sort | uniq -c | sort -nr | head -10
        
        echo ""
        echo -e "${YELLOW}🏷️ 자주 사용되는 태그:${NC}"
        grep -rh "^tags:" _posts/ 2>/dev/null | sed 's/tags: \[\(.*\)\]/\1/' | tr ',' '\n' | sed 's/^[ \t]*//;s/[ \t]*$//' | grep -v '^$' | sort | uniq -c | sort -nr | head -10
        
        echo ""
        echo -e "${YELLOW}📅 최근 포스트 (5개):${NC}"
        ls -1t _posts/*.md 2>/dev/null | head -5 | while read file; do
            title=$(grep "^title:" "$file" 2>/dev/null | sed 's/title: *"\?\(.*\)"\?/\1/')
            date=$(basename "$file" | cut -d'-' -f1-3)
            echo "  $date - $title"
        done
    else
        echo -e "${RED}❌ _posts 디렉토리를 찾을 수 없습니다.${NC}"
    fi
    
    if [ -d "_site" ]; then
        echo ""
        site_size=$(du -sh _site 2>/dev/null | cut -f1)
        site_files=$(find _site -type f 2>/dev/null | wc -l | tr -d ' ')
        echo -e "${GREEN}🌐 빌드된 사이트 크기: $site_size${NC}"
        echo -e "${GREEN}📄 빌드된 파일 수: $site_files${NC}"
    fi
}

# 함수: 정리
clean_all() {
    echo -e "${YELLOW}🧹 캐시 및 빌드 파일 정리${NC}"
    echo "=================================="
    
    # Jekyll 캐시 정리
    if command -v bundle &> /dev/null; then
        bundle exec jekyll clean 2>/dev/null
    fi
    
    # 기타 캐시 파일 정리
    rm -rf .sass-cache/ 2>/dev/null
    rm -rf .jekyll-cache/ 2>/dev/null
    rm -rf .jekyll-metadata 2>/dev/null
    rm -rf _site/ 2>/dev/null
    
    echo -e "${GREEN}✅ 정리 완료${NC}"
}

# 함수: 의존성 업데이트
update_deps() {
    echo -e "${CYAN}📦 의존성 업데이트${NC}"
    echo "=================================="
    
    if ! command -v bundle &> /dev/null; then
        echo -e "${RED}❌ Bundler가 설치되지 않았습니다.${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}⬇️ Bundle 업데이트 중...${NC}"
    bundle update
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 의존성 업데이트 완료${NC}"
    else
        echo -e "${RED}❌ 의존성 업데이트 실패${NC}"
    fi
}

# 메인 실행 로직
case "${1:-help}" in
    serve)
        if [ -f "serve.sh" ]; then
            ./serve.sh "${@:2}"
        else
            echo -e "${RED}❌ serve.sh 파일을 찾을 수 없습니다.${NC}"
        fi
        ;;
    build)
        if [ -f "build.sh" ]; then
            ./build.sh --production
        else
            echo -e "${RED}❌ build.sh 파일을 찾을 수 없습니다.${NC}"
        fi
        ;;
    new-post)
        new_post
        ;;
    new-category)
        read -p "카테고리 이름을 입력하세요: " category_name
        if [ ! -z "$category_name" ] && [ -f "scripts/create_category.rb" ]; then
            ruby scripts/create_category.rb "$category_name"
        else
            echo -e "${RED}❌ 카테고리 이름을 입력하거나 create_category.rb 파일을 확인하세요.${NC}"
        fi
        ;;
    stats)
        show_stats
        ;;
    clean)
        clean_all
        ;;
    deps)
        update_deps
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령어: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac