# TIL Image Migration Exception Cases

## 📋 Document Purpose
This document catalogs all exception cases found in the til-source directory for image references that deviate from the standard `./img/filename.png` pattern. This serves as a reference for AI agents performing the migration to ensure no image links are broken.

## 🔍 Analysis Summary
- **Total image files found**: 291
- **Standard pattern files**: ~85% (`./img/` or `img/`)
- **Exception cases**: ~15% (requiring special handling)

## 🚨 Exception Cases Catalog

### 1. Cross-Directory References (../img/)
**Description**: Files referencing images in parent directory's img folder
**Count**: 3 cases

#### Case 1.1: Spring Boot File Processing
```markdown
File: til-source/back-end/spring/spring-boot/2022-03-19-SpringBootFile-req-res-prosessing.md
Line 52: <img width="400" src="../img/eximg.png">

Source Image: til-source/back-end/spring/img/eximg.png
Target: /assets/images/posts/programming/eximg.png
```

#### Case 1.2: Spring Security Architecture
```markdown
File: til-source/back-end/spring/spring-security/2022-03-19-spring-security.md
Line 35: <p align=center><img width=600 src=../img/spring-security-architecture.png>  <p>

Source Image: til-source/back-end/spring/img/spring-security-architecture.png
Target: /assets/images/posts/programming/spring-security-architecture.png
```

#### Case 1.3: JPA Auditing
```markdown
File: til-source/back-end/spring/jpa/2022-03-19-Auditing.md
Line 89: <img width="500"  src="../img/signup-API-postman.png">

Source Image: til-source/back-end/spring/img/signup-API-postman.png
Target: /assets/images/posts/programming/signup-API-postman.png
```

### 2. Subdirectory Structure (img/subfolder/)
**Description**: Images organized in subdirectories within img folder
**Count**: 5 cases (all in DevOps/prometheus)

#### Case 2.1: Prometheus Quick Start Images
```markdown
File: til-source/DevOps/prometheus/2022-02-06-prometheus-quick-start-with-docker.md

Line 55: <img width="750" src="img/quick-start/prometheus-main-page.png">
Line 59: <img width="750" src="img/quick-start/prometheus-config.png">
Line 64: <img width="750" src="img/quick-start/prometheus-targets-ex1.png">
Line 68: <img width="750" src="img/quick-start/prometheus-targets-ex2.png">
Line 75: <img width="750" src="img/quick-start/prometheus-metric-check.png">

Source Images: til-source/DevOps/prometheus/img/quick-start/
Target: /assets/images/posts/programming/
- prometheus-main-page.png
- prometheus-config.png
- prometheus-targets-ex1.png
- prometheus-targets-ex2.png
- prometheus-metric-check.png
```

### 3. Mixed Reference Patterns
**Description**: Files using both markdown and HTML img syntax inconsistently

#### Case 3.1: ERD Documentation
```markdown
File: til-source/DataBase/2020-12-22-Entity-Relationship-Diagram.md
Line 14: ![](./img/ERD.png)<img width="455px" src="./img/ERD-line.png"/>

Mixed syntax on same line - markdown ![](./img/ERD.png) and HTML <img src="./img/ERD-line.png"/>
```

#### Case 3.2: Thread Local Documentation
```markdown
File: til-source/programming/java/concurrent/2022-03-29-thread-local.md
Line 27: ![](img/thread-local-save1.png)  |  ![](img/thread-local-save2.png)
Line 145: ![](img/thread-local-issue-ex1.png)  |  ![](img/thread-local-issue-ex2.png)

Multiple images on single line using markdown syntax
```

### 4. HTML Tag Variations
**Description**: Different HTML img tag formats and attributes

#### Case 4.1: Attribute Variations
```html
<!-- Standard width with quotes -->
<img width="400" src="../img/eximg.png">

<!-- Width without quotes -->
<img width=600 src=../img/spring-security-architecture.png>

<!-- With alignment -->
<p align=center><img width=600 src=../img/spring-security-architecture.png>  <p>

<!-- Indented with spaces -->
   <img width=400 src="img/gradle-clean.png">

<!-- Nested in blockquote -->
    > <img width=350px src="./img/data-jpa-gradle-depedency.png">

<!-- Typo in attribute (wdith instead of width) -->
<img wdith="450px" src="./img/spring-package-flow.png">
```

