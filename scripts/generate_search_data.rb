#!/usr/bin/env ruby
# Generate search data for command palette
require 'yaml'
require 'json'
require 'date'

# Get all markdown files in _posts directory
posts_dir = File.join(File.dirname(__FILE__), '..', '_posts')
search_data = []

Dir.glob("#{posts_dir}/*.md").each do |file_path|
  content = File.read(file_path)
  
  # Extract front matter
  if content =~ /\A---\s*\n(.*?)\n---\s*\n(.*)/m
    front_matter = YAML.load($1)
    content_body = $2
    
    # Extract first paragraph as excerpt
    excerpt = content_body.split("\n\n")[0] || ""
    excerpt = excerpt.gsub(/[#*`\[\]()]/, '').strip
    excerpt = excerpt[0, 150] + (excerpt.length > 150 ? "..." : "")
    
    # Build search item
    search_item = {
      title: front_matter['title'] || '',
      url: "/#{front_matter['categories']}/#{Date.parse(front_matter['date'].to_s).strftime('%Y/%m/%d')}/#{File.basename(file_path, '.md').sub(/^\d{4}-\d{2}-\d{2}-/, '')}/",
      category: front_matter['categories'] || '',
      date: front_matter['date'] || '',
      excerpt: excerpt,
      content: content_body.gsub(/[#*`\[\]()]/, '').strip
    }
    
    search_data << search_item
  end
end

# Sort by date (newest first)
search_data.sort! { |a, b| Date.parse(b[:date].to_s) <=> Date.parse(a[:date].to_s) }

# Write to JSON file
output_file = File.join(File.dirname(__FILE__), '..', 'assets', 'js', 'search-data.json')
File.write(output_file, JSON.pretty_generate(search_data))

puts "Generated search data with #{search_data.length} posts"
puts "Output: #{output_file}"