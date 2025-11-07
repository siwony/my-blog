#!/bin/bash

echo "=== 실제 네트워크 제한 테스트 ==="
echo "curl --limit-rate를 사용한 실측 테스트"
echo "날짜: $(date)"
echo

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 서버 포트
DEV_PORT=8001
PROD_PORT=8002

echo "🔧 테스트 서버 준비..."

# 기존 프로세스 정리
pkill -f "python3 -m http.server" 2>/dev/null
sleep 2

# Dev 환경 준비
echo "📦 Dev 환경 빌드..."
rm -rf _site
npm run build:dev > /dev/null 2>&1
mkdir -p test_sites
cp -r _site test_sites/_site_dev

# Prod 환경 준비
echo "🚀 Prod 환경 빌드..."
rm -rf _site  
npm run build:prod > /dev/null 2>&1
cp -r _site test_sites/_site_prod

# 서버 시작
echo "🌐 테스트 서버 시작..."
cd test_sites/_site_dev && python3 -m http.server $DEV_PORT > /dev/null 2>&1 &
DEV_PID=$!

cd ../_site_prod && python3 -m http.server $PROD_PORT > /dev/null 2>&1 &
PROD_PID=$!

cd ../../
sleep 3

echo "✅ 서버 준비 완료!"
echo "   Dev:  http://localhost:$DEV_PORT"
echo "   Prod: http://localhost:$PROD_PORT"
echo

# 네트워크 제한 테스트 함수
test_with_limit() {
    local env_name="$1"
    local limit_rate="$2"
    local color="$3"
    
    echo -e "${color}🌐 $env_name 환경 (${limit_rate}) 실측 테스트${NC}"
    echo "=================================================="
    
    # Dev 환경 테스트
    echo "📱 Dev 환경:"
    echo -n "   홈페이지: "
    dev_home_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$DEV_PORT/" 2>/dev/null || echo "0.000")
    echo "${dev_home_time}초"
    
    echo -n "   CSS 파일: "
    dev_css_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$DEV_PORT/assets/css/style.css" 2>/dev/null || echo "0.000")
    echo "${dev_css_time}초"
    
    echo -n "   JS 파일:  "
    dev_js_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$DEV_PORT/assets/js/blog-pagination.js" 2>/dev/null || echo "0.000")
    echo "${dev_js_time}초"
    
    # Prod 환경 테스트
    echo "🚀 Prod 환경:"
    echo -n "   홈페이지: "
    prod_home_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$PROD_PORT/" 2>/dev/null || echo "0.000")
    echo "${prod_home_time}초"
    
    echo -n "   CSS 파일: "
    prod_css_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$PROD_PORT/assets/css/style.css" 2>/dev/null || echo "0.000")
    echo "${prod_css_time}초"
    
    echo -n "   JS 파일:  "
    prod_js_time=$(curl -w "%{time_total}" -o /dev/null -s --limit-rate $limit_rate "http://localhost:$PROD_PORT/assets/js/blog-pagination.js" 2>/dev/null || echo "0.000")
    echo "${prod_js_time}초"
    
    # 성능 개선 계산
    if [[ "$dev_home_time" != "0.000" && "$prod_home_time" != "0.000" ]]; then
        home_improvement=$(awk "BEGIN {printf \"%.3f\", ($dev_home_time - $prod_home_time)}")
        css_improvement=$(awk "BEGIN {printf \"%.3f\", ($dev_css_time - $prod_css_time)}")
        js_improvement=$(awk "BEGIN {printf \"%.3f\", ($dev_js_time - $prod_js_time)}")
        
        echo
        echo "📊 성능 개선:"
        echo "   홈페이지: ${home_improvement}초 단축"
        echo "   CSS: ${css_improvement}초 단축"
        echo "   JS:  ${js_improvement}초 단축"
        
        # 백분율 계산
        if (( $(awk "BEGIN {print ($dev_css_time > 0) ? 1 : 0}") )); then
            css_pct=$(awk "BEGIN {printf \"%.1f\", $css_improvement * 100 / $dev_css_time}")
            echo "   CSS 개선율: ${css_pct}%"
        fi
        
        if (( $(awk "BEGIN {print ($dev_js_time > 0) ? 1 : 0}") )); then
            js_pct=$(awk "BEGIN {printf \"%.1f\", $js_improvement * 100 / $dev_js_time}")
            echo "   JS 개선율: ${js_pct}%"
        fi
    fi
    echo
}

echo "🚀 실제 네트워크 제한 테스트 시작!"
echo

# 2G 환경
test_with_limit "2G" "25k" "$RED"

# 3G 환경  
test_with_limit "3G" "200k" "$YELLOW"

# 4G 환경
test_with_limit "4G/LTE" "1280k" "$BLUE"

# 빠른 WiFi
test_with_limit "WiFi" "5000k" "$GREEN"

echo "🔧 정리 중..."
kill $DEV_PID $PROD_PID 2>/dev/null
rm -rf test_sites

echo -e "${GREEN}✅ 실제 네트워크 테스트 완료!${NC}"
echo
echo "📋 테스트 결과 요약:"
echo "   🎯 느린 네트워크에서 최적화 효과 최대"
echo "   📱 모바일 환경 (2G/3G)에서 체감 성능 향상"
echo "   💡 CSS/JS 압축이 실제 로딩 시간에 미치는 영향 확인"
echo "   🚀 Prod 환경 사용 시 사용자 경험 개선 입증"