/**
 * Table of Contents with Scrollspy
 * Generates TOC from h1-h5 headings and highlights active section
 */
(function() {
  'use strict';
  
  const tocList = document.getElementById('toc-list');
  const tocSidebar = document.getElementById('toc-sidebar');
  
  if (!tocList || !tocSidebar) return;
  
  // Get all h1-h5 headings from post content
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;
  
  const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5');
  
  // Hide TOC if less than 2 headings
  if (headings.length < 2) {
    tocSidebar.style.display = 'none';
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
    // Remove # prefix from text content if present (from CSS ::before)
    a.textContent = heading.textContent.replace(/^#+ /, '');
    a.dataset.headingId = heading.id;
    
    // Add class for heading level indentation
    const level = heading.tagName.charAt(1); // H1 -> 1, H2 -> 2, etc.
    if (level >= 2) {
      a.classList.add('toc-h' + level);
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
