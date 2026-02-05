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

    // Inline styles for the component
    const styles = `
      <style>
        .post-metadata {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .post-categories,
        .post-tags {
          display: inline-block;
          margin-right: 1rem;
          margin-bottom: 0.5rem;
        }

        .category-tag {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          margin-right: 0.25rem;
          transition: background-color 0.2s ease;
        }

        .category-tag:hover {
          background-color: #1d4ed8;
          color: white;
          text-decoration: none;
        }

        .post-tag {
          display: inline-block;
          background-color: #64748b;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .post-metadata-enhanced {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .category-badge {
          display: inline-block;
          margin-bottom: 0.25rem;
        }

        .category-badge a {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }

        .category-badge a:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .post-meta-inline {
          display: flex;
          align-items: center;
          gap: 0;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .meta-separator {
          margin: 0 0.25rem;
          color: #64748b;
        }

        .post-date {
          color: #64748b;
        }

        .reading-time {
          color: #64748b;
        }

        .post-tags-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .post-tag-inline {
          display: inline-block;
          background: #64748b;
          color: white;
          padding: 2px 0.25rem;
          border-radius: 0.25rem;
          font-size: calc(0.75rem - 0.1rem);
          font-weight: 500;
        }

        .post-metadata-inline {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.25rem 0;
        }

        .category-link-inline {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .category-link-inline:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .post-metadata {
            font-size: calc(0.875rem - 0.05rem);
          }
          
          .post-categories,
          .post-tags {
            display: block;
            margin-right: 0;
          }
          
          .category-tag,
          .post-tag {
            font-size: calc(0.75rem - 0.05rem);
            padding: calc(0.25rem - 0.05rem) calc(0.5rem - 0.1rem);
          }

          .post-meta-inline {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .meta-separator {
            display: none;
          }
          
          .post-tags-inline {
            margin-top: 0.25rem;
          }

          .category-badge a {
            font-size: calc(0.75rem - 0.05rem);
            padding: calc(0.25rem - 0.05rem) calc(0.5rem - 0.1rem);
          }
        }
      </style>
    `;

    if (!categories.length && !tags.length && !readingTime && !date) {
      this.innerHTML = '';
      return;
    }

    // Badge layout for enhanced post preview
    if (layout === 'badge') {
      this.innerHTML = styles + this.renderBadgeLayout(categories, tags, readingTime, date, compact);
      return;
    }

    // Inline layout for compact display
    if (layout === 'inline') {
      this.innerHTML = styles + this.renderInlineLayout(categories, tags, readingTime, date, compact);
      return;
    }

    // Default layout (existing behavior)
    this.innerHTML = styles + this.renderDefaultLayout(categories, tags, showLabels, compact);
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