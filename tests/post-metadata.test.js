/**
 * Tests for PostMetadata web component
 */

const fs = require('fs');
const path = require('path');

describe('PostMetadata Web Component', () => {
  let componentCode;
  
  beforeAll(() => {
    // Load the web component code
    const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
    componentCode = fs.readFileSync(componentPath, 'utf8');
  });

  describe('Component Structure', () => {
    test('should define PostMetadata class', () => {
      expect(componentCode).toContain('class PostMetadata extends HTMLElement');
    });

    test('should register custom element', () => {
      expect(componentCode).toContain("customElements.define('post-metadata', PostMetadata)");
    });

    test('should have observed attributes', () => {
      expect(componentCode).toContain("static get observedAttributes()");
      expect(componentCode).toContain("'categories'");
      expect(componentCode).toContain("'tags'");
      expect(componentCode).toContain("'show-labels'");
      expect(componentCode).toContain("'compact'");
      expect(componentCode).toContain("'layout'");
      expect(componentCode).toContain("'reading-time'");
      expect(componentCode).toContain("'date'");
    });
  });

  describe('Component Methods', () => {
    test('should have render method', () => {
      expect(componentCode).toContain('render()');
    });

    test('should have capitalizeFirst helper method', () => {
      expect(componentCode).toContain('capitalizeFirst(str)');
    });

    test('should have getter methods for attributes', () => {
      expect(componentCode).toContain('get categories()');
      expect(componentCode).toContain('get tags()');
      expect(componentCode).toContain('get showLabels()');
      expect(componentCode).toContain('get compact()');
      expect(componentCode).toContain('get layout()');
      expect(componentCode).toContain('get readingTime()');
      expect(componentCode).toContain('get date()');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON in categories', () => {
      expect(componentCode).toContain('JSON.parse(categoriesAttr)');
      expect(componentCode).toContain('console.warn');
      expect(componentCode).toContain('Invalid categories JSON');
    });

    test('should handle invalid JSON in tags', () => {
      expect(componentCode).toContain('JSON.parse(tagsAttr)');
      expect(componentCode).toContain('Invalid tags JSON');
    });
  });

  describe('HTML Generation', () => {
    test('should generate category links with proper href', () => {
      expect(componentCode).toContain('href="/category/');
      expect(componentCode).toContain('class="category-tag"');
    });

    test('should generate tag spans with # prefix', () => {
      expect(componentCode).toContain('class="post-tag"');
      expect(componentCode).toContain('#${tag}');
    });

    test('should handle empty categories and tags', () => {
      expect(componentCode).toContain("this.innerHTML = '';");
      expect(componentCode).toContain('!categories.length && !tags.length');
    });

    test('should support badge layout', () => {
      expect(componentCode).toContain('renderBadgeLayout');
      expect(componentCode).toContain('category-badge');
      expect(componentCode).toContain('post-meta-inline');
    });

    test('should support inline layout', () => {
      expect(componentCode).toContain('renderInlineLayout');
      expect(componentCode).toContain('post-metadata-inline');
    });

    test('should include reading time and date in badge layout', () => {
      expect(componentCode).toContain('reading-time');
      expect(componentCode).toContain('min read');
    });
  });
});

describe('PostMetadata Integration', () => {
  describe('Default Layout Integration', () => {
    test('should be loaded in default layout', () => {
      const layoutPath = path.join(__dirname, '..', '_layouts', 'default.html');
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      expect(layoutContent).toContain('post-metadata.js');
    });
  });

  describe('Homepage Integration', () => {
    test('should use post-metadata component in homepage', () => {
      const homepagePath = path.join(__dirname, '..', 'index.html');
      const homepageContent = fs.readFileSync(homepagePath, 'utf8');
      
      expect(homepageContent).toContain('<post-metadata');
      expect(homepageContent).toContain("categories='{{ post.categories | jsonify }}'");
      expect(homepageContent).toContain("tags='{{ post.tags | jsonify }}'");
    });
  });

  describe('Blog Pagination Integration', () => {
    test('should create post-metadata elements in JavaScript', () => {
      const jsPath = path.join(__dirname, '..', 'assets', 'js', 'blog-pagination.js');
      const jsContent = fs.readFileSync(jsPath, 'utf8');
      
      expect(jsContent).toContain("createElement('post-metadata')");
      expect(jsContent).toContain("setAttribute('categories'");
      expect(jsContent).toContain("setAttribute('tags'");
      expect(jsContent).toContain("JSON.stringify(post.categories)");
      expect(jsContent).toContain("JSON.stringify(post.tags)");
    });
  });
});

describe('PostMetadata CSS Compatibility', () => {
  test('should maintain existing CSS classes', () => {
    const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check that the component uses the same CSS classes
    expect(cssContent).toContain('.post-metadata');
    expect(cssContent).toContain('.post-categories');
    expect(cssContent).toContain('.post-tags');
    expect(cssContent).toContain('.category-tag');
    expect(cssContent).toContain('.post-tag');
    expect(cssContent).toContain('.metadata-label');
  });

  test('should support compact mode styling', () => {
    const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
    const componentCode = fs.readFileSync(componentPath, 'utf8');
    
    expect(componentCode).toContain('post-metadata${compact ? \' compact\' : \'\'}');
  });
});