### 5. Path Format Variations
**Description**: Different ways of writing image paths

```markdown
# Most common patterns:
./img/filename.png     # With dot-slash prefix (standard)
img/filename.png       # Without dot-slash prefix
../img/filename.png    # Parent directory reference
img/subfolder/file.png # Subdirectory structure

# Edge cases:
"./img/filename.png"   # With quotes
'./img/filename.png'   # With single quotes
./img/filename.PNG     # Uppercase extension (rare)
```

## 🔧 Migration Resolution Strategies

### Strategy 1: Cross-Directory References
```bash
# For ../img/ references:
# 1. Locate the actual image file in parent directory
# 2. Copy to category-based target directory
# 3. Update reference to absolute path

# Example transformation:
# Before: <img src="../img/eximg.png">
# After:  <img src="/assets/images/posts/programming/eximg.png">
```

### Strategy 2: Subdirectory Structure
```bash
# For img/subfolder/ references:
# 1. Flatten the directory structure
# 2. Rename files to include subfolder prefix
# 3. Update references accordingly

# Example transformation:
# Before: img/quick-start/prometheus-main-page.png
# After:  /assets/images/posts/programming/quick-start-prometheus-main-page.png
```

### Strategy 3: Mixed Syntax Handling
```bash
# Handle both markdown and HTML on same line:
# 1. Parse both ![](path) and <img src="path"> patterns
# 2. Update both to use absolute paths
# 3. Maintain original formatting (don't convert HTML to markdown or vice versa)
```

### Strategy 4: HTML Attribute Normalization
```bash
# Normalize HTML img tags while preserving functionality:
# 1. Keep all existing attributes (width, align, etc.)
# 2. Only update the src attribute
# 3. Handle malformed attributes gracefully
# 4. Preserve indentation and surrounding markup
```

## 📊 Exception Case Statistics

| Exception Type | Count | Percentage | Files Affected |
|---------------|-------|------------|----------------|
| Cross-directory (../img/) | 3 | 1% | 3 files |
| Subdirectory structure | 5 | 2% | 1 file |
| Mixed syntax | 10+ | 3% | Multiple files |
| HTML variations | 100+ | 35% | Majority of files |
| Path variations | All | 100% | All files |

## 🎯 Critical Migration Rules

### Rule 1: Preserve All Functionality
- Maintain all HTML attributes (width, height, align, etc.)
- Keep original file formats and extensions
- Preserve accessibility attributes if present

### Rule 2: Handle Edge Cases Gracefully
- Skip broken or missing image references with logging
- Handle malformed HTML tags without breaking
- Preserve original content if transformation fails

### Rule 3: Maintain Visual Layout
- Don't change markdown table structures with images
- Preserve multiple images on single lines
- Keep original indentation and spacing

### Rule 4: Image File Handling
- Copy all referenced images to target directories
- Handle duplicate filenames with category prefixes
- Verify image file existence before updating references

## 🔍 Validation Checklist

After migration, verify:

- [ ] All ../img/ references resolved correctly
- [ ] Subdirectory images copied and renamed properly
- [ ] Mixed syntax lines updated correctly
- [ ] HTML attributes preserved
- [ ] No broken image links in final output
- [ ] All edge cases handled without errors
- [ ] Original file structure preserved in til-source

## 📝 Implementation Notes

### For AI Agents:
1. **Parse Carefully**: Use robust regex patterns that handle variations
2. **Log Everything**: Record all transformations for verification
3. **Fail Gracefully**: Continue processing if individual files have issues
4. **Verify Results**: Check that all images load correctly after migration
5. **Preserve Context**: Don't modify surrounding markdown structure

### Testing Strategy:
1. Process a small subset of files first
2. Verify image accessibility in Jekyll build
3. Check for any broken references
4. Validate HTML markup remains valid
5. Ensure no content is lost or corrupted

---
**Document Created**: 2024-10-13  
**Last Updated**: 2024-10-13  
**Purpose**: Reference for AI-driven TIL to Jekyll migration