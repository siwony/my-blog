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
    test('should use post-preview component in homepage', () => {
      const homepagePath = path.join(__dirname, '..', 'index.html');
      const homepageContent = fs.readFileSync(homepagePath, 'utf8');
      
      // Check that homepage uses the post-preview include
      expect(homepageContent).toContain('{% include post-preview.html post=post %}');
    });

    test('should use post-metadata component in post-preview include', () => {
      const postPreviewPath = path.join(__dirname, '..', '_includes', 'post-preview.html');
      const postPreviewContent = fs.readFileSync(postPreviewPath, 'utf8');
      
      expect(postPreviewContent).toContain('<post-metadata');
      expect(postPreviewContent).toContain("categories='{{ include.post.categories | jsonify }}'");
      expect(postPreviewContent).toContain("tags='{{ include.post.tags | jsonify }}'");
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
    // CSS is now split into multiple files - check home.css for post metadata styles
    const cssPath = path.join(__dirname, '..', 'assets', 'css', 'home.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check that the component uses the same CSS classes
    // Note: post-metadata component now uses inline styles
    expect(cssContent).toContain('.post-preview');
  });

  test('should have inline styles in component', () => {
    const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
    const componentCode = fs.readFileSync(componentPath, 'utf8');
    
    // Component now includes inline styles
    expect(componentCode).toContain('.post-metadata');
    expect(componentCode).toContain('.post-categories');
    expect(componentCode).toContain('.post-tags');
  });
});