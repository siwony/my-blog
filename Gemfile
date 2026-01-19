source "https://rubygems.org"

# Ruby 4.0+ compatibility - these gems were removed from stdlib
gem "logger"
gem "ostruct"
gem "base64"
gem "csv"
gem "bigdecimal"

# HTML parsing for plugins
gem "nokogiri", "~> 1.16"

# Jekyll 4.x 최신 버전
gem "jekyll", "~> 4.3"
gem "webrick", "~> 1.8"
gem "kramdown-parser-gfm", "~> 1.1"

# Essential plugins - Jekyll 4 호환 버전
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-sass-converter", "~> 3.0"
end

# 개발 도구 (프로덕션에서만 사용)
group :production do
  gem "uglifier", "~> 4.2"
end
