# Jekyll Markdown Editor - UI Layout

## Application Screenshot (Mockup)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Jekyll Markdown Editor            [📝 Hide Preview]  [💾 Save]             │
├──────────┬──────────────────────────────┬───────────────────────────────────┤
│          │                              │                                   │
│  Files   │  # Welcome to Jekyll         │  Welcome to Jekyll                │
│          │  Markdown Editor             │  Markdown Editor                  │
│ ────────│                              │  ═══════════════════              │
│          │  Start typing your           │                                   │
│  File    │  markdown here...            │  Start typing your markdown       │
│  browser │                              │  here...                          │
│  coming  │  ## Features                 │                                   │
│  soon... │                              │  Features                         │
│          │  - Live preview              │  ─────────                        │
│          │  - Syntax highlighting       │                                   │
│          │  - Support for lists         │  • Live preview                   │
│          │                              │  • Syntax highlighting            │
│          │  ```javascript               │  • Support for lists              │
│          │  const hello = "world";      │                                   │
│          │  console.log(hello);         │  ┌─────────────────────────┐     │
│          │  ```                         │  │ const hello = "world";  │     │
│          │                              │  │ console.log(hello);     │     │
│          │                              │  └─────────────────────────┘     │
│          │                              │                                   │
│          │                              │                                   │
│          │                              │                                   │
└──────────┴──────────────────────────────┴───────────────────────────────────┘
   250px           Editor Pane                    Preview Pane
 (Sidebar)     (Dark theme, monospace)        (White bg, rendered)
```

## UI Components

### 1. Top Bar (Header)
- **Title**: "Jekyll Markdown Editor"
- **Controls**:
  - Toggle Preview Button: 📝 Hide Preview / 👁️ Show Preview
  - Save Button: 💾 Save (Cmd+S / Ctrl+S)

### 2. Sidebar (Left Panel - 250px)
- **Header**: "Files"
- **Content**: Placeholder text "File browser coming soon..."
- **Style**: Dark theme (#252526)

### 3. Editor Pane (Middle Panel - 50% when preview shown)
- **Component**: Textarea with markdown content
- **Style**: 
  - Dark background (#1e1e1e)
  - Light text (#d4d4d4)
  - Monospace font (Monaco, Menlo, Ubuntu Mono)
  - 20px padding
- **Features**:
  - Real-time editing
  - Placeholder text
  - Auto-resize

### 4. Preview Pane (Right Panel - 50% when visible)
- **Component**: Rendered markdown preview
- **Style**:
  - White background
  - GitHub-style markdown rendering
  - Code blocks with light gray background
  - Proper heading hierarchy
  - List formatting
- **Features**:
  - Live updates as you type
  - GitHub Flavored Markdown support
  - Code fence rendering

## Color Scheme

### Dark Theme (Editor)
- Background: `#1e1e1e`
- Text: `#d4d4d4`
- Sidebar: `#252526`
- Header: `#2d2d30`
- Borders: `#1e1e1e`

### Light Theme (Preview)
- Background: `#ffffff`
- Text: `#000000`
- Code blocks: `#f6f8fa`
- Borders: `#eaecef`
- Links: `#0366d6`

## Interaction

### Keyboard Shortcuts
- `Cmd+S` / `Ctrl+S`: Triggers save action (shows toast notification)
- Typing in editor: Immediately updates preview

### Mouse Actions
- Click "Hide Preview": Expands editor to full width
- Click "Show Preview": Restores split view
- Click "Save": Shows toast notification and logs to console

## Toast Notification

When save is triggered:
```
┌─────────────────────────────────────┐
│ ✓ Document saved (placeholder)      │
└─────────────────────────────────────┘
```
Appears bottom-right, green background, auto-dismisses after 3 seconds

## Responsive Behavior

- Sidebar: Fixed 250px width
- Editor + Preview: Split remaining space 50/50
- When preview hidden: Editor takes 100% of remaining space
- Smooth transition when toggling preview (0.3s)
