#!/bin/bash

# Jekyll 블로그 서버 실행 스크립트
# 사용법: ./serve.sh [옵션]

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수: 도움말 출력
show_help() {
    echo -e "${BLUE}📝 Jekyll 블로그 서버 실행 스크립트${NC}"
    echo ""
    echo "사용법:"
    echo "  ./serve.sh              # 기본 서버 실행 (포트: 4000)"
    echo "  ./serve.sh --port 3000  # 특정 포트로 실행"
    echo "  ./serve.sh --drafts     # 초안 포함하여 실행"
    echo "  ./serve.sh --livereload # 라이브 리로드 활성화"
    echo "  ./serve.sh --production # 프로덕션 모드로 실행"
    echo "  ./serve.sh --help       # 도움말 출력"
    echo ""
    echo "옵션 조합:"
    echo "  ./serve.sh --port 3000 --drafts --livereload"
    echo ""
}

# 기본 설정
PORT="4000"
DRAFTS=""
LIVERELOAD=""
PRODUCTION=""
BUNDLE_CMD="bundle exec jekyll serve"

# 인자 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        --port)
            PORT="$2"
            shift 2
            ;;
        --drafts)
            DRAFTS="--drafts"
            shift
            ;;
        --livereload)
            LIVERELOAD="--livereload"
            shift
            ;;
        --production)
            PRODUCTION="1"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
            echo "도움말을 보려면 ./serve.sh --help를 실행하세요."
            exit 1
            ;;
    esac
done

# 함수: 프로세스 정리
cleanup() {
    echo -e "\n${YELLOW}🛑 서버를 종료합니다...${NC}"
    # Jekyll 프로세스 종료
    pkill -f "jekyll serve" 2>/dev/null
    exit 0
}

# Ctrl+C 신호 처리
trap cleanup SIGINT

echo -e "${BLUE}🚀 Jekyll 블로그 서버 시작${NC}"
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

# 프로덕션 모드 설정
if [ "$PRODUCTION" = "1" ]; then
    export JEKYLL_ENV=production
    echo -e "${GREEN}🏭 프로덕션 모드로 실행합니다.${NC}"
else
    export JEKYLL_ENV=development
    echo -e "${GREEN}🔧 개발 모드로 실행합니다.${NC}"
fi

# 명령어 구성
CMD="$BUNDLE_CMD --host 0.0.0.0 --port $PORT $DRAFTS $LIVERELOAD"

echo -e "${GREEN}📍 서버 정보:${NC}"
echo "  - 포트: $PORT"
echo "  - URL: http://localhost:$PORT"
echo "  - 호스트: 0.0.0.0 (외부 접근 가능)"
[ "$DRAFTS" ] && echo "  - 초안 포함: 활성화"
[ "$LIVERELOAD" ] && echo "  - 라이브 리로드: 활성화"
[ "$PRODUCTION" = "1" ] && echo "  - 환경: 프로덕션" || echo "  - 환경: 개발"
echo ""
echo -e "${YELLOW}⚡ 서버를 시작합니다...${NC}"
echo -e "${YELLOW}🛑 종료하려면 Ctrl+C를 누르세요.${NC}"
echo "=================================="

# Jekyll 서버 실행
$CMD