# frozen_string_literal: true

require 'json'
require 'date'

module SearchDataGenerator
  # Build search data from site posts
  def self.build_search_data(site)
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

        search_data << {
          title: post.data['title'].to_s.strip,
          url: post.url,
          category: category,
          date: post.date.strftime('%Y-%m-%d'),
          excerpt: excerpt,
          content: content.gsub(/[#*`\[\]()]/, '').strip,
          tags: post.data['tags'] || []
        }
      rescue => e
        Jekyll.logger.warn "Search Data Generator:", "Error processing post #{post.path}: #{e.message}"
      end
    end

    search_data.sort! { |a, b| Date.parse(b[:date]) <=> Date.parse(a[:date]) }
    search_data
  end

  # Write search data JSON after site generation
  Jekyll::Hooks.register :site, :post_write do |site|
    search_data = SearchDataGenerator.build_search_data(site)

    output_dir = File.join(site.dest, 'assets', 'js')
    FileUtils.mkdir_p(output_dir)
    output_file = File.join(output_dir, 'search-data.json')

    File.write(output_file, JSON.generate(search_data))
    Jekyll.logger.info "Search Data Generator:", "#{search_data.length} posts → #{output_file}"
  end
end