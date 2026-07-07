# Jekyll Markdown Editor

A minimal, desktop-based markdown editor tailored for Jekyll repositories, built with Electron + Vite + React + TypeScript.

## Features

- 📝 **Split View Editor**: Write markdown on the left, see live preview on the right
- 👁️ **Toggle Preview**: Hide/show preview with a single click
- 🎨 **Live Markdown Rendering**: Real-time preview with support for:
  - Headings (H1-H6)
  - Lists (ordered and unordered)
  - Code blocks with syntax highlighting
  - Blockquotes
  - GitHub Flavored Markdown (GFM)
- ⌨️ **Keyboard Shortcuts**:
  - `Cmd+S` (Mac) / `Ctrl+S` (Windows/Linux): Save (placeholder action)
- 🎯 **Modular Architecture**: Organized codebase with separate modules for editor, preview, file system, and frontmatter

## Tech Stack

### Core Technologies
- **Electron 40.0.0** - Desktop application framework
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **React 19.2.0** - UI library with TypeScript support
- **TypeScript 5.9.3** - Type-safe JavaScript

### Key Dependencies
- **react-markdown** - Markdown rendering with React components
- **remark-gfm** - GitHub Flavored Markdown support
- **vitest** - Fast unit testing framework
- **@testing-library/react** - Testing utilities for React components

### Why Electron?
Electron was chosen over Tauri for this initial implementation because:
1. **Zero system dependencies** - No Rust toolchain required
2. **Simpler setup** - Faster to get up and running
3. **Broader compatibility** - Works reliably across all platforms
4. **Rich ecosystem** - Extensive plugins and community support

## Project Structure

```
editor-app/
├── src/
│   ├── components/       # UI components
│   │   └── Sidebar.tsx   # File browser sidebar (placeholder)
│   ├── editor/           # Editor module
│   │   ├── Editor.tsx
│   │   └── Editor.css
│   ├── preview/          # Preview module
│   │   ├── Preview.tsx
│   │   └── Preview.css
│   ├── fs/              # File system operations (placeholder)
│   │   └── fileSystem.ts
│   ├── frontmatter/     # Jekyll frontmatter parsing (placeholder)
│   │   └── frontmatter.ts
│   ├── test/            # Test configuration
│   │   └── setup.ts
│   ├── App.tsx          # Main application component
│   ├── App.css
│   ├── main.tsx         # React entry point
│   └── index.css
├── electron/
│   └── main.ts          # Electron main process
├── package.json
├── vite.config.ts       # Vite + Electron configuration
└── tsconfig.json
```

## Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **pnpm** (installed globally)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server with hot reload
pnpm dev
```

This will:
1. Start the Vite dev server
2. Launch the Electron app
3. Enable hot module replacement (HMR)
4. Open developer tools automatically

### Building

```bash
# Build for production
pnpm build
```

This will:
1. Compile TypeScript
2. Bundle the application with Vite
3. Create production-ready files in `dist/`

### Testing

```bash
# Run tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## Current Features

### ✅ Implemented
- [x] Electron + Vite + React + TypeScript setup
- [x] Split view layout (editor + preview)
- [x] Left sidebar (placeholder for file browser)
- [x] Live markdown editor with syntax highlighting
- [x] Real-time markdown preview
- [x] Support for headings, lists, code blocks
- [x] Toggle to hide/show preview
- [x] Keyboard shortcut: Cmd+S / Ctrl+S for save
- [x] Placeholder save action with toast notification
- [x] Test infrastructure with Vitest
- [x] Basic UI tests
- [x] Modular folder structure

### 🚧 Deferred (Future Work)
- [ ] File system integration (open, save, browse)
- [ ] Jekyll frontmatter parsing and editing
- [ ] Syntax highlighting in code blocks
- [ ] Multi-file project support
- [ ] Search and replace
- [ ] Markdown shortcuts (bold, italic, etc.)
- [ ] Image preview and insertion
- [ ] Export to HTML/PDF
- [ ] Dark/light theme toggle
- [ ] Configuration settings

## Development Notes

### Modular Architecture
The codebase is organized into focused modules:
- **`src/editor/`** - Editor component and logic
- **`src/preview/`** - Markdown preview rendering
- **`src/fs/`** - File system operations (placeholder)
- **`src/frontmatter/`** - Jekyll frontmatter utilities (placeholder)

This structure makes it easy to extend functionality in the future.

### Minimal Dependencies
We've kept dependencies minimal to reduce bloat:
- Core: React, React DOM
- Markdown: react-markdown, remark-gfm
- Testing: Vitest, @testing-library/react
- Build: Vite, Electron

No unnecessary UI frameworks or large libraries.

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+S` / `Ctrl+S` | Save document (placeholder) |
| `Cmd+Q` / `Ctrl+Q` | Quit application |

## Contributing

This is a minimal scaffold. Future enhancements should:
1. Follow the modular structure
2. Add tests for new features
3. Keep dependencies minimal
4. Document changes in this README

## License

MIT

