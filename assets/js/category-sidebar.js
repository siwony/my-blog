class CategorySidebar extends HTMLElement {
  constructor() {
    super();
    this.categories = [];
    this.totalPosts = 0;
  }

  connectedCallback() {
    // Initial render with default values
    this.render();
    
    // Parse initial attributes if they exist
    const categoriesData = this.getAttribute('categories-data');
    const totalPostsData = this.getAttribute('total-posts');
    
    if (categoriesData) {
      this.setCategoriesData(categoriesData);
    }
    
    if (totalPostsData) {
      this.setTotalPosts(totalPostsData);
    }
  }

  static get observedAttributes() {
    return ['categories-data', 'total-posts'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'categories-data' && newValue) {
      this.setCategoriesData(newValue);
    }
    
    if (name === 'total-posts' && newValue) {
      this.setTotalPosts(newValue);
    }
  }

  setCategoriesData(data) {
    try {
      this.categories = JSON.parse(data);
      this.render();
    } catch (e) {
      console.error('Failed to parse categories data:', e);
      this.categories = [];
      this.render();
    }
  }

  setTotalPosts(data) {
    this.totalPosts = parseInt(data, 10) || 0;
    this.render();
  }

  formatCategoryName(name) {
    return name.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  createCategoryLink(categoryName, postCount) {
    const categoryUrl = `/category/${categoryName}/`;
    
    return `
      <li class="category-item">
        <a href="${categoryUrl}" class="category-link">
          <span class="category-name">${this.formatCategoryName(categoryName)}</span>
          <span class="category-count">${postCount}</span>
        </a>
      </li>
    `;
  }

  render() {
    const styles = `
      <style>
        .category-navigation {
          background: #f9f9f9;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .category-navigation h3 {
          margin: 0 0 0.8rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .category-item {
          margin-bottom: 0.5rem;
        }

        .category-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          text-decoration: none;
          color: #555;
          border-bottom: 1px solid #f0f0f0;
          transition: color 0.15s ease;
        }

        .category-link:hover {
          color: #333;
          text-decoration: underline;
        }

        .category-name {
          font-size: 0.875rem;
        }

        .category-count {
          color: #6c757d;
          font-size: 0.75rem;
          font-weight: 400;
        }

        .category-link:hover .category-count {
          color: #333;
        }

        .total-posts {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-top: 1px solid #ddd;
          margin-top: 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .total-label {
          font-weight: bold;
        }

        .total-count {
          color: #777;
        }

        @media (max-width: 768px) {
          .category-navigation {
            padding: 1rem;
          }
          
          .category-link {
            padding: 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .category-navigation {
            margin: 0 -1rem;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      </style>
    `;

    // Show loading state if no data yet
    if (this.categories.length === 0 && this.totalPosts === 0) {
      this.innerHTML = `
        ${styles}
        <div class="category-navigation">
          <h3>Categories</h3>
          <ul class="category-list">
            <li class="category-item">Loading...</li>
          </ul>
          
          <div class="total-posts">
            <span class="total-label">Total Posts</span>
            <span class="total-count">0</span>
          </div>
        </div>
      `;
      return;
    }

    // Sort categories alphabetically
    const sortedCategories = this.categories.sort((a, b) => a.name.localeCompare(b.name));

    const categoryListItems = sortedCategories
      .map(category => this.createCategoryLink(category.name, category.count))
      .join('');

    this.innerHTML = `
      ${styles}
      <div class="category-navigation">
        <h3>Categories</h3>
        <ul class="category-list">
          ${categoryListItems || '<li class="category-item">No categories found</li>'}
        </ul>
        
        <div class="total-posts">
          <span class="total-label">Total Posts</span>
          <span class="total-count">${this.totalPosts}</span>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('category-sidebar', CategorySidebar);