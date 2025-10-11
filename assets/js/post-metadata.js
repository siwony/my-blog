/**
 * PostMetadata Web Component
 * Displays post categories and tags in a consistent format
 * 
 * Attributes:
 * - categories: JSON array of categories
 * - tags: JSON array of tags
 * - show-labels: boolean to show/hide labels (default: true)
 * - compact: boolean for compact display (default: false)
 * - layout: string layout style ('default', 'badge', 'inline') (default: 'default')
 * - reading-time: string estimated reading time
 * - date: string post date
 */
class PostMetadata extends HTMLElement {
  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  static get observedAttributes() {
    return ['categories', 'tags', 'show-labels', 'compact', 'layout', 'reading-time', 'date'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get categories() {
    try {
      const categoriesAttr = this.getAttribute('categories');
      return categoriesAttr ? JSON.parse(categoriesAttr) : [];
    } catch (e) {
      console.warn('PostMetadata: Invalid categories JSON', e);
      return [];
    }
  }

  get tags() {
    try {
      const tagsAttr = this.getAttribute('tags');
      return tagsAttr ? JSON.parse(tagsAttr) : [];
    } catch (e) {
      console.warn('PostMetadata: Invalid tags JSON', e);
      return [];
    }
  }

  get showLabels() {
    return this.getAttribute('show-labels') !== 'false';
  }

  get compact() {
    return this.getAttribute('compact') === 'true';
  }

  get layout() {
    return this.getAttribute('layout') || 'default';
  }

  get readingTime() {
    return this.getAttribute('reading-time');
  }

  get date() {
    return this.getAttribute('date');
  }

  render() {
    const categories = this.categories;
    const tags = this.tags;
    const showLabels = this.showLabels;
    const compact = this.compact;
    const layout = this.layout;
    const readingTime = this.readingTime;
    const date = this.date;

    if (!categories.length && !tags.length && !readingTime && !date) {
      this.innerHTML = '';
      return;
    }

    // Badge layout for enhanced post preview
    if (layout === 'badge') {
      this.innerHTML = this.renderBadgeLayout(categories, tags, readingTime, date, compact);
      return;
    }

    // Inline layout for compact display
    if (layout === 'inline') {
      this.innerHTML = this.renderInlineLayout(categories, tags, readingTime, date, compact);
      return;
    }

    // Default layout (existing behavior)
    this.innerHTML = this.renderDefaultLayout(categories, tags, showLabels, compact);
  }

  renderDefaultLayout(categories, tags, showLabels, compact) {
    if (!categories.length && !tags.length) {
      return '';
    }

    let html = `<div class="post-metadata${compact ? ' compact' : ''}">`;

    // Render categories
    if (categories.length > 0) {
      html += '<div class="post-categories">';
      
      categories.forEach((category, index) => {
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        html += `<a href="/category/${categorySlug}" class="category-tag">${this.capitalizeFirst(category)}</a>`;
        if (index < categories.length - 1) {
          html += compact ? ' ' : ', ';
        }
      });
      
      html += '</div>';
    }

    // Render tags with # prefix
    if (tags.length > 0) {
      html += '<div class="post-tags">';
      
      tags.forEach((tag, index) => {
        html += `<span class="post-tag">#${tag}</span>`;
        if (index < tags.length - 1) {
          html += compact ? ' ' : ', ';
        }
      });
      
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  renderBadgeLayout(categories, tags, readingTime, date, compact) {
    let html = '<div class="post-metadata-enhanced">';
    
    // Category badge (only first category for cleaner look)
    if (categories.length > 0) {
      const category = categories[0];
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      html += `<span class="category-badge" data-category="${categorySlug}">
        <a href="/category/${categorySlug}">${this.capitalizeFirst(category)}</a>
      </span>`;
    }
    
    // Inline metadata
    const metaParts = [];
    if (date) metaParts.push(`<span class="post-date">${date}</span>`);
    if (readingTime) metaParts.push(`<span class="reading-time">${readingTime} min read</span>`);
    
    if (metaParts.length > 0) {
      html += `<div class="post-meta-inline">${metaParts.join('<span class="meta-separator"> · </span>')}</div>`;
    }
    
    // Tags
    if (tags.length > 0) {
      html += '<div class="post-tags-inline">';
      tags.forEach((tag, index) => {
        html += `<span class="post-tag-inline">#${tag}</span>`;
        if (index < tags.length - 1) {
          html += ' ';
        }
      });
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  renderInlineLayout(categories, tags, readingTime, date, compact) {
    const parts = [];
    
    if (date) parts.push(date);
    if (readingTime) parts.push(`${readingTime} min read`);
    if (categories.length > 0) {
      const categoryLinks = categories.map(category => {
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/category/${categorySlug}" class="category-link-inline">${this.capitalizeFirst(category)}</a>`;
      });
      parts.push(categoryLinks.join(', '));
    }
    if (tags.length > 0) {
      const tagStrings = tags.map(tag => `#${tag}`);
      parts.push(tagStrings.join(' '));
    }
    
    return `<div class="post-metadata-inline">${parts.join(' · ')}</div>`;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Register the custom element
customElements.define('post-metadata', PostMetadata);