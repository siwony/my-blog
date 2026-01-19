/**
 * Heading Anchor Links
 * - Adds anchor link icons to headings (h2-h5)
 * - Click to copy permalink to clipboard
 * - Auto-scroll to heading when URL has hash
 */
(function() {
  'use strict';
  
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;
  
  // h2-h5만 대상 (h1은 포스트 제목)
  const headings = postContent.querySelectorAll('h2, h3, h4, h5');
  const headerOffset = 80;
  
  headings.forEach((heading, index) => {
    // Generate ID if not present
    if (!heading.id) {
      const text = heading.textContent.trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s가-힣-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      
      heading.id = slug || 'heading-' + index;
    }
    
    // Create anchor link
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor-link';
    anchor.href = '#' + heading.id;
    anchor.setAttribute('aria-label', '이 섹션 링크 복사');
    anchor.innerHTML = `
      <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-.025 5.45a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25z"/>
      </svg>
    `;
    
    anchor.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = window.location.origin + window.location.pathname + '#' + heading.id;
      
      try {
        await navigator.clipboard.writeText(url);
        showCopyToast('링크가 복사되었습니다');
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyToast('링크가 복사되었습니다');
      }
      
      history.pushState(null, '', '#' + heading.id);
    });
    
    heading.insertBefore(anchor, heading.firstChild);
  });
  
  function showCopyToast(message) {
    const existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  function scrollToHash() {
    const hash = window.location.hash;
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        setTimeout(() => {
          const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    }
  }
  
  scrollToHash();
  window.addEventListener('hashchange', scrollToHash);
})();
