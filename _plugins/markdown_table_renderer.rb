require 'kramdown'

module Jekyll
  class MarkdownTableRenderer < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        if post.data['layout'] && post.content.include?('|')
          post.content = convert_markdown_tables(post.content)
        end
      end
      
      site.pages.each do |page|
        if page.content.include?('|')
          page.content = convert_markdown_tables(page.content)
        end
      end
    end

    private

    def convert_markdown_tables(content)
      # Regex to match markdown tables
      table_regex = /^\s*\|(.+)\|\s*\n\s*\|[-:\s\|]+\|\s*\n((?:\s*\|.*\|\s*\n?)*)/m
      
      content.gsub(table_regex) do |match|
        render_github_table(match)
      end
    end

    def render_github_table(table_markdown)
      lines = table_markdown.strip.split("\n")
      return table_markdown if lines.length < 3

      begin
        # Parse header
        header_line = lines[0].strip
        headers = parse_row(header_line)
        
        # Parse alignment
        separator_line = lines[1].strip
        alignments = parse_alignments(separator_line)
        
        # Parse data rows
        data_rows = []
        lines[2..-1].each do |line|
          line = line.strip
          next if line.empty?
          data_rows << parse_row(line)
        end
        
        # Generate HTML
        generate_html_table(headers, alignments, data_rows)
        
      rescue => e
        Jekyll.logger.warn "MarkdownTable:", "Failed to parse table: #{e.message}"
        table_markdown
      end
    end

    def parse_row(row)
      # Remove leading/trailing pipes and split
      content = row.gsub(/^\s*\||\|\s*$/, '')
      content.split('|').map { |cell| cell.strip }
    end

    def parse_alignments(separator_row)
      cells = parse_row(separator_row)
      cells.map do |cell|
        if cell.start_with?(':') && cell.end_with?(':')
          'center'
        elsif cell.end_with?(':')
          'right'
        else
          'left'
        end
      end
    end

    def generate_html_table(headers, alignments, data_rows)
      html = []
      html << '<div class="table-wrapper">'
      html << '  <table class="markdown-table">'
      
      # Generate header
      html << '    <thead>'
      html << '      <tr>'
      headers.each_with_index do |header, index|
        align = alignments[index] || 'left'
        align_class = align != 'left' ? " text-#{align}" : ''
        processed_header = process_inline_markdown(header)
        html << "        <th class=\"#{align_class.strip}\">#{processed_header}</th>"
      end
      html << '      </tr>'
      html << '    </thead>'
      
      # Generate body
      html << '    <tbody>'
      data_rows.each do |row|
        html << '      <tr>'
        row.each_with_index do |cell, index|
          align = alignments[index] || 'left'
          align_class = align != 'left' ? " text-#{align}" : ''
          processed_cell = process_inline_markdown(cell)
          html << "        <td class=\"#{align_class.strip}\">#{processed_cell}</td>"
        end
        html << '      </tr>'
      end
      html << '    </tbody>'
      
      html << '  </table>'
      html << '</div>'
      
      html.join("\n")
    end

    def process_inline_markdown(content)
      return '' if content.nil? || content.empty?
      
      # Basic inline markdown processing
      content
        .gsub(/\*\*(.*?)\*\*/, '<strong>\1</strong>')  # Bold
        .gsub(/\*(.*?)\*/, '<em>\1</em>')              # Italic  
        .gsub(/`([^`]+)`/, '<code>\1</code>')          # Inline code
        .gsub(/\[([^\]]+)\]\(([^)]+)\)/, '<a href="\2">\1</a>') # Links
    end
  end
end