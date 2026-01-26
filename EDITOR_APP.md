# Jekyll Markdown Editor Application

This document describes the markdown editor application built for editing Jekyll blog posts.

## 📍 Location

The editor application is located in the `editor-app/` directory at the root of this repository.

## 🎯 Overview

A minimal desktop markdown editor built specifically for Jekyll repositories, featuring a split-view interface with live preview capabilities.

### Tech Stack

- **Electron 40.0.0** - Desktop application framework
- **Vite 7.2.4** - Build tool and development server  
- **React 19.2.0** - UI library with TypeScript
- **TypeScript 5.9.3** - Type-safe development
- **pnpm** - Fast, disk-efficient package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm (install globally with `npm install -g pnpm`)

### Installation & Running

```bash
# Navigate to the editor app
cd editor-app

# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## ✨ Current Features

### Implemented ✅

- **Split View Layout**: Editor on the left, live preview on the right
- **Live Markdown Preview**: Real-time rendering as you type
- **Markdown Support**:
  - Headings (H1-H6)
  - Lists (ordered and unordered)
  - Code blocks with fenced syntax
  - Blockquotes
  - GitHub Flavored Markdown (GFM)
- **Toggle Preview**: Show/hide preview pane with one click
- **Keyboard Shortcuts**: 
  - `Cmd+S` / `Ctrl+S`: Save (placeholder action with toast notification)
- **Sidebar**: File browser placeholder
- **Test Coverage**: 5 passing tests with Vitest

### Deferred for Future Development 🚧

The following features are planned but not implemented in this initial scaffold:

- **File System Integration**: Open, save, and browse Jekyll post files
- **Frontmatter Support**: Parse and edit Jekyll frontmatter metadata
- **Advanced Editor Features**:
  - Syntax highlighting in code blocks
  - Markdown formatting shortcuts
  - Search and replace
  - Multi-file/project support
- **Image Handling**: Preview and insert images
- **Export Options**: Export to HTML/PDF
- **Theming**: Dark/light mode toggle
- **Settings/Preferences**: User configuration

## 🏗️ Architecture

### Modular Structure

The codebase is organized into focused modules for future extensibility:

```
editor-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Sidebar.tsx   # File browser (placeholder)
│   ├── editor/           # Editor module
│   │   ├── Editor.tsx
│   │   └── Editor.css
│   ├── preview/          # Preview rendering module
│   │   ├── Preview.tsx
│   │   └── Preview.css
│   ├── fs/              # File system operations (placeholder)
│   │   └── fileSystem.ts
│   ├── frontmatter/     # Jekyll frontmatter utilities (placeholder)
│   │   └── frontmatter.ts
│   └── test/            # Test setup and utilities
│       └── setup.ts
├── electron/
│   └── main.ts          # Electron main process
└── package.json
```

### Key Design Decisions

1. **Electron over Tauri**: 
   - No Rust toolchain required
   - Broader platform compatibility
   - Faster initial setup
   - Can migrate to Tauri later if needed

2. **Minimal Dependencies**:
   - Only essential libraries included
   - `react-markdown` for rendering
   - `remark-gfm` for GitHub Flavored Markdown
   - No heavy UI frameworks

3. **Modular Architecture**:
   - Separate modules for editor, preview, fs, frontmatter
   - Easy to extend and maintain
   - Clear separation of concerns

## 🧪 Testing

The application includes a test suite using Vitest:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

Current test coverage includes:
- Application initialization
- Component rendering
- UI controls presence
- Basic interaction testing

## 📝 Development Notes

### Running in CI/Headless Environments

⚠️ **Important**: Electron requires a GUI/display server to run. In CI or headless environments:
- `pnpm install` - ✅ Works
- `pnpm test` - ✅ Works (uses jsdom)
- `pnpm build` - ✅ Works  
- `pnpm dev` - ❌ Requires display server

For CI testing, use:
```bash
pnpm install && pnpm test && pnpm build
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+S` / `Ctrl+S` | Save document (currently shows toast notification) |
| `Cmd+Q` / `Ctrl+Q` | Quit application (Electron default) |

## 🔮 Future Roadmap

### Phase 2 (File System Integration)
- Open Jekyll markdown files
- Save edited content
- Browse project directory structure
- Recent files list

### Phase 3 (Frontmatter Support)
- Parse Jekyll frontmatter
- Edit frontmatter fields in UI
- Validate frontmatter schema
- Auto-complete for categories/tags

### Phase 4 (Enhanced Editor)
- Syntax highlighting in code blocks
- Markdown formatting toolbar
- Image insertion and preview
- Table editor
- Search and replace

### Phase 5 (Publishing)
- Integration with Git
- Preview before commit
- Deployment hooks
- Multi-repository support

## 🤝 Contributing

When extending the editor:

1. **Follow the modular structure**: Add features to appropriate modules
2. **Write tests**: All new features should include tests
3. **Update documentation**: Keep README and comments current
4. **Minimize dependencies**: Only add necessary packages
5. **Maintain TypeScript types**: Full type coverage required

## 📄 License

MIT - This is part of the my-blog repository.

## 🔗 Related Documentation

- [`editor-app/README.md`](./editor-app/README.md) - Detailed editor documentation
- [`README.md`](./README.md) - Main repository README
- [`docs/`](./docs/) - Jekyll blog documentation

---

**Status**: Initial scaffold complete ✅  
**Last Updated**: 2026-01-22
