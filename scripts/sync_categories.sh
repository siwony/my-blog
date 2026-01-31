#!/bin/bash

# 카테고리 자동 동기화 스크립트
# - 전체 포스트에서 사용 중인 카테고리 수집
# - 누락된 카테고리 페이지 생성
# - 사용되지 않는 카테고리 페이지 삭제 (경고 후)
# - 자동 커밋 옵션 지원

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 스크립트 위치 기준으로 프로젝트 루트 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
POSTS_DIR="$PROJECT_ROOT/_posts"
CATEGORY_DIR="$PROJECT_ROOT/category"

# 옵션 파싱
AUTO_COMMIT=false
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --auto-commit) AUTO_COMMIT=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        --verbose) VERBOSE=true; shift ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --auto-commit  자동으로 git commit 수행"
            echo "  --dry-run      실제 변경 없이 미리보기"
            echo "  --verbose      상세 출력"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_verbose() { [[ "$VERBOSE" == true ]] && echo -e "${NC}   $1${NC}" || true; }

# 전체 포스트에서 사용 중인 카테고리 수집
get_used_categories() {
    for post in "$POSTS_DIR"/*.md; do
        [[ -f "$post" ]] || continue
        
        # front matter에서 categories 값 추출 (단일 값)
        local cat=$(grep -m1 "^categories:" "$post" 2>/dev/null | sed 's/categories:[[:space:]]*//' | tr -d '\r' | xargs)
        
        if [[ -n "$cat" ]]; then
            echo "$cat"
        fi
    done | sort -u
}

# 기존 카테고리 페이지 목록 조회
get_existing_categories() {
    for file in "$CATEGORY_DIR"/*.html; do
        [[ -f "$file" ]] || continue
        basename "$file" .html
    done
}

# 카테고리 페이지 생성
create_category_page() {
    local category="$1"
    local clean_name=$(echo "$category" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    # 타이틀 생성: 하이픈을 공백으로 변경하고 각 단어 첫글자 대문자화
    local title=$(echo "$clean_name" | sed 's/-/ /g')
    title=$(echo "$title" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
    local file_path="$CATEGORY_DIR/${clean_name}.html"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY-RUN] Would create: ${clean_name}.html"
        return
    fi
    
    cat > "$file_path" << EOF
---
layout: category
category: ${clean_name}
title: ${title} Posts
permalink: /category/${clean_name}/
---
EOF
    
    log_success "Created category page: ${clean_name}.html"
}

# 카테고리 페이지 삭제
delete_category_page() {
    local category="$1"
    local file_path="$CATEGORY_DIR/${category}.html"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_warning "[DRY-RUN] Would delete: $file_path"
        return
    fi
    
    rm -f "$file_path"
    log_warning "Deleted unused category page: ${category}.html"
}

# Git 변경 사항 자동 커밋
auto_commit_changes() {
    cd "$PROJECT_ROOT"
    
    # category 디렉토리 변경 사항 확인
    if git diff --quiet "$CATEGORY_DIR" && git diff --cached --quiet "$CATEGORY_DIR"; then
        log_info "No category changes to commit"
        return 0
    fi
    
    git add "$CATEGORY_DIR/"
    
    # 추가/삭제된 파일 목록 생성
    local added=$(git diff --cached --name-only --diff-filter=A "$CATEGORY_DIR" | wc -l | xargs)
    local deleted=$(git diff --cached --name-only --diff-filter=D "$CATEGORY_DIR" | wc -l | xargs)
    
    local msg="[bot] Sync categories"
    [[ "$added" -gt 0 ]] && msg="$msg: +${added} added"
    [[ "$deleted" -gt 0 ]] && msg="$msg: -${deleted} removed"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY-RUN] Would commit with message: $msg"
        git reset HEAD "$CATEGORY_DIR/" > /dev/null 2>&1
        return 0
    fi
    
    git commit -m "$msg"
    log_success "Committed category changes: $msg"
    
    return 0
}

# 메인 실행
main() {
    log_info "Starting category sync..."
    
    # 디렉토리 확인
    if [[ ! -d "$POSTS_DIR" ]]; then
        log_error "Posts directory not found: $POSTS_DIR"
        exit 1
    fi
    
    mkdir -p "$CATEGORY_DIR"
    
    # 사용 중인 카테고리와 기존 카테고리 페이지 수집 (macOS 호환)
    local used_categories=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && used_categories+=("$line")
    done < <(get_used_categories)
    
    local existing_categories=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && existing_categories+=("$line")
    done < <(get_existing_categories)
    
    log_info "Found ${#used_categories[@]} categories in posts"
    log_info "Found ${#existing_categories[@]} existing category pages"
    
    local changes_made=false
    
    # 누락된 카테고리 페이지 생성
    for cat in "${used_categories[@]}"; do
        local clean_cat=$(echo "$cat" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
        local found=false
        
        for existing in "${existing_categories[@]}"; do
            if [[ "$existing" == "$clean_cat" ]]; then
                found=true
                break
            fi
        done
        
        if [[ "$found" == false ]]; then
            create_category_page "$cat"
            changes_made=true
        fi
    done
    
    # 사용되지 않는 카테고리 페이지 삭제
    for existing in "${existing_categories[@]}"; do
        local found=false
        
        for cat in "${used_categories[@]}"; do
            local clean_cat=$(echo "$cat" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
            if [[ "$existing" == "$clean_cat" ]]; then
                found=true
                break
            fi
        done
        
        if [[ "$found" == false ]]; then
            log_warning "Category '$existing' is no longer used by any post"
            delete_category_page "$existing"
            changes_made=true
        fi
    done
    
    # 자동 커밋
    if [[ "$AUTO_COMMIT" == true && "$changes_made" == true ]]; then
        auto_commit_changes
    fi
    
    if [[ "$changes_made" == true ]]; then
        log_success "Category sync completed with changes"
    else
        log_info "Category sync completed - no changes needed"
    fi
    
    exit 0
}

main
