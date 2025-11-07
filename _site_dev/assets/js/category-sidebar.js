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
    // Show loading state if no data yet
    if (this.categories.length === 0 && this.totalPosts === 0) {
      this.innerHTML = `
        <aside class="sidebar">
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
        </aside>
      `;
      return;
    }

    // Sort categories alphabetically
    const sortedCategories = this.categories.sort((a, b) => a.name.localeCompare(b.name));

    const categoryListItems = sortedCategories
      .map(category => this.createCategoryLink(category.name, category.count))
      .join('');

    this.innerHTML = `
      <aside class="sidebar">
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
      </aside>
    `;
  }
}

// Register the custom element
customElements.define('category-sidebar', CategorySidebar);
//# sourceMappingURL=category-sidebar.js.map
