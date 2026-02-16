/**
 * Basic tests for blog functionality
 */

describe('Blog Features', () => {
  describe('Search Data', () => {
    test('should have search data file', () => {
      const fs = require('fs');
      const path = require('path');
      
      const searchDataPath = path.join(__dirname, '..', 'assets', 'js', 'search-data.json');
      expect(fs.existsSync(searchDataPath)).toBe(true);
      
      const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf8'));
      expect(Array.isArray(searchData)).toBe(true);
      
      if (searchData.length > 0) {
        const firstItem = searchData[0];
        expect(firstItem).toHaveProperty('title');
        expect(firstItem).toHaveProperty('url');
        expect(firstItem).toHaveProperty('category');
        expect(firstItem).toHaveProperty('content');
      }
    });
  });

  describe('Category System', () => {
    test('should have category sync script', () => {
      const fs = require('fs');
      const path = require('path');
      
      const scriptPath = path.join(__dirname, '..', 'scripts', 'sync_categories.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      expect(content).toContain('sync');
    });

    test('should have category layout', () => {
      const fs = require('fs');
      const path = require('path');
      
      const layoutPath = path.join(__dirname, '..', '_layouts', 'category.html');
      expect(fs.existsSync(layoutPath)).toBe(true);
      
      const content = fs.readFileSync(layoutPath, 'utf8');
      expect(content).toContain('layout: default');
      expect(content).toContain('category-page');
    });

    test('should have category pages', () => {
      const fs = require('fs');
      const path = require('path');
      
      const categoryDir = path.join(__dirname, '..', 'category');
      expect(fs.existsSync(categoryDir)).toBe(true);
      
      const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.html'));
      expect(files.length).toBeGreaterThan(0);
      
      // Check first category file structure
      if (files.length > 0) {
        const firstFile = path.join(categoryDir, files[0]);
        const content = fs.readFileSync(firstFile, 'utf8');
        expect(content).toContain('layout: category');
        expect(content).toContain('category:');
        expect(content).toContain('permalink:');
      }
    });
  });

  describe('Command Palette', () => {
    test('should have command palette script', () => {
      const fs = require('fs');
      const path = require('path');
      
      const scriptPath = path.join(__dirname, '..', 'assets', 'js', 'command-palette.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      expect(content).toContain('CommandPalette');
      expect(content).toContain('ninja-keys');
    });

    test('should be integrated in default layout', () => {
      const fs = require('fs');
      const path = require('path');
      
      const layoutPath = path.join(__dirname, '..', '_layouts', 'default.html');
      expect(fs.existsSync(layoutPath)).toBe(true);
      
      const content = fs.readFileSync(layoutPath, 'utf8');
      expect(content).toContain('ninja-keys');
      expect(content).toContain('command-palette.min.js');
    });
  });

  describe('Homepage Layout', () => {
    test('should have sidebar layout', () => {
      const fs = require('fs');
      const path = require('path');
      
      const indexPath = path.join(__dirname, '..', 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
      
      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('home-layout');
      expect(content).toContain('sidebar');
      expect(content).toContain('category-sidebar');
    });

    test('should have proper CSS for layout', () => {
      const fs = require('fs');
      const path = require('path');
      
      // CSS is now split into multiple files
      const cssPath = path.join(__dirname, '..', 'assets', 'css', 'home.css');
      expect(fs.existsSync(cssPath)).toBe(true);
      
      const content = fs.readFileSync(cssPath, 'utf8');
      expect(content).toContain('.post-preview');
      
      // Check common.css for shared styles
      const commonCssPath = path.join(__dirname, '..', 'assets', 'css', 'common.css');
      expect(fs.existsSync(commonCssPath)).toBe(true);
    });
  });
});