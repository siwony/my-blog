source "https://rubygems.org"

# Ruby 4.0+ compatibility - these gems were removed from stdlib
gem "logger"
gem "ostruct"
gem "base64"
gem "csv"
gem "bigdecimal"

# HTML parsing for plugins
gem "nokogiri", "~> 1.16"

# Jekyll 3.x 최신 안정 버전 (호환성 고려)
gem "jekyll", "~> 3.9.5"
gem "webrick", "~> 1.8"
gem "kramdown-parser-gfm", "~> 1.1"

# 성능 향상을 위한 gem
gem "sassc", "~> 2.4"

# Essential plugins - 최신 호환 버전으로 업데이트
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-sass-converter", "~> 1.5"
end

# 개발 도구 (프로덕션에서만 사용)
group :production do
  gem "uglifier", "~> 4.2"
end
