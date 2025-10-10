#!/usr/bin/env ruby
# 새 카테고리 페이지를 자동으로 생성하는 스크립트

require 'fileutils'

def create_category_page(category_name)
  # 카테고리 이름 검증
  if category_name.nil? || category_name.strip.empty?
    puts "❌ 카테고리 이름을 입력해주세요."
    return false
  end

  # 카테고리 이름 정리 (소문자, 공백 제거)
  clean_name = category_name.strip.downcase.gsub(/\s+/, '-')
  
  # 제목 변환 (첫 글자 대문자)
  title = category_name.strip.split(' ').map(&:capitalize).join(' ')
  
  # 파일 경로
  category_dir = File.join(File.dirname(__FILE__), '..', 'category')
  file_path = File.join(category_dir, "#{clean_name}.html")
  
  # 이미 존재하는지 확인
  if File.exist?(file_path)
    puts "⚠️  카테고리 '#{clean_name}'는 이미 존재합니다: #{file_path}"
    return false
  end
  
  # 카테고리 디렉토리 생성 (존재하지 않는 경우)
  FileUtils.mkdir_p(category_dir) unless Dir.exist?(category_dir)
  
  # 카테고리 페이지 내용
  content = <<~HTML
    ---
    layout: category
    category: #{clean_name}
    title: #{title} Posts
    permalink: /category/#{clean_name}/
    ---
  HTML
  
  # 파일 생성
  File.write(file_path, content)
  
  puts "✅ 카테고리 '#{clean_name}' 페이지가 생성되었습니다!"
  puts "📁 파일 위치: #{file_path}"
  puts "🔗 URL: /category/#{clean_name}/"
  puts ""
  puts "📝 사용법: 포스트의 front matter에 다음을 추가하세요:"
  puts "   categories: #{clean_name}"
  
  return true
end

def list_existing_categories
  category_dir = File.join(File.dirname(__FILE__), '..', 'category')
  
  unless Dir.exist?(category_dir)
    puts "📂 카테고리 디렉토리가 존재하지 않습니다."
    return
  end
  
  category_files = Dir.glob(File.join(category_dir, '*.html'))
  
  if category_files.empty?
    puts "📂 생성된 카테고리가 없습니다."
    return
  end
  
  puts "📂 기존 카테고리 목록:"
  category_files.each do |file|
    category_name = File.basename(file, '.html')
    puts "   • #{category_name}"
  end
end

# 메인 실행
if ARGV.length == 0
  puts "🏷️  카테고리 관리 스크립트"
  puts ""
  puts "사용법:"
  puts "  ruby scripts/create_category.rb [카테고리명]"
  puts "  ruby scripts/create_category.rb --list"
  puts ""
  puts "예시:"
  puts "  ruby scripts/create_category.rb tutorial"
  puts "  ruby scripts/create_category.rb \"Web Development\""
  puts ""
  list_existing_categories
elsif ARGV[0] == '--list' || ARGV[0] == '-l'
  list_existing_categories
else
  category_name = ARGV.join(' ')
  create_category_page(category_name)
end