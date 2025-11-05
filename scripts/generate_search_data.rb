#!/usr/bin/env ruby
# Generate search data for command palette
require 'yaml'
require 'json'
require 'date'

# Get all markdown files in _posts directory
posts_dir = File.join(File.dirname(__FILE__), '..', '_posts')
search_data = []

Dir.glob("#{posts_dir}/*.md").each do |file_path|
  begin
    content = File.read(file_path, encoding: 'UTF-8')
    
    # Extract front matter - handle both YAML.load and YAML.safe_load
    if content =~ /\A---\s*\n(.*?)\n---\s*\n(.*)/m
      begin
        # Try safe_load first, fallback to load for compatibility
        front_matter = YAML.safe_load($1, permitted_classes: [Date, Time]) rescue YAML.load($1)
        content_body = $2
      rescue => e
        puts "Warning: Failed to parse YAML in #{file_path}: #{e.message}"
        next
      end
      
      # Skip if essential fields are missing
      next unless front_matter && front_matter['title'] && front_matter['date']
      
      # Extract filename date and title
      filename = File.basename(file_path, '.md')
      filename_match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
      
      if filename_match
        file_date = filename_match[1]
        file_title_slug = filename_match[2]
      else
        puts "Warning: Invalid filename format: #{filename}"
        next
      end
      
      # Extract first meaningful paragraph as excerpt
      excerpt = content_body.dup
      # Remove markdown headers
      excerpt = excerpt.gsub(/^#+\s+.*$/, '')
      # Remove code blocks
      excerpt = excerpt.gsub(/```.*?```/m, '')
      excerpt = excerpt.gsub(/`[^`]+`/, '')
      # Remove markdown formatting
      excerpt = excerpt.gsub(/[#*`\[\]()_]/, '').strip
      # Get first non-empty paragraph
      paragraphs = excerpt.split(/\n\s*\n/).reject(&:empty?)
      excerpt = paragraphs.first || ""
      excerpt = excerpt[0, 200] + (excerpt.length > 200 ? "..." : "")
      
      # Parse date
      post_date = front_matter['date']
      if post_date.is_a?(String)
        begin
          parsed_date = Date.parse(post_date)
        rescue
          # Fallback to filename date
          parsed_date = Date.parse(file_date)
        end
      elsif post_date.respond_to?(:to_date)
        parsed_date = post_date.to_date
      else
        parsed_date = Date.parse(file_date)
      end
      
      # Handle categories - can be string or array
      categories = front_matter['categories']
      if categories.is_a?(Array)
        category = categories.first || 'uncategorized'
      else
        category = categories || 'uncategorized'
      end
      
      # Build search item
      search_item = {
        title: front_matter['title'].to_s.strip,
        url: "/#{category}/#{parsed_date.strftime('%Y/%m/%d')}/#{file_title_slug}/",
        category: category,
        date: parsed_date.strftime('%Y-%m-%d'),
        excerpt: excerpt,
        content: content_body.gsub(/[#*`\[\]()]/, '').strip,
        tags: front_matter['tags'] || []
      }
      
      search_data << search_item
    else
      puts "Warning: No front matter found in #{file_path}"
    end
  rescue => e
    puts "Error processing #{file_path}: #{e.message}"
    next
  end
end

# Sort by date (newest first)
search_data.sort! { |a, b| Date.parse(b[:date].to_s) <=> Date.parse(a[:date].to_s) }

# Write to JSON file
output_file = File.join(File.dirname(__FILE__), '..', 'assets', 'js', 'search-data.json')
File.write(output_file, JSON.pretty_generate(search_data))

puts "Generated search data with #{search_data.length} posts"
puts "Output: #{output_file}"

# Display sample of processed posts
if search_data.length > 0
  puts "\nSample posts:"
  search_data.first(3).each do |post|
    puts "- #{post[:title]} (#{post[:category]}, #{post[:date]})"
  end
end