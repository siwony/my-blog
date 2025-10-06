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
    const h2 = document.createElement('h2');
    const a = document.createElement('a');
    a.href = post.url;
    a.textContent = post.title;
    h2.appendChild(a);

    const meta = document.createElement('p');
    meta.className = 'post-meta';
    meta.textContent = post.date;
    if (post.categories && post.categories.length) {
      meta.textContent += ' • ' + post.categories.join(', ');
    }

    const excerpt = document.createElement('p');
    excerpt.innerHTML = post.excerpt;

    const read = document.createElement('a');
    read.href = post.url;
    read.textContent = 'Read more →';

    article.appendChild(h2);
    article.appendChild(meta);
    article.appendChild(excerpt);
    article.appendChild(read);
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

  const windowSize = 5;

  function buildHash(page, psize) {
    const parts = [];
    if (page) parts.push('p=' + page);
    if (psize) parts.push('psize=' + psize);
    return '#' + parts.join('&');
  }

  function renderPage(page) {
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
    window.scrollTo({ top: 0 });
  }

  function createBtn(label, page, disabled) {
    const a = document.createElement('a');
    a.className = 'page-link' + (disabled ? ' disabled' : '');
    a.href = 'javascript:void(0)';
    a.textContent = label;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (disabled) return;
      renderPage(page);
    });
    return a;
  }

  function renderControls(current, totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    pagination.appendChild(createBtn('First', 1, current === 1));
    pagination.appendChild(createBtn('«', Math.max(1, current - 1), current === 1));

    let half = Math.floor(windowSize / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

    for (let p = start; p <= end; p++) {
      const btn = createBtn(String(p), p, false);
      if (p === current) btn.classList.add('current');
      pagination.appendChild(btn);
    }

    pagination.appendChild(createBtn('»', Math.min(totalPages, current + 1), current === totalPages));
    pagination.appendChild(createBtn('Last', totalPages, current === totalPages));
  }

  pageSizeSelect.addEventListener('change', function () {
    const newSize = parseInt(this.value, 10) || 10;
    pageSize = newSize;
    localStorage.setItem('blog_page_size', String(pageSize));
    renderPage(1);
  });

  const initialPage = hashParams.p ? parseInt(hashParams.p, 10) : 1;
  renderPage(initialPage || 1);

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
});
