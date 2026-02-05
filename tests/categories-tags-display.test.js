/**
 * Categories and Tags Display Tests
 * Tests for the category and tag display functionality
 */

describe('Categories and Tags Display', () => {
  const fs = require('fs');
  const path = require('path');

  describe('Homepage Categories and Tags', () => {
    test('should use post-preview component in homepage', () => {
      const indexPath = path.join(__dirname, '..', 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
      
      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('{% include post-preview.html post=post %}');
    });

    test('should include post metadata web component in post-preview', () => {
      const postPreviewPath = path.join(__dirname, '..', '_includes', 'post-preview.html');
      expect(fs.existsSync(postPreviewPath)).toBe(true);
      
      const content = fs.readFileSync(postPreviewPath, 'utf8');
      expect(content).toContain('<post-metadata');
      expect(content).toContain("categories='{{ include.post.categories | jsonify }}'");
      expect(content).toContain("tags='{{ include.post.tags | jsonify }}'");
    });

    test('should have web component script loaded', () => {
      const layoutPath = path.join(__dirname, '..', '_layouts', 'default.html');
      const content = fs.readFileSync(layoutPath, 'utf8');
      
      expect(content).toContain('post-metadata.js');
    });

    test('should use web component for category and tag display', () => {
      const postPreviewPath = path.join(__dirname, '..', '_includes', 'post-preview.html');
      const content = fs.readFileSync(postPreviewPath, 'utf8');
      
      // Web component should be present in post-preview
      expect(content).toContain('<post-metadata');
      expect(content).toContain("categories='{{ include.post.categories | jsonify }}'");
      expect(content).toContain("tags='{{ include.post.tags | jsonify }}'");
      
      // Web component will generate category links when rendered
      const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
      const componentCode = fs.readFileSync(componentPath, 'utf8');
      expect(componentCode).toContain('category-tag');
      expect(componentCode).toContain('/category/');
    });
  });

  describe('All Posts Page Categories and Tags', () => {
    test('should include tags in posts data', () => {
      const blogPath = path.join(__dirname, '..', 'blog.html');
      expect(fs.existsSync(blogPath)).toBe(true);
      
      const content = fs.readFileSync(blogPath, 'utf8');
      expect(content).toContain('"tags"');
      expect(content).toContain('post.tags');
    });

    test('should include reading time calculation', () => {
      const blogPath = path.join(__dirname, '..', 'blog.html');
      const content = fs.readFileSync(blogPath, 'utf8');
      
      expect(content).toContain('"readingTime"');
      expect(content).toContain('number_of_words');
      expect(content).toContain('divided_by: 200');
    });

    test('should have blog pagination JavaScript with web component support', () => {
      const blogJsPath = path.join(__dirname, '..', 'assets', 'js', 'blog-pagination.js');
      expect(fs.existsSync(blogJsPath)).toBe(true);
      
      const content = fs.readFileSync(blogJsPath, 'utf8');
      expect(content).toContain('post.categories');
      expect(content).toContain('post.tags');
      expect(content).toContain("createElement('post-metadata')");
      expect(content).toContain("setAttribute('categories'");
      expect(content).toContain("setAttribute('tags'");
      expect(content).toContain("setAttribute('layout', 'badge')");
      expect(content).toContain('post.readingTime');
    });
  });

  describe('CSS Styling', () => {
    test('should have CSS styles for categories and tags', () => {
      // CSS is now split - check common.css for base styles
      const cssPath = path.join(__dirname, '..', 'assets', 'css', 'common.css');
      expect(fs.existsSync(cssPath)).toBe(true);
      
      // Check that post-metadata component has inline styles
      const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      expect(componentContent).toContain('.post-metadata');
      expect(componentContent).toContain('.post-categories');
      expect(componentContent).toContain('.post-tags');
      expect(componentContent).toContain('.category-tag');
      expect(componentContent).toContain('.post-tag');
    });

    test('should have responsive styles for metadata', () => {
      // Check post-metadata component for responsive styles
      const componentPath = path.join(__dirname, '..', 'assets', 'js', 'post-metadata.js');
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // Check for responsive design in inline styles
      expect(content).toContain('@media');
      // Check for category and tag hover effects
      expect(content).toContain('.category-tag:hover');
    });
  });

  describe('Post Front Matter', () => {
    test('should have posts with tags', () => {
      const postsDir = path.join(__dirname, '..', '_posts');
      const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      expect(postFiles.length).toBeGreaterThan(0);
      
      // Check at least one post has tags
      let hasTagsPost = false;
      postFiles.forEach(file => {
        const postPath = path.join(postsDir, file);
        const content = fs.readFileSync(postPath, 'utf8');
        if (content.includes('tags:')) {
          hasTagsPost = true;
        }
      });
      
      expect(hasTagsPost).toBe(true);
    });

    test('should have posts with categories', () => {
      const postsDir = path.join(__dirname, '..', '_posts');
      const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      // Check all posts have categories
      postFiles.forEach(file => {
        const postPath = path.join(postsDir, file);
        const content = fs.readFileSync(postPath, 'utf8');
        expect(content).toContain('categories:');
      });
    });
  });

  describe('Generated Site', () => {
    test('should generate homepage with post-metadata components in built site', () => {
      const builtIndexPath = path.join(__dirname, '..', '_site', 'index.html');
      
      if (fs.existsSync(builtIndexPath)) {
        const content = fs.readFileSync(builtIndexPath, 'utf8');
        expect(content).toContain('<post-metadata');
        expect(content).toContain('categories=');
        expect(content).toContain('tags=');
        expect(content).toContain('post-metadata.js');
      }
    });

    test('should generate blog page with post-metadata integration in built site', () => {
      const builtBlogPath = path.join(__dirname, '..', '_site', 'blog', 'index.html');
      
      if (fs.existsSync(builtBlogPath)) {
        const content = fs.readFileSync(builtBlogPath, 'utf8');
        expect(content).toContain('"tags"');
        expect(content).toContain('window.__posts');
      }
    });
  });
});