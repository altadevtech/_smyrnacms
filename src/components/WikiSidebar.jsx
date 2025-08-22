import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { ChevronDown, ChevronRight, Search, Tag, FileText, Home, Folder, FolderOpen } from 'lucide-react';
import './WikiSidebar.css';

const PaginaSidebar = () => {
  const [categories, setCategories] = useState([])
  const [pages, setPages] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPages, setFilteredPages] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchCategories()
    fetchPages()
  }, [])

  useEffect(() => {
    filterPages()
  }, [pages, searchTerm])

  const fetchCategories = async () => {
    try {
  const response = await api.get('/categories?type=page&hierarchical=true')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages/public')
      setPages(response.data)
    } catch (error) {
  console.error('Erro ao carregar páginas:', error)
    }
  }

  const filterPages = () => {
    if (!searchTerm) {
      setFilteredPages(pages)
      return
    }
    
    try {
      const search = searchTerm.toLowerCase()
      const filtered = pages.filter(page =>
        page.title?.toLowerCase().includes(search) ||
        page.content?.toLowerCase().includes(search)
      )
      setFilteredPages(filtered)
    } catch (error) {
  console.error('Erro ao filtrar páginas:', error)
      setFilteredPages([])
    }
  }

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getPagesByCategory = (categoryId) => {
    return filteredPages.filter(page => page.category_id === categoryId)
  }

  const getUncategorizedPages = () => {
    return filteredPages.filter(page => !page.category_id)
  }

  const getHomePage = () => {
    return pages.find(page => page.is_home)
  }

  const isCurrentPage = (slug) => {
  return location.pathname === `/pages/${slug}` || location.pathname === `/${slug}`
  }

  return (
    <div className="wiki-sidebar">
      {/* Header */}
      <div className="wiki-sidebar-header">
        <h2 className="wiki-sidebar-title">
          <FileText size={20} className="wiki-sidebar-title-icon" />
          Navegação de Páginas
        </h2>
        <div className="wiki-sidebar-search">
          <Search size={16} className="wiki-sidebar-search-icon" />
          <input
            type="text"
            placeholder="Buscar nas páginas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="wiki-sidebar-search-input"
          />
        </div>
      </div>
      {/* Home Page */}
      {getHomePage() && (
        <div className="wiki-sidebar-home">
          <Link
            to={`/${getHomePage().slug}`}
            className={`wiki-sidebar-home-link${isCurrentPage(getHomePage().slug) ? ' active' : ''}`}
          >
            <Home size={16} className="icon" />
            {getHomePage().title}
          </Link>
        </div>
      )}
      {/* Categories with Pages */}
      <div className="wiki-sidebar-categories">
        {categories.map(category => {
          const categoryPages = getPagesByCategory(category.id);
          const isExpanded = expandedCategories.has(category.id);
          const allPages = categoryPages.concat(
            ...(category.subcategories || []).map(sub => getPagesByCategory(sub.id))
          );
          if (allPages.length === 0 && !searchTerm && (!category.subcategories || category.subcategories.length === 0)) return null;
          return (
            <div key={category.id} className="wiki-sidebar-category">
              <button
                onClick={() => toggleCategory(category.id)}
                className="wiki-sidebar-category-btn"
              >
                {isExpanded ?
                  <ChevronDown size={14} className="icon" /> :
                  <ChevronRight size={14} className="icon" />
                }
                {isExpanded ?
                  <FolderOpen size={16} className="folder-icon" style={{ color: category.color || '#6366f1' }} /> :
                  <Folder size={16} className="folder-icon" style={{ color: category.color || '#6366f1' }} />
                }
                {category.name} ({allPages.length})
              </button>
              {isExpanded && (
                <div className="wiki-sidebar-category-content">
                  {categoryPages.map(page => (
                    <Link
                      key={page.id}
                      to={`/pages/${page.slug}`}
                      className={`wiki-sidebar-page-link${isCurrentPage(page.slug) ? ' active' : ''}`}
                    >
                      <FileText size={14} className="icon" />
                      {page.title}
                    </Link>
                  ))}
                  {category.subcategories && category.subcategories.map(subcategory => {
                    const subcategoryPages = getPagesByCategory(subcategory.id);
                    const isSubExpanded = expandedCategories.has(subcategory.id);
                    if (subcategoryPages.length === 0 && !searchTerm) return null;
                    return (
                      <div key={subcategory.id} className="wiki-sidebar-subcategory">
                        <button
                          onClick={() => toggleCategory(subcategory.id)}
                          className="wiki-sidebar-subcategory-btn"
                        >
                          {isSubExpanded ?
                            <ChevronDown size={12} className="icon" /> :
                            <ChevronRight size={12} className="icon" />
                          }
                          <Tag size={12} className="tag-icon" style={{ color: subcategory.color || '#8b5cf6' }} />
                          {subcategory.name} ({subcategoryPages.length})
                        </button>
                        {isSubExpanded && (
                          <div className="wiki-sidebar-subcategory-content">
                            {subcategoryPages.map(page => (
                              <Link
                                key={page.id}
                                to={`/pages/${page.slug}`}
                                className={`wiki-sidebar-subcategory-page-link${isCurrentPage(page.slug) ? ' active' : ''}`}
                              >
                                <FileText size={12} className="icon" />
                                {page.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Uncategorized Pages */}
      {getUncategorizedPages().length > 0 && (
        <div className="wiki-sidebar-uncategorized">
          <button
            onClick={() => toggleCategory('uncategorized')}
            className="wiki-sidebar-uncategorized-btn"
          >
            {expandedCategories.has('uncategorized') ?
              <ChevronDown size={14} className="icon" /> :
              <ChevronRight size={14} className="icon" />
            }
            <Tag size={16} className="tag-icon" />
            Sem categoria ({getUncategorizedPages().length})
          </button>
          {expandedCategories.has('uncategorized') && (
            <div className="wiki-sidebar-uncategorized-content">
              {getUncategorizedPages().map(page => (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                  className={`wiki-sidebar-uncategorized-page-link${isCurrentPage(page.slug) ? ' active' : ''}`}
                >
                  <FileText size={14} className="icon" />
                  {page.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Search Results */}
      {searchTerm && filteredPages.length === 0 && (
        <div className="wiki-sidebar-empty">
          Nenhuma página encontrada
        </div>
      )}
      {/* Footer */}
      <div className="wiki-sidebar-footer">
        {filteredPages.length} página{filteredPages.length !== 1 ? 's' : ''} encontrada{filteredPages.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default PaginaSidebar