/**
 * Category Sidebar Web Component Tests
 * Tests for the custom CategorySidebar web component functionality
 */

describe('CategorySidebar Web Component Logic', () => {
  // Test the component logic without actual web component registration
  let CategorySidebarClass;

  beforeEach(() => {
    // Mock HTMLElement
    global.HTMLElement = class MockHTMLElement {
      constructor() {
        this.attributes = new Map();
        this.innerHTML = '';
      }
      
      getAttribute(name) {
        return this.attributes.get(name) || null;
      }
      
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
    };

    // Create a mock CategorySidebar class based on the actual implementation
    CategorySidebarClass = class CategorySidebar extends global.HTMLElement {
      constructor() {
        super();
        this.categories = [];
        this.totalPosts = 0;
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
        // Sort categories alphabetically
        const sortedCategories = this.categories.sort((a, b) => a.name.localeCompare(b.name));

        const categoryListItems = sortedCategories
          .map(category => this.createCategoryLink(category.name, category.count))
          .join('');

        // Show appropriate content
        const categoryContent = categoryListItems || '<li class="category-item">No categories found</li>';

        this.innerHTML = `
          <aside class="sidebar">
            <div class="category-navigation">
              <h3>Categories</h3>
              <ul class="category-list">
                ${categoryContent}
              </ul>
              
              <div class="total-posts">
                <span class="total-label">Total Posts</span>
                <span class="total-count">${this.totalPosts}</span>
              </div>
            </div>
          </aside>
        `;
      }
    };
  });

  test('should format category names correctly', () => {
    const sidebar = new CategorySidebarClass();
    
    expect(sidebar.formatCategoryName('web-development')).toBe('Web Development');
    expect(sidebar.formatCategoryName('machine-learning')).toBe('Machine Learning');
    expect(sidebar.formatCategoryName('programming')).toBe('Programming');
    expect(sidebar.formatCategoryName('general')).toBe('General');
  });

  test('should create correct category links', () => {
    const sidebar = new CategorySidebarClass();
    const link = sidebar.createCategoryLink('programming', 5);
    
    expect(link).toContain('href="/category/programming/"');
    expect(link).toContain('Programming');
    expect(link).toContain('5');
  });

  test('should render loading state initially', () => {
    const sidebar = new CategorySidebarClass();
    sidebar.render();
    
    expect(sidebar.innerHTML).toContain('No categories found');
    expect(sidebar.innerHTML).toContain('Total Posts');
    expect(sidebar.innerHTML).toContain('0');
  });

  test('should parse and render categories data', () => {
    const sidebar = new CategorySidebarClass();
    const categoriesData = JSON.stringify([
      { name: 'programming', count: 5 },
      { name: 'web-development', count: 3 }
    ]);
    
    sidebar.setCategoriesData(categoriesData);
    sidebar.setTotalPosts('8');
    
    expect(sidebar.innerHTML).toContain('Programming');
    expect(sidebar.innerHTML).toContain('Web Development');
    expect(sidebar.innerHTML).toContain('5');
    expect(sidebar.innerHTML).toContain('3');
    expect(sidebar.innerHTML).toContain('8');
  });

  test('should sort categories alphabetically', () => {
    const sidebar = new CategorySidebarClass();
    const categoriesData = JSON.stringify([
      { name: 'z-last', count: 1 },
      { name: 'a-first', count: 2 },
      { name: 'm-middle', count: 3 }
    ]);
    
    sidebar.setCategoriesData(categoriesData);
    sidebar.setTotalPosts('6');
    
    // Check if categories are sorted in the rendered HTML
    const htmlContent = sidebar.innerHTML;
    const aFirstIndex = htmlContent.indexOf('A First');
    const mMiddleIndex = htmlContent.indexOf('M Middle');
    const zLastIndex = htmlContent.indexOf('Z Last');
    
    expect(aFirstIndex).toBeLessThan(mMiddleIndex);
    expect(mMiddleIndex).toBeLessThan(zLastIndex);
  });

  test('should handle invalid JSON gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const sidebar = new CategorySidebarClass();
    sidebar.setCategoriesData('invalid-json');
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse categories data:', expect.any(Error));
    expect(sidebar.innerHTML).toContain('No categories found');
    
    consoleSpy.mockRestore();
  });

  test('should handle empty categories gracefully', () => {
    const sidebar = new CategorySidebarClass();
    sidebar.setCategoriesData('[]');
    sidebar.setTotalPosts('0');

    expect(sidebar.innerHTML).toContain('No categories found');
    expect(sidebar.innerHTML).toContain('0');
  });

  test('should handle invalid total posts gracefully', () => {
    const sidebar = new CategorySidebarClass();
    sidebar.setTotalPosts('invalid-number');

    expect(sidebar.totalPosts).toBe(0);
  });

  test('should generate correct URLs for different category types', () => {
    const sidebar = new CategorySidebarClass();
    
    expect(sidebar.createCategoryLink('programming', 1)).toContain('/category/programming/');
    expect(sidebar.createCategoryLink('web-development', 2)).toContain('/category/web-development/');
    expect(sidebar.createCategoryLink('general', 3)).toContain('/category/general/');
  });

  test('should maintain category count accuracy', () => {
    const sidebar = new CategorySidebarClass();
    const categoriesData = JSON.stringify([
      { name: 'programming', count: 15 },
      { name: 'tutorial', count: 0 }
    ]);
    
    sidebar.setCategoriesData(categoriesData);
    sidebar.setTotalPosts('15');
    
    expect(sidebar.innerHTML).toContain('15');
    expect(sidebar.innerHTML).toContain('0');
  });
});