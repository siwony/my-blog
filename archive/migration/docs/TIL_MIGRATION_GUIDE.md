# TIL to Jekyll Blog Migration Guide

## 📋 Overview
This document provides AI-friendly instructions for migrating markdown files from `/Users/jeongcool/me/my-tech-blog/til-source` to the Jekyll blog at `/Users/jeongcool/me/my-tech-blog/_posts`.

## 🎯 Migration Objectives
1. Preserve all content and metadata
2. Standardize front matter format
3. Maintain proper file naming conventions
4. Organize content by categories
5. Ensure proper date handling

## 📁 Source Structure Analysis
```
/Users/jeongcool/me/my-tech-blog/til-source/
├── Algorithm/
├── Book/
├── DataBase/
├── DevOps/
├── ETC/
├── Git/
├── OS/
├── back-end/
├── cs/
├── network/
├── programming/
└── [other directories]
```

## 📁 Target Structure
```
/Users/jeongcool/me/my-tech-blog/_posts/
└── YYYY-MM-DD-title.md
```

## 🔧 Migration Rules

### 1. File Naming Convention
- **Format**: `YYYY-MM-DD-title.md`
- **Date Source**: Extract from existing filename or front matter `date` field
- **Title Source**: Convert from filename or front matter `title` field
- **Sanitization**: 
  - Replace spaces with hyphens
  - Convert to lowercase
  - Remove special characters except hyphens
  - Limit to 50 characters maximum

### 2. Front Matter Standardization
**Required Front Matter Template:**
```yaml
---
layout: post
title: "Extracted Title"
date: YYYY-MM-DD HH:MM:SS +0900
categories: mapped_category
tags: [extracted_tags]
author: "jeongcool"
---
```

### 3. Category Mapping Rules
```yaml
Directory → Blog Category Mapping:
- Algorithm → programming
- Book → general
- DataBase → programming
- DevOps → programming
- ETC → general
- Git → programming
- OS → programming
- back-end → programming
- cs → programming
- network → programming
- programming → programming
```

**Note**: Current blog has these available categories: general, programming, test, tutorial, web-development

### 4. Content Processing Rules

#### A. Header Processing
- Remove duplicate title headers if they match the front matter title
- Ensure proper header hierarchy (start with h2 if title is already in front matter)
- Preserve all other content exactly as-is

#### B. Link Processing
- Convert relative links to absolute where necessary
- **IMAGE MIGRATION STRATEGY**: Copy all image files and update references
- Update internal TIL links to point to new blog structure

#### C. Image Processing Rules
**CRITICAL: Images must be migrated to maintain functionality**

1. **Image Directory Structure**:
   - Create `/assets/images/posts/` directory in blog root
   - Organize by original category: `/assets/images/posts/{category}/`
   - Preserve original filenames to avoid conflicts

2. **Image File Migration**:
   ```bash
   # For each markdown file being migrated:
   # 1. Identify all image references (./img/ or img/)
   # 2. Copy images to new location
   # 3. Update image paths in markdown content
   ```

3. **Image Path Conversion**:
   - `./img/filename.png` → `/assets/images/posts/{category}/filename.png`
   - `img/filename.png` → `/assets/images/posts/{category}/filename.png`
   - `../img/filename.png` → `/assets/images/posts/{category}/filename.png`
   - `img/subfolder/filename.png` → `/assets/images/posts/{category}/subfolder-filename.png`

4. **Complex Image Reference Patterns**:
   ```markdown
   # Handle cross-directory references:
   # Before: ../img/spring-security-architecture.png
   # After: /assets/images/posts/programming/spring-security-architecture.png
   
   # Handle subdirectory structures:
   # Before: img/quick-start/prometheus-main-page.png  
   # After: /assets/images/posts/programming/quick-start-prometheus-main-page.png
   ```

5. **HTML img tag conversion**:
   ```html
   <!-- Before: -->
   <img width="400" src="../img/eximg.png">
   
   <!-- After: -->
   <img width="400" src="/assets/images/posts/programming/eximg.png">
   ```

4. **Image Reference Update**:
   ```markdown
   # Before:
   ![description](./img/example.png)
   
   # After:
   ![description](/assets/images/posts/programming/example.png)
   ```

#### D. Code Block Processing
- Preserve all code blocks exactly as-is
- Ensure proper language specification for syntax highlighting
- No modification to inline code

### 5. Date Extraction Logic
**Priority Order:**
1. Front matter `date` field (if exists and valid)
2. Filename date pattern (YYYY-MM-DD)
3. File creation date as fallback
4. Current date if all else fails

**Date Format**: Always use `YYYY-MM-DD HH:MM:SS +0900` format

### 6. Tag Extraction Rules
- Extract from existing front matter `tags` field
- Add category-based default tags
- Preserve all existing tags
- Add "TIL" tag to all migrated posts
- Convert tag format to lowercase, hyphenated

