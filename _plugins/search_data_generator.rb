# frozen_string_literal: true

require 'json'
require 'date'

module SearchDataGenerator
  class Generator < Jekyll::Generator
    priority :low

    def generate(site)
      Jekyll.logger.info "Search Data Generator:", "Generating search data..."
      
      search_data = []
      
      site.posts.docs.each do |post|
        begin
          # Extract content without front matter
          content = post.content.to_s
          
          # Clean content for excerpt
          excerpt = content.dup
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
          
          # Handle categories
          categories = post.data['categories']
          if categories.is_a?(Array)
            category = categories.first || 'uncategorized'
          else
            category = categories || 'uncategorized'
          end
          
          search_item = {
            title: post.data['title'].to_s.strip,
            url: post.url,
            category: category,
            date: post.date.strftime('%Y-%m-%d'),
            excerpt: excerpt,
            content: content.gsub(/[#*`\[\]()]/, '').strip,
            tags: post.data['tags'] || []
          }
          
          search_data << search_item
        rescue => e
          Jekyll.logger.warn "Search Data Generator:", "Error processing post #{post.path}: #{e.message}"
        end
      end
      
      # Sort by date (newest first)
      search_data.sort! { |a, b| Date.parse(b[:date]) <=> Date.parse(a[:date]) }
      
      Jekyll.logger.info "Search Data Generator:", "Generated search data with #{search_data.length} posts"
    end
  end

  # Hook to write file after site generation
  Jekyll::Hooks.register :site, :post_write do |site|
    search_data = []
    
    site.posts.docs.each do |post|
      begin
        content = post.content.to_s
        
        excerpt = content.dup
        excerpt = excerpt.gsub(/^#+\s+.*$/, '')
        excerpt = excerpt.gsub(/```.*?```/m, '')
        excerpt = excerpt.gsub(/`[^`]+`/, '')
        excerpt = excerpt.gsub(/[#*`\[\]()_]/, '').strip
        paragraphs = excerpt.split(/\n\s*\n/).reject(&:empty?)
        excerpt = paragraphs.first || ""
        excerpt = excerpt[0, 200] + (excerpt.length > 200 ? "..." : "")
        
        categories = post.data['categories']
        if categories.is_a?(Array)
          category = categories.first || 'uncategorized'
        else
          category = categories || 'uncategorized'
        end
        
        search_item = {
          title: post.data['title'].to_s.strip,
          url: post.url,
          category: category,
          date: post.date.strftime('%Y-%m-%d'),
          excerpt: excerpt,
          content: content.gsub(/[#*`\[\]()]/, '').strip,
          tags: post.data['tags'] || []
        }
        
        search_data << search_item
      rescue => e
        Jekyll.logger.warn "Search Data Generator:", "Error processing post #{post.path}: #{e.message}"
      end
    end
    
    search_data.sort! { |a, b| Date.parse(b[:date]) <=> Date.parse(a[:date]) }
    
    # Write only to _site directory to avoid regeneration loops
    output_dir = File.join(site.dest, 'assets', 'js')
    FileUtils.mkdir_p(output_dir)
    output_file = File.join(output_dir, 'search-data.json')
    
    File.write(output_file, JSON.pretty_generate(search_data))
    Jekyll.logger.info "Search Data Generator:", "Output: #{output_file}"
  end
end