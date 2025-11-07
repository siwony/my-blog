#!/bin/bash

echo "=== 실제 네트워크 환경별 성능 분석 ==="
echo "날짜: $(date)"
echo

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo "🔧 환경별 빌드 및 파일 크기 측정..."

# Dev 환경 빌드 및 측정
echo "📦 Dev 환경 분석 중..."
rm -rf _site
npm run build:dev > /dev/null 2>&1

# 파일 크기 측정 (바이트 단위)
dev_html_size=$(stat -f%z _site/index.html)
dev_css_size=$(stat -f%z _site/assets/css/style.css)
dev_js_total=0
for js_file in _site/assets/js/*.js; do
    if [[ -f "$js_file" && ! "$js_file" =~ search-data ]]; then
        size=$(stat -f%z "$js_file")
        dev_js_total=$((dev_js_total + size))
    fi
done

echo "📊 Dev 환경 파일 크기:"
echo "   HTML (index): $(echo "scale=2; $dev_html_size/1024" | bc)KB"
echo "   CSS (style): $(echo "scale=2; $dev_css_size/1024" | bc)KB" 
echo "   JS (총합): $(echo "scale=2; $dev_js_total/1024" | bc)KB"

# Prod 환경 빌드 및 측정
echo "🚀 Prod 환경 분석 중..."
rm -rf _site
npm run build:prod > /dev/null 2>&1

prod_html_size=$(stat -f%z _site/index.html)
prod_css_size=$(stat -f%z _site/assets/css/style.css)
prod_js_total=0
for js_file in _site/assets/js/*.js; do
    if [[ -f "$js_file" && ! "$js_file" =~ search-data ]]; then
        size=$(stat -f%z "$js_file")
        prod_js_total=$((prod_js_total + size))
    fi
done

echo "📊 Prod 환경 파일 크기:"
echo "   HTML (index): $(echo "scale=2; $prod_html_size/1024" | bc)KB"
echo "   CSS (style): $(echo "scale=2; $prod_css_size/1024" | bc)KB"
echo "   JS (총합): $(echo "scale=2; $prod_js_total/1024" | bc)KB"
echo

# 압축률 계산
html_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_html_size - $prod_html_size) * 100 / $dev_html_size}")
css_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_css_size - $prod_css_size) * 100 / $dev_css_size}")
js_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_js_total - $prod_js_total) * 100 / $dev_js_total}")

echo -e "${PURPLE}🎯 압축률 분석${NC}"
echo "==============="
echo "HTML 압축률: ${html_reduction}%"
echo "CSS 압축률: ${css_reduction}%"  
echo "JS 압축률: ${js_reduction}%"
echo

# 네트워크 환경별 로딩 시간 계산
calculate_loading_time() {
    local env_name="$1"
    local speed_kbps="$2"  # KB/s 단위
    local color="$3"
    
    echo -e "${color}🌐 $env_name 환경 로딩 시간${NC}"
    echo "=============================="
    
    # Dev 환경 로딩 시간
    dev_html_time=$(awk "BEGIN {printf \"%.2f\", $dev_html_size / 1024 / $speed_kbps}")
    dev_css_time=$(awk "BEGIN {printf \"%.2f\", $dev_css_size / 1024 / $speed_kbps}")
    dev_js_time=$(awk "BEGIN {printf \"%.2f\", $dev_js_total / 1024 / $speed_kbps}")
    dev_total_time=$(awk "BEGIN {printf \"%.2f\", ($dev_html_size + $dev_css_size + $dev_js_total) / 1024 / $speed_kbps}")
    
    # Prod 환경 로딩 시간  
    prod_html_time=$(awk "BEGIN {printf \"%.2f\", $prod_html_size / 1024 / $speed_kbps}")
    prod_css_time=$(awk "BEGIN {printf \"%.2f\", $prod_css_size / 1024 / $speed_kbps}")
    prod_js_time=$(awk "BEGIN {printf \"%.2f\", $prod_js_total / 1024 / $speed_kbps}")
    prod_total_time=$(awk "BEGIN {printf \"%.2f\", ($prod_html_size + $prod_css_size + $prod_js_total) / 1024 / $speed_kbps}")
    
    # 시간 단축 계산
    html_saved=$(awk "BEGIN {printf \"%.2f\", $dev_html_time - $prod_html_time}")
    css_saved=$(awk "BEGIN {printf \"%.2f\", $dev_css_time - $prod_css_time}")
    js_saved=$(awk "BEGIN {printf \"%.2f\", $dev_js_time - $prod_js_time}")
    total_saved=$(awk "BEGIN {printf \"%.2f\", $dev_total_time - $prod_total_time}")
    
    echo "🔍 개별 파일 로딩 시간:"
    echo "   HTML: ${dev_html_time}s → ${prod_html_time}s (${html_saved}s 단축)"
    echo "   CSS:  ${dev_css_time}s → ${prod_css_time}s (${css_saved}s 단축)"
    echo "   JS:   ${dev_js_time}s → ${prod_js_time}s (${js_saved}s 단축)"
    echo
    echo "📈 전체 로딩 시간:"
    echo "   Dev:  ${dev_total_time}초"
    echo "   Prod: ${prod_total_time}초"
    echo "   단축: ${total_saved}초"
    echo
    
    # 백분율 개선
    if (( $(awk "BEGIN {print ($dev_total_time > 0) ? 1 : 0}") )); then
        improvement_pct=$(awk "BEGIN {printf \"%.1f\", $total_saved * 100 / $dev_total_time}")
        echo "   개선율: ${improvement_pct}%"
    fi
    echo
}

# 다양한 네트워크 환경에서 테스트
echo "🚀 실제 네트워크 환경별 성능 분석"
echo "=================================="
echo

# 2G 환경 (느린 모바일) - 20KB/s
calculate_loading_time "2G (느린 모바일)" "20" "$RED"

# 3G 환경 - 200KB/s  
calculate_loading_time "3G" "200" "$YELLOW"

# 4G/LTE 환경 - 1.25MB/s = 1280KB/s
calculate_loading_time "4G/LTE" "1280" "$BLUE"

# WiFi 환경 - 6.25MB/s = 6400KB/s
calculate_loading_time "WiFi (일반)" "6400" "$GREEN"

# 고속 인터넷 - 25MB/s = 25600KB/s
calculate_loading_time "고속 브로드밴드" "25600" "$PURPLE"

echo -e "${GREEN}✅ 네트워크 성능 분석 완료!${NC}"
echo
echo "📋 핵심 인사이트:"
echo "   🔸 느린 네트워크일수록 최적화 효과 극대화"
echo "   🔸 JS 파일 압축률이 가장 높음 (${js_reduction}%)"
echo "   🔸 CSS 압축도 상당한 효과 (${css_reduction}%)"
echo "   🔸 HTML 압축으로 추가 최적화 (${html_reduction}%)"
echo "   🔸 모바일 사용자에게 특히 큰 도움"