## 🤖 AI Execution Instructions

### Step 1: Discovery Phase
```bash
# List all markdown files in TIL directory
find /Users/jeongcool/me/my-tech-blog/til-source -name "*.md" -type f

# For each file, extract:
# - Current file path
# - Existing front matter (if any)
# - First few lines to identify title
# - File modification date
```

### Step 2: Processing Phase
For each file:
1. **Parse existing front matter** (if present)
2. **Extract title** from front matter or filename
3. **Determine category** using directory mapping
4. **Extract/generate date** using priority logic
5. **Identify and catalog images** in same directory (including subdirectories)
6. **Resolve cross-directory image references** (../img/ patterns)
7. **Generate new filename** following convention
8. **Create standardized front matter**
9. **Process content** according to content rules
10. **Update image references** to new paths (both markdown and HTML img tags)

### Step 3: Migration Phase
```bash
# For each file:
# 1. Create assets/images/posts/{category}/ directory if not exists
mkdir -p "/Users/jeongcool/me/my-tech-blog/assets/images/posts/{category}"

# 2. Copy all images from source img/ folder to new location
cp source_folder/img/* "/Users/jeongcool/me/my-tech-blog/assets/images/posts/{category}/"

# 3. Copy markdown file to new location with new name
cp "source_file" "/Users/jeongcool/me/my-tech-blog/_posts/new_filename"

# 4. Verify front matter is correct
# 5. Verify content and image paths are updated
# 6. Verify images are accessible
```

### Step 4: Validation Phase
- Ensure no duplicate filenames
- Verify all front matter is valid YAML
- Check that all files are properly formatted
- Test Jekyll build compatibility

## 📝 Example Transformation

### Before (TIL):
```
File: /Users/jeongcool/me/my-tech-blog/til-source/DataBase/2022-03-15-optimizer.md
---
layout: post
author: "정시원"
title: "Optimizer - 옵티마이저"
categories: DataBase
date: 2022-03-15
tags: []
---

# Optimizer - 옵티마이저
![ERD Diagram](./img/erd-example.png)
Content here...
```

### After (Blog):
```
File: /Users/jeongcool/me/my-tech-blog/_posts/2022-03-15-optimizer-옵티마이저.md
---
layout: post
title: "Optimizer - 옵티마이저"
date: 2022-03-15 00:00:00 +0900
categories: programming
tags: [database, optimizer, TIL]
author: "jeongcool"
---

# Optimizer - 옵티마이저
![ERD Diagram](/assets/images/posts/programming/erd-example.png)
Content here...
```

**Image Migration:**
```
Source: /Users/jeongcool/me/my-tech-blog/til-source/DataBase/img/erd-example.png
Target: /Users/jeongcool/me/my-tech-blog/assets/images/posts/programming/erd-example.png
```

## ⚠️ Important Notes

### Do NOT Modify:
- Code blocks and inline code
- Image references and links
- Mathematical expressions
- Special formatting
- Original content structure

### DO Modify:
- Front matter format only
- File names and locations
- Category standardization
- Tag format consistency
- **Image paths to point to new location**

### Image Migration Requirements:
- Copy all images from `til-source/{category}/img/` to `assets/images/posts/{category}/`
- Update all image references in markdown content
- Preserve original image filenames
- Test image accessibility after migration

### Error Handling:
- Log any files that cannot be processed
- Skip binary files or non-markdown files
- Handle special characters in filenames gracefully
- **Handle cross-directory image references** (resolve ../img/ paths)
- **Flatten subdirectory structures** in image naming
- **Convert both markdown and HTML image syntax**
- Preserve original files (copy, don't move)

## 🔍 Validation Checklist
- [ ] All files copied successfully
- [ ] All images copied to correct directories
- [ ] No content loss or corruption
- [ ] Valid YAML front matter in all files
- [ ] Proper date formats
- [ ] Category mapping applied correctly
- [ ] **All image paths updated correctly**
- [ ] **All images accessible from new paths**
- [ ] No duplicate filenames
- [ ] Jekyll can build successfully
- [ ] All links and images work correctly

## 📊 Expected Statistics
Based on the TIL structure, expect approximately:
- 100+ markdown files to migrate
- 50+ image files to copy and relink
- 10+ categories to map
- Multiple date formats to standardize
- Various front matter formats to unify
- Image path updates in most files

## 🚀 Execution Command Template
```bash
# AI should execute migration in this order:
1. Analysis phase: Scan and catalog all files and images
2. Planning phase: Generate migration plan with image mapping
3. Directory setup: Create assets/images/posts/ subdirectories
4. Image migration: Copy all images to new locations
5. Content migration: Copy and update markdown files
6. Path updates: Update all image references in content
7. Validation phase: Verify results and image accessibility
8. Cleanup phase: Generate migration report
```

---
**Note**: This guide is designed for AI agents. Human review is recommended after migration completion.