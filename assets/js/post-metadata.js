/**
 * PostMetadata Web Component
 * Displays post categories and tags in a consistent format
 * 
 * Attributes:
 * - categories: JSON array of categories
 * - tags: JSON array of tags
 * - show-labels: boolean to show/hide labels (default: true)
 * - compact: boolean for compact display (default: false)
 */
class PostMetadata extends HTMLElement {
  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  static get observedAttributes() {
    return ['categories', 'tags', 'show-labels', 'compact'];
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

  render() {
    const categories = this.categories;
    const tags = this.tags;
    const showLabels = this.showLabels;
    const compact = this.compact;

    if (!categories.length && !tags.length) {
      this.innerHTML = '';
      return;
    }

    let html = `<div class="post-metadata${compact ? ' compact' : ''}">`;

    // Render categories
    if (categories.length > 0) {
      html += '<div class="post-categories">';
      if (showLabels) {
        html += '<span class="metadata-label">Category:</span>';
      }
      
      categories.forEach((category, index) => {
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        html += `<a href="/category/${categorySlug}" class="category-tag">${this.capitalizeFirst(category)}</a>`;
        if (index < categories.length - 1) {
          html += compact ? ' ' : ', ';
        }
      });
      
      html += '</div>';
    }

    // Render tags
    if (tags.length > 0) {
      html += '<div class="post-tags">';
      if (showLabels) {
        html += '<span class="metadata-label">Tags:</span>';
      }
      
      tags.forEach((tag, index) => {
        html += `<span class="post-tag">${tag}</span>`;
        if (index < tags.length - 1) {
          html += compact ? ' ' : ', ';
        }
      });
      
      html += '</div>';
    }

    html += '</div>';
    this.innerHTML = html;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Register the custom element
customElements.define('post-metadata', PostMetadata);