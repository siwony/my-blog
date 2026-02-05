document.addEventListener('DOMContentLoaded', function () {
  const postsData = window.__posts || [];
  const postsList = document.getElementById('posts-list');
  const noPosts = document.getElementById('no-posts');
  const pagination = document.getElementById('pagination');
  const pageSizeSelect = document.getElementById('page-size-select');

  function parseHash() {
    const hash = (location.hash || '').replace(/^#/, '');
    const parts = hash.split('&').filter(Boolean);
    const params = {};
    parts.forEach(p => {
      const [k, v] = p.split('=');
      if (k) params[k] = v;
    });
    return params;
  }

  function renderPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-preview';
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = post.url;
    a.textContent = post.title;
    h3.appendChild(a);

    // Create metadata web component for categories and tags
    const metadataComponent = document.createElement('post-metadata');
    metadataComponent.setAttribute('layout', 'badge');
    if (post.categories && post.categories.length) {
      metadataComponent.setAttribute('categories', JSON.stringify(post.categories));
    }
    if (post.tags && post.tags.length) {
      metadataComponent.setAttribute('tags', JSON.stringify(post.tags));
    }
    metadataComponent.setAttribute('date', post.date);
    metadataComponent.setAttribute('reading-time', post.readingTime || '5');

    const excerpt = document.createElement('p');
    excerpt.innerHTML = post.excerpt;

    article.appendChild(h3);
    article.appendChild(metadataComponent);
    article.appendChild(excerpt);
    return article;
  }

  // initial pageSize: hash > localStorage > default 10
  const saved = parseInt(localStorage.getItem('blog_page_size') || '', 10);
  const hashParams = parseHash();
  let pageSize = hashParams.psize ? parseInt(hashParams.psize, 10) : (isNaN(saved) ? 10 : saved);
  if (!pageSize || pageSize <= 0) pageSize = 10;
  pageSizeSelect.value = String(pageSize);

  if (!postsData.length) {
    postsList.style.display = 'none';
    noPosts.style.display = 'block';
    pagination.style.display = 'none';
    pageSizeSelect.style.display = 'none';
    return;
  }

  function buildHash(page, psize) {
    const parts = [];
    if (page) parts.push('p=' + page);
    if (psize) parts.push('psize=' + psize);
    return '#' + parts.join('&');
  }

  function renderPage(page, skipScroll) {
    const totalPages = Math.max(1, Math.ceil(postsData.length / pageSize));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    postsList.innerHTML = '';
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, postsData.length);
    for (let i = start; i < end; i++) {
      postsList.appendChild(renderPostCard(postsData[i]));
    }

    renderControls(page, totalPages);
    history.replaceState(null, '', buildHash(page, pageSize));
    if (!skipScroll) {
      window.scrollTo({ top: 0 });
    }
  }

  function createBtn(label, page, disabled, isNavBtn = false) {
    const a = document.createElement('a');
    a.className = 'page-link' + (disabled ? ' disabled' : '') + (isNavBtn ? ' nav-btn' : '');
    a.href = 'javascript:void(0)';
    a.textContent = label;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (disabled) return;
      renderPage(page);
    });
    return a;
  }

  // 화면 크기에 따라 표시할 페이지 수 결정
  function getWindowSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return 3;      // 모바일: 3개
    if (screenWidth < 768) return 5;      // 태블릿: 5개
    if (screenWidth < 1024) return 7;     // 중간 화면: 7개
    return 10;                            // 데스크톱: 10개
  }

  function renderControls(current, totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const windowSize = getWindowSize();
    let half = Math.floor(windowSize / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

    // First 버튼 - 시작 페이지가 범위에 포함되지 않을 때만 표시
    if (start > 1) {
      pagination.appendChild(createBtn('First', 1, false, true));
      // 구분을 위한 여백 추가
      const spacer = document.createElement('span');
      spacer.style.margin = '0 0.25rem';
      pagination.appendChild(spacer);
    }
    
    // Previous 버튼
    pagination.appendChild(createBtn('‹', Math.max(1, current - 1), current === 1, true));

    // 페이지 번호 버튼들
    for (let p = start; p <= end; p++) {
      const btn = createBtn(String(p), p, false);
      if (p === current) btn.classList.add('current');
      pagination.appendChild(btn);
    }

    // Next 버튼
    pagination.appendChild(createBtn('›', Math.min(totalPages, current + 1), current === totalPages, true));
    
    // Last 버튼 - 끝 페이지가 범위에 포함되지 않을 때만 표시
    if (end < totalPages) {
      // 구분을 위한 여백 추가
      const spacer = document.createElement('span');
      spacer.style.margin = '0 0.25rem';
      pagination.appendChild(spacer);
      pagination.appendChild(createBtn('Last', totalPages, false, true));
    }
  }

  pageSizeSelect.addEventListener('change', function () {
    const newSize = parseInt(this.value, 10) || 10;
    pageSize = newSize;
    localStorage.setItem('blog_page_size', String(pageSize));
    renderPage(1);
  });

  const initialPage = hashParams.p ? parseInt(hashParams.p, 10) : 1;
  renderPage(initialPage || 1, true); // skipScroll on initial load

  window.addEventListener('hashchange', function () {
    const params = parseHash();
    if (params.psize) {
      const psize = parseInt(params.psize, 10);
      if (!isNaN(psize) && psize > 0 && psize !== pageSize) {
        pageSize = psize;
        pageSizeSelect.value = String(pageSize);
        localStorage.setItem('blog_page_size', String(pageSize));
      }
    }
    const p = params.p ? parseInt(params.p, 10) : 1;
    renderPage(p);
  });

  // 윈도우 리사이즈 시 페이지네이션 업데이트
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const params = parseHash();
      const currentPage = params.p ? parseInt(params.p, 10) : 1;
      renderPage(currentPage, true); // skipScroll on resize
    }, 250);
  });
});
