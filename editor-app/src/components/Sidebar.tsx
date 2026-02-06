import React from 'react';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Files</h3>
      </div>
      <div className="sidebar-content">
        <p className="sidebar-placeholder">File browser coming soon...</p>
      </div>
    </div>
  );
};
