# frozen_string_literal: true

require 'nokogiri'
require 'uri'

# Auto-links bare URLs and removes unwanted autolinks from code blocks and emails.
module AutolinkScrub
  # Regex to match URLs (http, https, www) including Korean and other unicode characters
  URL_REGEX = %r{
    (?<!["\'>=/])                    # Not preceded by quotes, >, =, /
    (
      https?://                       # http:// or https://
      [^\s<>\[\]"']+                  # Everything except whitespace and certain delimiters
    |
      www\.                           # www.
      [^\s<>\[\]"']+                  # Everything except whitespace and certain delimiters
    )
  }x

  # Clean up trailing punctuation that shouldn't be part of URL
  def self.clean_url(url)
    # Remove trailing punctuation that's likely not part of the URL
    url.sub(/[).,;:!?\]]+$/, '')
  end

  Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
    next unless doc.output_ext == '.html'
    next if doc.output.to_s.strip.empty?

    # Use full HTML document parsing to preserve DOCTYPE, html, head tags
    html_doc = Nokogiri::HTML.parse(doc.output)

    # First, auto-link bare URLs in text nodes (excluding code blocks)
    html_doc.traverse do |node|
      next unless node.text?
      next if node.parent.name == 'a'      # Already inside a link
      next if node.parent.name == 'code'   # Inside inline code
      next if node.parent.name == 'pre'    # Inside code block
      next if node.ancestors.any? { |a| a.name == 'pre' || a.name == 'code' }

      text = node.content
      next unless text.match?(URL_REGEX)

      # Replace URLs with anchor tags
      new_html = text.gsub(URL_REGEX) do |url|
        cleaned_url = AutolinkScrub.clean_url(url)
        trailing = url[cleaned_url.length..]  # Get any trailing punctuation we removed
        href = cleaned_url.start_with?('www.') ? "https://#{cleaned_url}" : cleaned_url
        # URI encode the href for proper linking while keeping display text readable
        encoded_href = URI::DEFAULT_PARSER.escape(href, /[^-_.!~*'()a-zA-Z\d;\/?:@&=+$,\[\]%#]/)
        %(<a href="#{encoded_href}" target="_blank" rel="noopener noreferrer">#{cleaned_url}</a>#{trailing})
      end

      # Only replace if we actually made changes
      if new_html != text
        node.replace(Nokogiri::HTML::DocumentFragment.parse(new_html))
      end
    end

    # Remove links inside code blocks (in case Kramdown auto-linked them)
    html_doc.css('pre a, code a').each { |anchor| anchor.replace(anchor.text) }

    # Unwrap mailto links so emails remain plain text
    html_doc.css('a[href]').each do |anchor|
      href = anchor['href']
      next unless href&.downcase&.start_with?('mailto:')
      anchor.replace(anchor.text)
    end

    doc.output = html_doc.to_html
  end
end
