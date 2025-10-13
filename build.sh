#!/bin/bash

# Jekyll 블로그 빌드 스크립트
# 사용법: ./build.sh [옵션]

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수: 도움말 출력
show_help() {
    echo -e "${BLUE}🔨 Jekyll 블로그 빌드 스크립트${NC}"
    echo ""
    echo "사용법:"
    echo "  ./build.sh              # 기본 빌드 (개발 모드)"
    echo "  ./build.sh --production # 프로덕션 빌드"
    echo "  ./build.sh --drafts     # 초안 포함 빌드"
    echo "  ./build.sh --clean      # 빌드 전 캐시 정리"
    echo "  ./build.sh --help       # 도움말 출력"
    echo ""
    echo "옵션 조합:"
    echo "  ./build.sh --production --clean"
    echo ""
}

# 기본 설정
PRODUCTION=""
DRAFTS=""
CLEAN=""
BUNDLE_CMD="bundle exec jekyll build"

# 인자 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        --production)
            PRODUCTION="1"
            shift
            ;;
        --drafts)
            DRAFTS="--drafts"
            shift
            ;;
        --clean)
            CLEAN="1"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
            echo "도움말을 보려면 ./build.sh --help를 실행하세요."
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🔨 Jekyll 블로그 빌드${NC}"
echo "=================================="

# Bundle 설치 확인
if ! command -v bundle &> /dev/null; then
    echo -e "${RED}❌ Bundler가 설치되지 않았습니다.${NC}"
    echo -e "${YELLOW}💡 다음 명령어로 설치하세요: gem install bundler${NC}"
    exit 1
fi

# Gemfile 확인
if [ ! -f "Gemfile" ]; then
    echo -e "${RED}❌ Gemfile을 찾을 수 없습니다.${NC}"
    echo -e "${YELLOW}💡 Jekyll 프로젝트 루트 디렉토리에서 실행하세요.${NC}"
    exit 1
fi

# 의존성 설치 확인
echo -e "${YELLOW}📦 의존성 확인 중...${NC}"
if ! bundle check &> /dev/null; then
    echo -e "${YELLOW}⬇️ 의존성 설치 중...${NC}"
    bundle install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 의존성 설치에 실패했습니다.${NC}"
        exit 1
    fi
fi

# 캐시 정리
if [ "$CLEAN" = "1" ]; then
    echo -e "${YELLOW}🧹 캐시 및 기존 빌드 정리 중...${NC}"
    bundle exec jekyll clean
    rm -rf .sass-cache/
    echo -e "${GREEN}✅ 정리 완료${NC}"
fi

# 프로덕션 모드 설정
if [ "$PRODUCTION" = "1" ]; then
    export JEKYLL_ENV=production
    echo -e "${GREEN}🏭 프로덕션 모드로 빌드합니다.${NC}"
else
    export JEKYLL_ENV=development
    echo -e "${GREEN}🔧 개발 모드로 빌드합니다.${NC}"
fi

# 빌드 정보 출력
echo -e "${GREEN}📍 빌드 정보:${NC}"
[ "$PRODUCTION" = "1" ] && echo "  - 환경: 프로덕션" || echo "  - 환경: 개발"
[ "$DRAFTS" ] && echo "  - 초안 포함: 활성화"
[ "$CLEAN" = "1" ] && echo "  - 캐시 정리: 완료"
echo "  - 출력 디렉토리: _site/"
echo ""

# 빌드 시작 시간 기록
START_TIME=$(date +%s)

echo -e "${YELLOW}⚡ 빌드를 시작합니다...${NC}"
echo "=================================="

# Jekyll 빌드 실행
CMD="$BUNDLE_CMD $DRAFTS"
$CMD

# 빌드 결과 확인
BUILD_EXIT_CODE=$?
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "=================================="

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ 빌드가 성공적으로 완료되었습니다!${NC}"
    echo -e "${GREEN}⏱️ 빌드 시간: ${DURATION}초${NC}"
    
    # 빌드 결과 정보
    if [ -d "_site" ]; then
        SITE_SIZE=$(du -sh _site | cut -f1)
        FILE_COUNT=$(find _site -type f | wc -l | tr -d ' ')
        echo -e "${GREEN}📊 빌드 결과:${NC}"
        echo "  - 사이트 크기: $SITE_SIZE"
        echo "  - 파일 수: $FILE_COUNT"
        echo "  - 출력 경로: $(pwd)/_site"
    fi
else
    echo -e "${RED}❌ 빌드에 실패했습니다.${NC}"
    echo -e "${YELLOW}💡 위의 오류 메시지를 확인하고 수정해보세요.${NC}"
    exit 1
fi