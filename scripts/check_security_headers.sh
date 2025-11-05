#!/bin/bash

# 보안 헤더 검증 스크립트
# 사용법: ./scripts/check_security_headers.sh [URL]

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 기본 URL 설정
URL="${1:-http://localhost}"

echo -e "${BLUE}🔒 보안 헤더 검증${NC}"
echo "=================================="
echo "대상 URL: $URL"
echo ""

# 헤더 검사 함수
check_header() {
    local header_name="$1"
    local expected_pattern="$2"
    local is_critical="${3:-false}"
    
    echo -n "검사 중: $header_name ... "
    
    local header_value=$(curl -s -I "$URL" | grep -i "^$header_name:" | cut -d' ' -f2- | tr -d '\r\n')
    
    if [ -n "$header_value" ]; then
        if [ -n "$expected_pattern" ] && [[ ! "$header_value" =~ $expected_pattern ]]; then
            echo -e "${YELLOW}⚠️ 발견됨 (값 확인 필요)${NC}"
            echo "   값: $header_value"
        else
            echo -e "${GREEN}✅ 정상${NC}"
            echo "   값: $header_value"
        fi
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}❌ 누락 (중요)${NC}"
        else
            echo -e "${YELLOW}⚠️ 누락${NC}"
        fi
    fi
    echo ""
}

# 필수 보안 헤더 검사
echo -e "${YELLOW}📋 필수 보안 헤더 검사${NC}"
echo "=========================="

check_header "X-Content-Type-Options" "nosniff" true
check_header "X-Frame-Options" "DENY|SAMEORIGIN" true
check_header "Content-Security-Policy" ".*" true
check_header "Referrer-Policy" ".*" false

echo -e "${YELLOW}📋 추가 보안 헤더 검사${NC}"
echo "=========================="

check_header "Strict-Transport-Security" ".*" false
check_header "Permissions-Policy" ".*" false
check_header "Cross-Origin-Embedder-Policy" ".*" false
check_header "Cross-Origin-Opener-Policy" ".*" false
check_header "Cross-Origin-Resource-Policy" ".*" false

# 제거되어야 할 헤더 검사
echo -e "${YELLOW}📋 제거되어야 할 헤더 검사${NC}"
echo "=================================="

echo -n "검사 중: Server 헤더 제거 ... "
server_header=$(curl -s -I "$URL" | grep -i "^Server:" | cut -d' ' -f2- | tr -d '\r\n')
if [ -z "$server_header" ]; then
    echo -e "${GREEN}✅ 정상 (제거됨)${NC}"
else
    echo -e "${YELLOW}⚠️ 여전히 존재${NC}"
    echo "   값: $server_header"
fi
echo ""

echo -n "검사 중: X-Powered-By 헤더 제거 ... "
powered_by_header=$(curl -s -I "$URL" | grep -i "^X-Powered-By:" | cut -d' ' -f2- | tr -d '\r\n')
if [ -z "$powered_by_header" ]; then
    echo -e "${GREEN}✅ 정상 (제거됨)${NC}"
else
    echo -e "${YELLOW}⚠️ 여전히 존재${NC}"
    echo "   값: $powered_by_header"
fi
echo ""

# X-XSS-Protection 헤더 확인 (더 이상 권장되지 않음)
echo -e "${YELLOW}📋 비권장 헤더 검사${NC}"
echo "=========================="

echo -n "검사 중: X-XSS-Protection (비권장) ... "
xss_header=$(curl -s -I "$URL" | grep -i "^X-XSS-Protection:" | cut -d' ' -f2- | tr -d '\r\n')
if [ -z "$xss_header" ]; then
    echo -e "${GREEN}✅ 정상 (제거됨 - 권장)${NC}"
    echo "   → CSP로 대체됨"
else
    echo -e "${YELLOW}⚠️ 여전히 존재 (제거 권장)${NC}"
    echo "   값: $xss_header"
    echo "   → 최신 브라우저에서는 CSP가 더 효과적입니다"
fi
echo ""

echo -e "${BLUE}🔍 보안 헤더 검증 완료${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}💡 권장사항:${NC}"
echo "1. X-XSS-Protection 헤더는 제거하고 CSP에 의존하세요"
echo "2. HTTPS 환경에서는 HSTS 헤더를 활성화하세요"
echo "3. Permissions-Policy로 불필요한 브라우저 기능을 제한하세요"
echo "4. 정기적으로 보안 헤더를 검토하고 업데이트하세요"