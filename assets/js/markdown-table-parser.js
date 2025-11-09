/**
 * Markdown Table Parser and Renderer
 * Converts Markdown table syntax to GitHub-style HTML tables
 */
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    tableRegex: /^\s*\|(.+)\|\s*\n\s*\|[-:\s\|]+\|\s*\n((?:\s*\|.*\|\s*\n?)*)/gm,
    rowRegex: /^\s*\|(.*)\|\s*$/gm,
    cellSeparator: /\s*\|\s*/,
    alignmentRegex: /^\s*:?-+:?\s*$/,
    tableClass: 'markdown-table',
    wrapperClass: 'table-wrapper'
  };

  /**
   * Parse alignment from separator row
   * @param {string} separatorCell - Individual separator cell (e.g., ":---:", "---:", "---")
   * @returns {string} - Alignment value: 'left', 'center', 'right'
   */
  function parseAlignment(separatorCell) {
    const trimmed = separatorCell.trim();
    
    if (trimmed.startsWith(':') && trimmed.endsWith(':')) {
      return 'center';
    } else if (trimmed.endsWith(':')) {
      return 'right';
    } else {
      return 'left';
    }
  }

  /**
   * Parse a single table row into cells
   * @param {string} row - Raw table row string
   * @returns {Array<string>} - Array of cell contents
   */
  function parseRow(row) {
    // Remove leading/trailing pipes and split by separator
    const content = row.replace(/^\s*\||\|\s*$/g, '');
    return content.split(CONFIG.cellSeparator).map(cell => {
      // Clean up cell content and handle inline markdown
      return cell.trim()
        .replace(/\\\|/g, '|') // Unescape pipes
        .replace(/\\\\/g, '\\'); // Unescape backslashes
    });
  }

  /**
   * Parse separator row to determine column alignments
   * @param {string} separatorRow - The separator row (e.g., "|:---|:---:|---:|")
   * @returns {Array<string>} - Array of alignment values
   */
  function parseSeparatorRow(separatorRow) {
    const cells = parseRow(separatorRow);
    return cells.map(cell => {
      if (!CONFIG.alignmentRegex.test(cell.trim())) {
        console.warn(`Invalid separator cell: "${cell}". Defaulting to left alignment.`);
        return 'left';
      }
      return parseAlignment(cell);
    });
  }

  /**
   * Escape HTML characters in cell content
   * @param {string} content - Raw cell content
   * @returns {string} - HTML-escaped content
   */
  function escapeHtml(content) {
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
  }

  /**
   * Process inline markdown in cell content
   * @param {string} content - Raw cell content
   * @returns {string} - Processed HTML content
   */
  function processInlineMarkdown(content) {
    return content
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Inline code: `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Escape remaining HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Render table data to HTML
   * @param {Object} tableData - Parsed table data
   * @returns {string} - HTML string
   */
  function renderTable(tableData) {
    const { headers, alignments, rows } = tableData;
    
    // Generate header HTML
    const headerHtml = headers.map((header, index) => {
      const alignment = alignments[index] || 'left';
      const alignClass = alignment !== 'left' ? ` text-${alignment}` : '';
      const processedHeader = processInlineMarkdown(header);
      
      return `<th scope="col" class="${alignClass.trim()}" style="text-align: ${alignment}">${processedHeader}</th>`;
    }).join('\n        ');

    // Generate body HTML
    const bodyHtml = rows.map(row => {
      const cellsHtml = row.map((cell, index) => {
        const alignment = alignments[index] || 'left';
        const alignClass = alignment !== 'left' ? ` text-${alignment}` : '';
        const processedCell = processInlineMarkdown(cell);
        
        return `<td class="${alignClass.trim()}" style="text-align: ${alignment}">${processedCell}</td>`;
      }).join('\n          ');
      
      return `<tr>\n          ${cellsHtml}\n        </tr>`;
    }).join('\n        ');

    return `<div class="${CONFIG.wrapperClass}">
      <table class="${CONFIG.tableClass}" role="table">
        <thead>
          <tr>
        ${headerHtml}
          </tr>
        </thead>
        <tbody>
        ${bodyHtml}
        </tbody>
      </table>
    </div>`;
  }

  /**
   * Parse markdown table string into structured data
   * @param {string} tableString - Raw markdown table string
   * @returns {Object|null} - Parsed table data or null if invalid
   */
  function parseMarkdownTable(tableString) {
    const lines = tableString.trim().split('\n');
    
    if (lines.length < 3) {
      console.warn('Invalid table: minimum 3 lines required (header, separator, data)');
      return null;
    }

    try {
      // Parse header row
      const headerRow = lines[0];
      const headers = parseRow(headerRow);
      
      // Parse separator row
      const separatorRow = lines[1];
      const alignments = parseSeparatorRow(separatorRow);
      
      // Validate column count consistency
      if (headers.length !== alignments.length) {
        console.warn('Column count mismatch between header and separator');
        return null;
      }
      
      // Parse data rows
      const rows = [];
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const rowCells = parseRow(line);
          // Pad or truncate to match header column count
          while (rowCells.length < headers.length) {
            rowCells.push('');
          }
          if (rowCells.length > headers.length) {
            rowCells.splice(headers.length);
          }
          rows.push(rowCells);
        }
      }
      
      return { headers, alignments, rows };
      
    } catch (error) {
      console.error('Error parsing table:', error);
      return null;
    }
  }

  /**
   * Find and replace all markdown tables in content
   * @param {string} content - Full markdown content
   * @returns {string} - Content with tables converted to HTML
   */
  function convertMarkdownTables(content) {
    return content.replace(CONFIG.tableRegex, (match, headerAndSeparator, bodyRows) => {
      const fullTable = match.trim();
      const tableData = parseMarkdownTable(fullTable);
      
      if (tableData) {
        return renderTable(tableData);
      } else {
        // Return original if parsing failed
        console.warn('Failed to parse table, keeping original markdown');
        return match;
      }
    });
  }

  /**
   * Process all markdown tables in the document
   */
  function processMarkdownTables() {
    // Process all potential containers that might have markdown content
    const selectors = [
      '.post-content',
      '.content',
      'article',
      '.markdown-content',
      'main'
    ];
    
    let processed = false;
    
    for (const selector of selectors) {
      const containers = document.querySelectorAll(selector);
      
      containers.forEach(container => {
        // Skip if already processed
        if (container.dataset.tablesProcessed === 'true') {
          return;
        }
        
        const originalContent = container.innerHTML;
        
        // Convert HTML back to text to find markdown tables
        const textContent = container.textContent || container.innerText || '';
        
        // Only process if we find potential table syntax
        if (textContent.includes('|') && textContent.includes('---')) {
          try {
            // For now, we'll focus on processing specific markdown content
            // This is a simplified approach - in a real implementation,
            // we might need to integrate more deeply with the markdown processor
            console.log('Found potential markdown table content');
          } catch (error) {
            console.error('Error processing markdown tables:', error);
          }
        }
        
        // Mark as processed
        container.dataset.tablesProcessed = 'true';
        processed = true;
      });
    }
    
    if (!processed) {
      console.log('No markdown table containers found');
    }
  }

  /**
   * Initialize the markdown table processor
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', processMarkdownTables);
    } else {
      processMarkdownTables();
    }
    
    // Also process after any dynamic content loads
    window.addEventListener('load', processMarkdownTables);
  }

  // Public API
  window.MarkdownTableRenderer = {
    parseMarkdownTable,
    renderTable,
    convertMarkdownTables,
    processMarkdownTables,
    init
  };

  // Auto-initialize
  init();

})();