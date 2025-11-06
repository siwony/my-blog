#!/bin/bash

# 홈서버 배포 스크립트 - Jekyll 블로그
# 사용법: ./deploy-homeserver.sh [옵션]

set -e  # Exit on any error

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 함수: 도움말 출력
show_help() {
    echo -e "${BLUE}🏠 홈서버 배포 스크립트${NC}"
    echo ""
    echo "사용법:"
    echo "  ./deploy-homeserver.sh              # 전체 배포 (빌드 + 도커 시작)"
    echo "  ./deploy-homeserver.sh --build-only # Jekyll 빌드만 실행"
    echo "  ./deploy-homeserver.sh --deploy-only# 도커 컨테이너만 시작"
    echo "  ./deploy-homeserver.sh --restart    # 컨테이너 재시작"
    echo "  ./deploy-homeserver.sh --stop       # 컨테이너 중지"
    echo "  ./deploy-homeserver.sh --logs       # 로그 확인"
    echo "  ./deploy-homeserver.sh --status     # 상태 확인"
    echo "  ./deploy-homeserver.sh --help       # 도움말 출력"
    echo ""
    echo "예시:"
    echo "  ./deploy-homeserver.sh --build-only && ./deploy-homeserver.sh --deploy-only"
    echo ""
}

# 함수: 로고 출력
print_logo() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🏠 홈서버 Jekyll 배포                      ║"
    echo "║               Caddy + Docker + Let's Encrypt                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 함수: Jekyll 빌드
build_jekyll() {
    echo -e "${YELLOW}🔨 Jekyll 사이트 빌드 중...${NC}"
    
    # Gemfile 존재 확인
    if [ ! -f "Gemfile" ]; then
        echo -e "${RED}❌ Gemfile이 없습니다. 올바른 디렉토리에 있는지 확인하세요.${NC}"
        exit 1
    fi
    
    # Bundle 설치 확인
    if ! command -v bundle &> /dev/null; then
        echo -e "${RED}❌ Bundler가 설치되지 않았습니다. 다음 명령어로 설치하세요:${NC}"
        echo "   gem install bundler"
        exit 1
    fi
    
    # 의존성 설치 (필요한 경우)
    if [ ! -d "vendor/bundle" ] && [ ! -d ".bundle" ]; then
        echo -e "${YELLOW}📦 Jekyll 의존성 설치 중...${NC}"
        bundle install
    fi
    
    # Jekyll 빌드 (프로덕션 모드)
    echo -e "${YELLOW}🏗️ 프로덕션 빌드 실행 중...${NC}"
    JEKYLL_ENV=production bundle exec jekyll build
    
    # _site 디렉토리 확인
    if [ ! -d "_site" ]; then
        echo -e "${RED}❌ Jekyll 빌드 실패. _site 디렉토리가 생성되지 않았습니다.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Jekyll 사이트 빌드 완료!${NC}"
}

# 함수: Docker 상태 확인
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker가 실행 중이 아닙니다. Docker를 시작하고 다시 시도하세요.${NC}"
        exit 1
    fi
}

# 함수: Docker 배포
deploy_docker() {
    echo -e "${YELLOW}🐳 Docker 컨테이너 배포 중...${NC}"
    
    # Docker 상태 확인
    check_docker
    
    # 기존 컨테이너 중지 (있는 경우)
    if docker-compose -f docker-compose.homeserver.yml ps | grep -q "jekyll-homeserver"; then
        echo -e "${YELLOW}🔄 기존 컨테이너 중지 중...${NC}"
        docker-compose -f docker-compose.homeserver.yml down
    fi
    
    # 새 컨테이너 시작
    echo -e "${YELLOW}🚀 새 컨테이너 시작 중...${NC}"
    docker-compose -f docker-compose.homeserver.yml up -d
    
    # 컨테이너 상태 확인
    sleep 5
    if docker-compose -f docker-compose.homeserver.yml ps | grep -q "Up"; then
        echo -e "${GREEN}✅ 컨테이너가 성공적으로 시작되었습니다!${NC}"
        show_status
    else
        echo -e "${RED}❌ 컨테이너 시작에 실패했습니다.${NC}"
        echo -e "${YELLOW}로그를 확인하세요: ./deploy-homeserver.sh --logs${NC}"
        exit 1
    fi
}

# 함수: 상태 확인
show_status() {
    echo -e "${BLUE}📊 서비스 상태${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Docker 컨테이너 상태
    if docker-compose -f docker-compose.homeserver.yml ps | grep -q "jekyll-homeserver"; then
        echo -e "${GREEN}🐳 Docker 컨테이너: 실행 중${NC}"
        docker-compose -f docker-compose.homeserver.yml ps
    else
        echo -e "${RED}🐳 Docker 컨테이너: 중지됨${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📡 접근 정보${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "🌐 HTTPS 주소: ${GREEN}https://yourdomain.com:8443${NC}"
    echo -e "🔒 HTTP 리다이렉트: ${YELLOW}http://yourdomain.com:8080${NC}"
    echo -e "📁 정적 파일 경로: ${BLUE}$(pwd)/_site${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  주의: Caddyfile.homeserver에서 'yourdomain.com'과 이메일을 실제 값으로 변경하세요!${NC}"
}

# 함수: 로그 확인
show_logs() {
    echo -e "${BLUE}📋 컨테이너 로그 (실시간)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}종료하려면 Ctrl+C를 누르세요${NC}"
    echo ""
    docker-compose -f docker-compose.homeserver.yml logs -f
}

# 함수: 컨테이너 중지
stop_containers() {
    echo -e "${YELLOW}🛑 컨테이너 중지 중...${NC}"
    docker-compose -f docker-compose.homeserver.yml down
    echo -e "${GREEN}✅ 컨테이너가 중지되었습니다.${NC}"
}

# 함수: 컨테이너 재시작
restart_containers() {
    echo -e "${YELLOW}🔄 컨테이너 재시작 중...${NC}"
    docker-compose -f docker-compose.homeserver.yml restart
    echo -e "${GREEN}✅ 컨테이너가 재시작되었습니다.${NC}"
    show_status
}

# 메인 실행 부분
main() {
    # 인자가 없으면 전체 배포
    if [ $# -eq 0 ]; then
        print_logo
        build_jekyll
        deploy_docker
        return
    fi
    
    # 인자 파싱
    case $1 in
        --build-only)
            print_logo
            build_jekyll
            ;;
        --deploy-only)
            print_logo
            deploy_docker
            ;;
        --restart)
            restart_containers
            ;;
        --stop)
            stop_containers
            ;;
        --logs)
            show_logs
            ;;
        --status)
            show_status
            ;;
        --help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@"