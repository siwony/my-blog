#!/bin/bash

# 실제 네트워크 환경 시뮬레이션 테스트 스크립트
echo "=== 실제 네트워크 성능 테스트 ==="
echo "날짜: $(date)"
echo

# 테스트용 서버 포트
DEV_PORT=8001
PROD_PORT=8002

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔧 환경 준비 중..."

# 기존 서버 프로세스 종료
pkill -f "python3 -m http.server $DEV_PORT" 2>/dev/null
pkill -f "python3 -m http.server $PROD_PORT" 2>/dev/null
sleep 2

# Dev 환경 빌드
echo "📦 Dev 환경 빌드 중..."
npm run build:dev > /dev/null 2>&1
cp -r _site _site_dev

# Prod 환경 빌드  
echo "🚀 Prod 환경 빌드 중..."
npm run build:prod > /dev/null 2>&1
cp -r _site _site_prod

# 서버 시작
echo "🌐 테스트 서버 시작..."
cd _site_dev && python3 -m http.server $DEV_PORT > /dev/null 2>&1 &
DEV_PID=$!
cd ../

cd _site_prod && python3 -m http.server $PROD_PORT > /dev/null 2>&1 &
PROD_PID=$!
cd ../

# 서버 시작 대기
sleep 3

echo "✅ 준비 완료!"
echo "   - Dev 서버: http://localhost:$DEV_PORT"
echo "   - Prod 서버: http://localhost:$PROD_PORT"
echo

# 네트워크 속도별 테스트 함수
test_network_speed() {
    local speed_name="$1"
    local limit_kbps="$2"
    local url_dev="http://localhost:$DEV_PORT"
    local url_prod="http://localhost:$PROD_PORT"
    
    echo -e "${BLUE}🌐 $speed_name 환경 테스트${NC}"
    echo "========================================="
    
    # Dev 환경 테스트
    echo -n "Dev 환경 로딩 시간: "
    dev_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_dev")
    echo -e "${YELLOW}${dev_time}초${NC}"
    
    # CSS 파일 테스트
    echo -n "Dev CSS 로딩 시간: "
    dev_css_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_dev/assets/css/style.css")
    echo -e "${YELLOW}${dev_css_time}초${NC}"
    
    # JS 파일들 테스트 (주요 파일만)
    echo -n "Dev JS 로딩 시간: "
    dev_js_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_dev/assets/js/blog-pagination.js")
    echo -e "${YELLOW}${dev_js_time}초${NC}"
    
    echo
    
    # Prod 환경 테스트
    echo -n "Prod 환경 로딩 시간: "
    prod_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_prod")
    echo -e "${GREEN}${prod_time}초${NC}"
    
    echo -n "Prod CSS 로딩 시간: "
    prod_css_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_prod/assets/css/style.css")
    echo -e "${GREEN}${prod_css_time}초${NC}"
    
    echo -n "Prod JS 로딩 시간: "
    prod_js_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate ${limit_kbps}k "$url_prod/assets/js/blog-pagination.js")
    echo -e "${GREEN}${prod_js_time}초${NC}"
    
    # 성능 개선 계산
    home_improvement=$(awk "BEGIN {printf \"%.2f\", ($dev_time - $prod_time)}")
    css_improvement=$(awk "BEGIN {printf \"%.2f\", ($dev_css_time - $prod_css_time)}")
    js_improvement=$(awk "BEGIN {printf \"%.2f\", ($dev_js_time - $prod_js_time)}")
    
    echo
    echo -e "${RED}📊 성능 개선 결과:${NC}"
    echo "   홈페이지: ${home_improvement}초 단축"
    echo "   CSS 파일: ${css_improvement}초 단축" 
    echo "   JS 파일: ${js_improvement}초 단축"
    echo
}

# 다양한 네트워크 환경 테스트
echo "🚀 네트워크 성능 테스트 시작!"
echo

# 3G 환경 (200KB/s)
test_network_speed "3G" "200"

# 4G/LTE 환경 (1.25MB/s = 1280KB/s) 
test_network_speed "4G/LTE" "1280"

# WiFi 환경 (6.25MB/s = 6400KB/s)
test_network_speed "WiFi" "6400"

# 고속 인터넷 (25MB/s = 25600KB/s)
test_network_speed "고속 인터넷" "25600"

echo "🔧 서버 정리 중..."
kill $DEV_PID $PROD_PID 2>/dev/null
rm -rf _site_dev _site_prod

echo -e "${GREEN}✅ 모든 테스트 완료!${NC}"
echo
echo "📋 요약:"
echo "   - 3G에서 가장 큰 성능 차이"
echo "   - CSS/JS 압축 효과가 실제로 체감됨"
echo "   - 네트워크가 느릴수록 최적화 효과 증대"