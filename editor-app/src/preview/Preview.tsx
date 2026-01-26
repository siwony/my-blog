import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Preview.css';

interface PreviewProps {
  content: string;
}

interface CodeProps {
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <div className="preview-container">
      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, children, ...props }: CodeProps) {
              return inline ? (
                <code {...props}>{children}</code>
              ) : (
                <pre>
                  <code {...props}>{children}</code>
                </pre>
              );
            },
          }}
        >
          {content || '# Preview\n\nYour markdown will appear here...'}
        </ReactMarkdown>
      </div>
    </div>
  );
};
