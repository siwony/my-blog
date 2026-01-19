# frozen_string_literal: true

# Excerpt Filter Plugin
# 마크다운 문법을 제거하고 깔끔한 미리보기 텍스트를 생성하는 필터
#
# 사용법: {{ post.excerpt | clean_excerpt | truncatewords: 30 }}

module Jekyll
  module ExcerptFilter
    # 마크다운 문법을 제거하고 깔끔한 텍스트로 변환
    def clean_excerpt(input)
      return '' if input.nil? || input.empty?

      text = input.to_s

      # HTML 태그 제거
      text = text.gsub(/<[^>]*>/, '')

      # 코드 블록 제거 (```로 감싸진 부분)
      text = text.gsub(/```[\s\S]*?```/, '')
      
      # 인라인 코드 제거 (`으로 감싸진 부분)
      text = text.gsub(/`[^`]+`/, '')

      # 이미지 마크다운 제거 ![alt](url)
      text = text.gsub(/!\[[^\]]*\]\([^)]*\)/, '')

      # 링크 마크다운을 텍스트로 변환 [text](url) -> text
      text = text.gsub(/\[([^\]]*)\]\([^)]*\)/, '\1')

      # 참조 스타일 링크 제거 [text][ref]
      text = text.gsub(/\[([^\]]*)\]\[[^\]]*\]/, '\1')

      # 헤딩 마크다운 제거 (# ## ### 등)
      text = text.gsub(/^\#{1,6}\s+/, '')

      # Bold/Italic 마크다운을 텍스트로 변환
      # **bold** 또는 __bold__
      text = text.gsub(/\*\*([^*]+)\*\*/, '\1')
      text = text.gsub(/__([^_]+)__/, '\1')
      
      # *italic* 또는 _italic_
      text = text.gsub(/\*([^*]+)\*/, '\1')
      text = text.gsub(/_([^_]+)_/, '\1')

      # 취소선 ~~text~~
      text = text.gsub(/~~([^~]+)~~/, '\1')

      # 리스트 마커 제거 (-, *, +, 숫자.)
      text = text.gsub(/^\s*[-*+]\s+/, '')
      text = text.gsub(/^\s*\d+\.\s+/, '')

      # 인용문 마커 제거 (>)
      text = text.gsub(/^\s*>\s*/, '')

      # 수평선 제거 (---, ***, ___)
      text = text.gsub(/^[-*_]{3,}\s*$/, '')

      # HTML 엔티티 디코딩
      text = text.gsub(/&nbsp;/, ' ')
      text = text.gsub(/&amp;/, '&')
      text = text.gsub(/&lt;/, '<')
      text = text.gsub(/&gt;/, '>')
      text = text.gsub(/&quot;/, '"')

      # 연속된 공백/줄바꿈을 단일 공백으로
      text = text.gsub(/\s+/, ' ')

      # 앞뒤 공백 제거
      text.strip
    end
  end
end

Liquid::Template.register_filter(Jekyll::ExcerptFilter)
