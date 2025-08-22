import React from 'react';
import PaginaSidebar from './WikiSidebar';
import PaginaBreadcrumbs from './WikiBreadcrumbs';
import './WikiLayout.css';

const PaginaLayout = ({ children, category, page }) => {
  return (
    <div className="wiki-layout">
      {/* Sidebar */}
      <div className="wiki-layout-sidebar">
        <PaginaSidebar />
      </div>
      {/* Main Content */}
      <div className="wiki-layout-main">
        <PaginaBreadcrumbs category={category} page={page} />
        {/* Content Area */}
        <div className="wiki-layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PaginaLayout;
