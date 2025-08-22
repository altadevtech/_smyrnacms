import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './WikiBreadcrumbs.css';

const PaginaBreadcrumbs = ({ category, page }) => {
  return (
    <nav className="wiki-breadcrumbs">
      <Link to="/" className="wiki-breadcrumbs-link">
        <Home size={14} style={{ marginRight: '0.25rem' }} />
        Início
      </Link>
      <ChevronRight size={14} className="wiki-breadcrumbs-chevron" />
      <Link to="/pages" className="wiki-breadcrumbs-link">
        Páginas
      </Link>
      {category && (
        <>
          <ChevronRight size={14} className="wiki-breadcrumbs-chevron" />
          <span
            className="wiki-breadcrumbs-category"
            style={category.color ? { '--color-category': category.color } : {}}
          >
            {category.name}
          </span>
        </>
      )}
      {page && (
        <>
          <ChevronRight size={14} className="wiki-breadcrumbs-chevron" />
          <span className="wiki-breadcrumbs-page">
            {page.title}
          </span>
        </>
      )}
    </nav>
  );
};

export default PaginaBreadcrumbs;
