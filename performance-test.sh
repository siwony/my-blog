#!/bin/bash

echo "=== Jekyll Blog 성능 테스트 ==="
echo "날짜: $(date)"
echo

# Dev 빌드 테스트
echo "🔧 Development 환경 테스트"
echo "========================="
rm -rf _site
start_time=$(date +%s.%N)
npm run build:dev > /dev/null 2>&1
end_time=$(date +%s.%N)
dev_build_time=$(echo "$end_time - $start_time" | bc -l)

# Dev 파일 크기
dev_total_size=$(du -sk _site | cut -f1)
dev_css_size=$(find _site -name "style.css" -exec stat -f%z {} \;)
dev_js_size=$(find _site -name "*.js" -not -path "*search-data*" -exec stat -f%z {} \; | awk '{sum += $1} END {print sum}')

echo "빌드 시간: ${dev_build_time}초"
echo "전체 크기: $(awk "BEGIN {printf \"%.2f\", $dev_total_size/1024}")MB"
echo "CSS 크기: $(awk "BEGIN {printf \"%.2f\", $dev_css_size/1024}")KB"
echo "JS 크기: $(awk "BEGIN {printf \"%.2f\", $dev_js_size/1024}")KB"
echo

# Prod 빌드 테스트
echo "🚀 Production 환경 테스트"
echo "========================"
rm -rf _site
start_time=$(date +%s.%N)
npm run build:prod > /dev/null 2>&1
end_time=$(date +%s.%N)
prod_build_time=$(echo "$end_time - $start_time" | bc -l)

# Prod 파일 크기
prod_total_size=$(du -sk _site | cut -f1)
prod_css_size=$(find _site -name "style.css" -exec stat -f%z {} \;)
prod_js_size=$(find _site -name "*.js" -not -path "*search-data*" -exec stat -f%z {} \; | awk '{sum += $1} END {print sum}')

echo "빌드 시간: ${prod_build_time}초"
echo "전체 크기: $(awk "BEGIN {printf \"%.2f\", $prod_total_size/1024}")MB"
echo "CSS 크기: $(awk "BEGIN {printf \"%.2f\", $prod_css_size/1024}")KB"
echo "JS 크기: $(awk "BEGIN {printf \"%.2f\", $prod_js_size/1024}")KB"
echo

# 성능 개선 비교
echo "📊 성능 개선 분석"
echo "================="
build_time_diff=$(awk "BEGIN {printf \"%.1f\", ($prod_build_time - $dev_build_time) * 100 / $dev_build_time}")
css_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_css_size - $prod_css_size) * 100 / $dev_css_size}")
js_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_js_size - $prod_js_size) * 100 / $dev_js_size}")
total_reduction=$(awk "BEGIN {printf \"%.1f\", ($dev_total_size - $prod_total_size) * 100 / $dev_total_size}")

echo "빌드 시간 차이: ${build_time_diff}% (Prod가 더 오래 걸림)"
echo "CSS 파일 감소: ${css_reduction}%"
echo "JS 파일 감소: ${js_reduction}%"
echo "전체 크기 감소: ${total_reduction}%"
echo

# 예상 로딩 성능 (3G 기준: 1.6 Mbps = 200KB/s)
dev_load_time=$(awk "BEGIN {printf \"%.2f\", $dev_total_size / 200}")
prod_load_time=$(awk "BEGIN {printf \"%.2f\", $prod_total_size / 200}")
load_time_saved=$(awk "BEGIN {printf \"%.2f\", $dev_load_time - $prod_load_time}")

echo "🌐 로딩 시간 추정 (3G 환경)"
echo "=========================="
echo "Dev 환경: ${dev_load_time}초"
echo "Prod 환경: ${prod_load_time}초"
echo "절약 시간: ${load_time_saved}초"

echo
echo "✅ 테스트 완료!"