/**
 * Command Palette Implementation using Ninja Keys
 * Provides search functionality for blog posts with Cmd+K shortcut
 */

class CommandPalette {
  constructor() {
    this.searchData = [];
    this.ninja = null;
    this.init();
  }

  async init() {
    await this.loadSearchData();
    this.setupNinjaKeys();
    this.setupKeyboardShortcuts();
  }

  async loadSearchData() {
    try {
      const response = await fetch('/assets/js/search-data.json');
      this.searchData = await response.json();
      console.log('Search data loaded:', this.searchData.length, 'posts');
    } catch (error) {
      console.error('Failed to load search data:', error);
      this.searchData = [];
    }
  }

  setupNinjaKeys() {
    // Create ninja-keys element
    this.ninja = document.createElement('ninja-keys');
    
    // Configure ninja-keys
    this.ninja.placeholder = 'Search posts...';
    this.ninja.disableHotkeys = false;
    this.ninja.hideBreadcrumbs = true;
    
    // Set hotkeys
    this.ninja.hotKeys = 'cmd+k,ctrl+k';
    
    // Apply custom styles to ensure visibility
    this.ninja.style.setProperty('--ninja-z-index', '10000');
    this.ninja.style.setProperty('--ninja-backdrop-filter', 'blur(16px)');
    this.ninja.style.setProperty('--ninja-overflow', 'hidden');
    
    // Ensure proper text colors
    this.ninja.style.setProperty('--ninja-text-color', '#1f2937');
    this.ninja.style.setProperty('--ninja-secondary-text-color', '#6b7280');
    this.ninja.style.setProperty('--ninja-selected-text-color', '#ffffff');
    
    // Enhanced modal styling
    this.ninja.style.setProperty('--ninja-modal-background', 'rgba(255, 255, 255, 0.98)');
    this.ninja.style.setProperty('--ninja-modal-border', '1px solid rgba(0, 0, 0, 0.1)');
    
    // Append to body
    document.body.appendChild(this.ninja);
    
    this.updateNinjaData();
  }

  updateNinjaData() {
    if (!this.ninja) return;

    const ninjaActions = this.searchData.map(post => {
      // Create comprehensive keywords for better search
      const tags = Array.isArray(post.tags) ? post.tags.join(' ') : '';
      const keywords = [
        post.title,
        post.category,
        post.excerpt,
        tags,
        // Add Korean and English terms for better search
        this.generateSearchTerms(post.title),
        this.generateSearchTerms(post.excerpt)
      ].filter(Boolean).join(' ').toLowerCase();

      return {
        id: `post-${post.url}`,
        title: post.title,
        subtitle: `${post.category} • ${this.formatDate(post.date)}${tags ? ` • ${tags}` : ''}`,
        section: this.formatCategory(post.category),
        keywords: keywords,
        handler: () => {
          window.location.href = post.url;
        }
      };
    });

    // Add some default actions
    const defaultActions = [
      {
        id: 'home',
        title: 'Home',
        subtitle: 'Go to homepage',
        section: 'Navigation',
        keywords: 'home homepage main 홈 메인',
        handler: () => {
          window.location.href = '/';
        }
      },
      {
        id: 'blog',
        title: 'All Posts',
        subtitle: 'View all blog posts',
        section: 'Navigation', 
        keywords: 'blog posts all articles 블로그 포스트 글 전체',
        handler: () => {
          window.location.href = '/blog.html';
        }
      }
    ];

    this.ninja.data = [...defaultActions, ...ninjaActions];
  }

  generateSearchTerms(text) {
    if (!text) return '';
    
    // Extract meaningful terms from text
    const terms = text
      .replace(/[^\w\s가-힣]/g, ' ') // Remove special characters except Korean
      .split(/\s+/)
      .filter(term => term.length > 1) // Filter out single characters
      .slice(0, 10); // Limit to first 10 terms to avoid too long keywords
    
    return terms.join(' ');
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Handle Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      
      // Handle Escape key
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open() {
    if (this.ninja) {
      this.ninja.open();
    }
  }

  close() {
    if (this.ninja) {
      this.ninja.close();
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCategory(category) {
    const categoryMap = {
      'programming': '💻 Programming',
      'general': '📝 General',
      'test': '🧪 Test',
      'tutorial': '📚 Tutorial',
      'review': '⭐ Review',
      'thoughts': '💭 Thoughts',
      'database': '🗄️ Database',
      'devops': '⚙️ DevOps',
      'algorithm': '🧮 Algorithm',
      'java': '☕ Java',
      'javascript': '🟨 JavaScript',
      'python': '🐍 Python',
      'css': '🎨 CSS',
      'html': '🌐 HTML',
      'docker': '🐳 Docker',
      'aws': '☁️ AWS',
      'git': '📋 Git',
      'spring': '🍃 Spring',
      'mysql': '🐬 MySQL',
      'linux': '🐧 Linux',
      'network': '🌐 Network',
      'security': '🔒 Security',
      'react': '⚛️ React',
      'vue': '💚 Vue',
      'node': '🟢 Node.js'
    };
    
    return categoryMap[category] || `📂 ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  // Public API for external access
  refresh() {
    this.loadSearchData().then(() => {
      this.updateNinjaData();
    });
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
  });
} else {
  window.commandPalette = new CommandPalette();
}

// Add search hint to the page
function addSearchHint() {
  const hint = document.createElement('div');
  hint.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(10px);
      z-index: 1000;
      opacity: 0.7;
      transition: opacity 0.2s;
    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
      Press <kbd style="
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
      ">⌘ K</kbd> to search
    </div>
  `;
  
  document.body.appendChild(hint);
  
  // Hide hint after 5 seconds
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 200);
  }, 5000);
}

// Show hint on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addSearchHint);
} else {
  addSearchHint();
}
//# sourceMappingURL=command-palette.js.map
