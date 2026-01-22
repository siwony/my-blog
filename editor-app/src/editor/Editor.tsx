import React, { ChangeEvent } from 'react';
import './Editor.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="editor-container">
      <textarea
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        placeholder="# Start typing your markdown here..."
        spellCheck={false}
      />
    </div>
  );
};
