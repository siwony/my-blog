import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './editor/Editor';
import { Preview } from './preview/Preview';
import { saveFile } from './fs/fileSystem';
import './App.css';

function App() {
  const [content, setContent] = useState('# Welcome to Jekyll Markdown Editor\n\nStart typing your markdown here...\n\n## Features\n\n- Live preview\n- Syntax highlighting for code blocks\n- Support for lists, headings, and more\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```');
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S (Mac) or Ctrl+S (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const handleSave = async () => {
    const success = await saveFile(content);
    if (success) {
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = '✓ Document saved (placeholder)';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      console.log('Save triggered (placeholder)');
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Jekyll Markdown Editor</h1>
        <div className="app-controls">
          <button
            className="toggle-preview-btn"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? '📝 Hide Preview' : '👁️ Show Preview'}
          </button>
          <button className="save-btn" onClick={handleSave} title="Save (Cmd+S)">
            💾 Save
          </button>
        </div>
      </div>
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          <div className={`editor-section ${!showPreview ? 'full-width' : ''}`}>
            <Editor content={content} onChange={setContent} />
          </div>
          {showPreview && (
            <div className="preview-section">
              <Preview content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
