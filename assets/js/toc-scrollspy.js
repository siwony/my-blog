/**
 * Table of Contents with Scrollspy
 * Generates TOC from h2/h3 headings and highlights active section
 */
(function() {
  'use strict';
  
  const tocList = document.getElementById('toc-list');
  const tocSidebar = document.getElementById('toc-sidebar');
  
  if (!tocList || !tocSidebar) return;
  
  // Get all h2 and h3 headings from post content
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;
  
  const headings = postContent.querySelectorAll('h2, h3');
  
  // Hide TOC if less than 3 headings
  if (headings.length < 3) {
    tocSidebar.style.display = 'none';
    // Remove grid layout when no TOC
    const postWithToc = document.querySelector('.post-with-toc');
    if (postWithToc) {
      postWithToc.style.gridTemplateColumns = '1fr';
    }
    return;
  }
  
  // Generate IDs for headings if missing and build TOC
  const tocItems = [];
  
  headings.forEach((heading, index) => {
    // Generate ID if not present
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.dataset.headingId = heading.id;
    
    // Add class for h3 indentation
    if (heading.tagName === 'H3') {
      a.classList.add('toc-h3');
    }
    
    li.appendChild(a);
    tocList.appendChild(li);
    tocItems.push({ link: a, heading: heading });
  });
  
  // Scrollspy: highlight active section
  let activeLink = null;
  const headerOffset = 100; // Account for sticky header
  
  function updateActiveLink() {
    let currentActive = null;
    
    for (let i = tocItems.length - 1; i >= 0; i--) {
      const item = tocItems[i];
      const rect = item.heading.getBoundingClientRect();
      
      if (rect.top <= headerOffset + 20) {
        currentActive = item.link;
        break;
      }
    }
    
    if (activeLink !== currentActive) {
      if (activeLink) {
        activeLink.classList.remove('active');
      }
      if (currentActive) {
        currentActive.classList.add('active');
      }
      activeLink = currentActive;
    }
  }
  
  // Throttle scroll handler
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Initial check
  updateActiveLink();
  
  // Smooth scroll for TOC links
  tocList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
})();
